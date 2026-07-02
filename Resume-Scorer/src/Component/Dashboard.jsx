import React, { useState } from "react";
import { MdCreditScore } from "react-icons/md";
import withAuth from "../utils/HOC/withAuthHOC";
import axios from "../utils/axios";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

const Dashboard = () => {
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [Filetext, setFileText] = useState("Attach your Resume (PDF only)");
  const { userInfo } = useContext(AuthContext);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    if (!jobDesc || !resumeFile) {
      setError("Please fill the Job Description & Upload Resume");
      setLoading(false);

      setTimeout(() => setError(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDesc);
    formData.append("user", userInfo._id);
    try {
      const response = await axios.post("/api/resume/AnalyzeResume", formData);
      console.log(response.data);
      console.log(response.data.data);
      console.dir(response.data.data);

      setResult(response.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    setDisable(true);
    setFileText(e.target.files[0].name);
    setResumeFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start">
      {/* LEFT SIDE - INPUT */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-start bg-white pt-20">
        <div className="w-[90%] md:w-[80%] flex flex-col items-center gap-4">
          <div className="font-bold text-3xl md:text-4xl text-center">
            Smart Resume Analyzer
          </div>

          <p className="text-lg md:text-xl text-center">
            Get your resume score now!
          </p>

          <p
            className={`text-center text-sm md:text-base ${
              disable ? "text-[#2DC08D] font-semibold" : "text-gray-600"
            }`}
          >
            {Filetext}
          </p>

          <textarea
            value={jobDesc}
            onChange={(e) => {
              setJobDesc(e.target.value);
            }}
            className="text-gray-700 border p-2 resize-none w-full h-24 text-center"
            placeholder="Describe your Job Description Here."
          />

          {/* UPLOAD */}
          <label
            className={`cursor-pointer px-6 py-2 rounded-lg inline-flex items-center justify-center transition-all duration-200
  ${disable ? "bg-gray-300" : "bg-[#2DC08D]"}`}
          >
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={disable}
              onChange={handleClick}
            />
          </label>

          {/* ANALYZE BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-10 py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm font-medium text-center">
            {error}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 h-screen bg-[#f5f5f5] flex flex-col items-center pt-20">
        <span className="font-bold text-3xl">Result</span>

        <p className="mt-2 text-center px-4">
          Here is your resume analysis result.
        </p>

        <div className="mt-6 w-[90%] max-w-2xl p-5 bg-[#BDA6CE] rounded-md flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          {loading ? (
            // SKELETON
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
              <div className="h-6 w-10 bg-gray-300 rounded"></div>

              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-300 rounded"></div>
                <div className="h-3 w-[90%] bg-gray-300 rounded"></div>
                <div className="h-3 w-[80%] bg-gray-300 rounded"></div>
              </div>
            </div>
          ) : result ? (
            // RESULT STATE
            <>
              <div className="flex items-center gap-3 text-2xl font-semibold">
                <span>Match Score: {result.match_score}%</span>
                <MdCreditScore className="text-3xl" />
              </div>

              <div>
                <h3 className="font-bold">ATS Score</h3>
                <p>{result.ats_score}%</p>
              </div>

              <div>
                <h3 className="font-bold">Matching Skills</h3>
                <ul className="list-disc ml-5">
                  {result.matching_skills?.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold">Missing Skills</h3>
                <ul className="list-disc ml-5">
                  {result.missing_skills?.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold">Strengths</h3>
                <ul className="list-disc ml-5">
                  {result.strengths?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold">Weaknesses</h3>
                <ul className="list-disc ml-5">
                  {result.weaknesses?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold">Top Improvements</h3>
                <ul className="list-disc ml-5">
                  {result.top_improvements?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold">Recommendation</h3>
                <p>{result.final_recommendation}</p>
              </div>
            </>
          ) : (
            // DEFAULT (IMPORTANT)
            <div className="text-center text-gray-600">
              Upload your resume and click <b>Analyze</b> to see results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
