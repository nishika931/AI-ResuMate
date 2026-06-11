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
    resume_score: {
      type: String,
    },
    job_description: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true },
);

const ResumeModel = mongoose.model("resume", ResumeSchema);

module.exports = ResumeModel;
