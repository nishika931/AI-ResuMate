const ResumeModel = require("../Models/resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
require("dotenv").config();

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

exports.AnalyzeResume = async (req, res) => {
  let pdfPath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    pdfPath = req.file.path;

    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    const { job_description, user } = req.body;

    if (!user || !job_description) {
      return res.status(400).json({
        error: "User and Job Description are required",
      });
    }

    // ================= PROMPT =================
    console.log("🔥 AnalyzeResume API CALLED");
    const prompt = `
You are an expert ATS Resume Analyzer.

TASK:
Compare Resume and Job Description and generate strict ATS evaluation.

SCORING RULES:
- Start from 100
- Deduct 10–20 for each missing important skill
- Deduct for weak experience relevance
- Add +5 to +10 for strong matching skills
- Be strict and realistic (NO default scores like 50–60)

MATCH SCORE GUIDE:
- 90–100: Excellent match
- 70–89: Strong match
- 50–69: Average match
- Below 50: Weak match

ATS SCORE:
- Based on keyword match with job description
- Realistic evaluation required

IMPORTANT:
- Do NOT be vague
- Do NOT return default values
- Be precise and realistic

OUTPUT MUST BE ONLY VALID JSON:

{
  "match_score": 0,
  "ats_score": 0,
  "matching_skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "top_improvements": [],
  "final_recommendation": ""
}

Resume:
${pdfData.text}

Job Description:
${job_description}
`;

    // ================= COHERE CALL =================
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      temperature: 0.3,
    });

    const rawText =
      response?.text || response?.message?.content?.[0]?.text || "";

    let aiData;

    try {
      aiData = JSON.parse(rawText);
    } catch (err) {
      console.log("❌ RAW AI OUTPUT:", rawText);

      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: rawText,
      });
    }

    // ================= SAVE TO DB =================
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

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Resume analysis completed",
      data: aiData,
    });
  } catch (err) {
    console.error("Resume Analysis Error:", err);

    return res.status(500).json({
      error: "Server Error",
      message: err.message,
    });
  } finally {
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }
};

// ================= HISTORY =================
exports.getAllResumeForUser = async (req, res) => {
  try {
    const { user } = req.params;

    if (!user) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const resumes = await ResumeModel.find({ user }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "User history fetched",
      resumes,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// ================= ADMIN =================
exports.getResumeForAdmin = async (req, res) => {
  try {
    const resumes = await ResumeModel.find({})
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All resumes fetched",
      resumes,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// ================= DELETE =================
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