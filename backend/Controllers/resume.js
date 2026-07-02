const ResumeModel = require("../Models/resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
require("dotenv").config();

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

console.log("COHERE KEY:", process.env.COHERE_API_KEY);

exports.AnalyzeResume = async (req, res) => {
  console.log("AnalyzeResume controller started");
  let pdfPath;

  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No resume uploaded",
      });
    }

    pdfPath = req.file.path;

    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    const { job_description, user } = req.body;
    if (!user) {
      return res.status(400).json({
        error: "User is required",
      });
    }

    const prompt = `
You are a STRICT ATS Resume Analyzer AI.

You MUST ONLY perform resume vs job description analysis.

You are NOT allowed to:
- answer any other questions
- give explanations outside the required JSON
- talk about anything unrelated to resume matching
- deviate from the output format

If the input is not a Resume and Job Description, respond with:
{
  "error": "Invalid input. Provide both Resume and Job Description only."
}

---

TASK:
Compare the Resume with the Job Description and generate ATS analysis.
match_score MUST be an integer from 0 to 100.
ats_score MUST be an integer from 0 to 100.

---

INPUT:

Resume:
${pdfData.text}

Job Description:
${job_description}

---

OUTPUT IN THIS FORMAT ONLY (STRICT JSON ONLY):

{
  "match_score": 60,
  "ats_score": 70,
  "matching_skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "top_improvements": [],
  "final_recommendation": ""
}

---

RULES (VERY IMPORTANT):

1. Output MUST be valid JSON only
3. No greetings, no conversation
4. No answering user questions outside task
5. If input is missing or unrelated → return error JSON only
`;

    console.log("PDF Text Length:", pdfData.text.length);
    console.log("Job Description:", job_description);

    // Cohere API Call
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      temperature: 0.2,
    });

    console.log("=== COHERE RESPONSE ===");
    console.log(response);

    const result = response.text || response?.message?.content?.[0]?.text || "";

    console.log("=== RESULT ===");
    console.log(result);

    let aiData;

    try {
      aiData = JSON.parse(result);
    } catch (err) {
      console.log("RAW AI OUTPUT:", result);

      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: result,
      });
    }
    console.log("user =", user);

    const newResume = new ResumeModel({
      user,
      resume_name: req.file.originalname,
      job_description,

      resume_score: aiData.match_score,
      ats_score: aiData.ats_score,

      matching_skills: aiData.matching_skills,
      missing_skills: aiData.missing_skills,

      strengths: aiData.strengths,
      weaknesses: aiData.weaknesses,

      top_improvements: aiData.top_improvements,
      feedback: aiData.final_recommendation,
    });

    await newResume.save();

    res.status(200).json({
      success: true,
      message: "Resume analysis completed",
      data: aiData,
    });
  } catch (err) {
    console.error("Resume Analysis Error:", err);

    res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  } finally {
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }
};

exports.getAllResumeForUser = async (req, res) => {
  try {
    const { user } = req.params;

    if (!user || user === "undefined") {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }

    let resumes = await ResumeModel.find({ user: user }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "your previous history",
      resumes: resumes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "server error",
      message: err.message,
    });
  }
};

exports.getResumeForAdmin = async (req, res) => {
  try {
    let resumes = await ResumeModel.find({})
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "fetched all history",
      resumes,
    });
  } catch (err) {
    return res.status(500).json({
      error: "server error",
      message: err.message,
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    await ResumeModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  }
};
