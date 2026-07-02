import React, { useEffect, useState, useContext } from "react";
import { MdCreditScore } from "react-icons/md";
import withAuth from "../utils/HOC/withAuthHOC";
import axios from "../utils/axios";
import { AuthContext } from "../utils/AuthContext";

const History = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    if (!userInfo?._id) return;

    const fetchHistory = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/resume/get/${userInfo._id}`);
        setData(res.data.resumes || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load history");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userInfo?._id]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-6 sm:py-10 px-4 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Analysis History
      </h1>

      {error && (
        <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
      )}

      <div className="w-full max-w-3xl space-y-4">
        {/* LOADING SKELETON */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-4 rounded-md space-y-3"
            >
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-full bg-gray-300 rounded"></div>
            </div>
          ))}

        {/* HISTORY LIST */}
        {!loading &&
          data.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 sm:p-5 rounded-md shadow-md"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="font-semibold text-sm sm:text-base">
                  {item.resume_name}
                </h2>

                <div className="flex items-center gap-1 text-lg font-bold">
                  {(item.match_score ?? 0)}%
                  <MdCreditScore />
                </div>
              </div>

              {/* FEEDBACK */}
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {expandedId === item._id
                  ? item.feedback
                  : `${item.feedback?.slice(0, 120) || ""}...`}
              </p>

              {/* EXPANDED SECTION */}
              {expandedId === item._id && (
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="font-bold">ATS Score</h3>
                    <p>{item.ats_score ?? 0}%</p>
                  </div>

                  <div>
                    <h3 className="font-bold">Matching Skills</h3>
                    <ul className="list-disc ml-5">
                      {(item.matching_skills ?? []).map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">Missing Skills</h3>
                    <ul className="list-disc ml-5">
                      {(item.missing_skills ?? []).map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">Strengths</h3>
                    <ul className="list-disc ml-5">
                      {(item.strengths ?? []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">Weaknesses</h3>
                    <ul className="list-disc ml-5">
                      {(item.weaknesses ?? []).map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">Top Improvements</h3>
                    <ul className="list-disc ml-5">
                      {(item.top_improvements ?? []).map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TOGGLE BUTTON */}
              <button
                onClick={() => toggleExpand(item._id)}
                className="text-blue-600 text-sm mt-2 cursor-pointer"
              >
                {expandedId === item._id ? "See Less" : "See More"}
              </button>

              {/* DATE */}
              <div className="flex justify-end mt-3">
                <p className="text-xs text-gray-500">
                  Dated:{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}

        {/* EMPTY STATE */}
        {!loading && data.length === 0 && (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No history yet
          </p>
        )}
      </div>
    </div>
  );
};

export default withAuth(History);