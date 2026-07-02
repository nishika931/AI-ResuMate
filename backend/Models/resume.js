const mongoose = require("mongoose");

const ResumeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    resume_name: {
      type: String,
      required: true,
    },

    job_description: {
      type: String,
      required: true,
    },

    resume_score: {
      type: String,
    },

    match_score: {
      type: Number,
    },

    ats_score: {
      type: Number,
    },

    matching_skills: {
      type: [String],
      default: [],
    },

    missing_skills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    top_improvements: {
      type: [String],
      default: [],
    },

    final_recommendation: {
      type: String,
    },

    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

const ResumeModel = mongoose.model("resume", ResumeSchema);

module.exports = ResumeModel;