import React, { useEffect, useState } from "react";
import withAuth from "../utils/HOC/withAuthHOC";
import axios from "../utils/axios";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/resume/get");

        setUsers(res.data.resumes || []);
      } catch (err) {
        console.log(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/resume/${id}`);
      setUsers((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-6 sm:py-10 px-4 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      <div className="w-full max-w-3xl space-y-4">
        {/* LOADING */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-4 rounded-md space-y-3"
            >
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}

        {/* LIST */}
        {!loading &&
          users.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 sm:p-5 rounded-md shadow-md"
            >
              <div>
                <h2 className="font-semibold text-sm sm:text-base">
                  {item.user?.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {item.user?.email}
                </p>

                <p className="text-xs sm:text-sm text-gray-500">
                  Resume: {item.resume_name}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setSelectedResume(item)}
                  className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {/* EMPTY */}
        {!loading && users.length === 0 && (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No resumes found
          </p>
        )}
      </div>

      {/* MODAL */}
      {selectedResume && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white p-5 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-3">
              Resume Analysis
            </h2>

            <p className="font-semibold">
              {selectedResume.resume_name}
            </p>

            {/* SCORES */}
            <div className="mt-3">
              <p>
                <b>Match Score:</b>{" "}
                {(selectedResume.match_score ?? selectedResume.resume_score ?? 0)}%
              </p>

              <p>
                <b>ATS Score:</b> {selectedResume.ats_score ?? 0}%
              </p>
            </div>

            {/* FEEDBACK */}
            <div className="mt-3">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedResume.feedback}
              </p>
            </div>

            {/* SKILLS */}
            <div className="mt-3">
              <h3 className="font-bold">Matching Skills</h3>
              <ul className="list-disc ml-5">
                {(selectedResume.matching_skills ?? []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <h3 className="font-bold">Missing Skills</h3>
              <ul className="list-disc ml-5">
                {(selectedResume.missing_skills ?? []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <h3 className="font-bold">Top Improvements</h3>
              <ul className="list-disc ml-5">
                {(selectedResume.top_improvements ?? []).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            {/* CLOSE */}
            <button
              onClick={() => setSelectedResume(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Admin);