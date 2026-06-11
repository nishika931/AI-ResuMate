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
You are an ATS Resume Analyzer.

Compare the Resume with the Job Description and provide:

1. Match Score (0-100)
2. ATS Compatibility Score (0-100)
3. Matching Skills
4. Missing Skills
5. Strengths
6. Weaknesses
7. Top 5 Improvements
8. Final Recommendation

Resume:
${pdfData.text}

Job Description:
${job_description}

Return ONLY in this format:

Score: XX
Reason: Your detailed feedback here.
`;

    console.log("PDF Text Length:", pdfData.text.length);
    console.log("Job Description:", job_description);

    // Cohere API Call
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      temperature: 0.7,
    });

    console.log(response);

    const result = response.text || "";

    // Extract score
    const scoreMatch = result.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? Number(scoreMatch[1]) : 0;

    // Extract reason
    const reasonMatch = result.match(/Reason:\s*([\s\S]*)/i);
    const reason = reasonMatch
      ? reasonMatch[1].trim()
      : "No feedback generated.";

    console.log("user =", user);
    console.log("req.user =", req.user);

    const newResume = new ResumeModel({
      user,
      resume_name: req.file.originalname,
      job_description,
      resume_score: score,
      feedback: reason,
    });

    await newResume.save();

    res.status(200).json({
      success: true,
      message: "Resume analysis completed",
      data: newResume,
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
