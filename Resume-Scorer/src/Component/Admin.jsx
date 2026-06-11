import React, { useEffect, useState } from "react";
import withAuth from "../utils/HOC/withAuthHOC";
import axios from "../utils/axios";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  const handleDelete = async (id) => {
    console.log("Delete clicked:", id);

    try {
      await axios.delete(`/api/resume/${id}`);
      console.log("Deleted");

      setUsers(users.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/resume/get");

        console.log(result.data);

        setUsers(result.data.resumes);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-6 sm:py-10 px-4 flex flex-col items-center">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* CONTAINER */}
      <div className="w-full max-w-3xl space-y-4">
        {/* SKELETON */}
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

        {/* USER LIST */}
        {!loading &&
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 sm:p-5 rounded-md shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-sm sm:text-base">
                    {user.user?.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {user.user?.email}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Resume: {user.resume_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setSelectedResume(user)}
                  className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
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
            No users found
          </p>
        )}
      </div>
      {selectedResume && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white p-5 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-3">Resume Feedback</h2>

            <p className="font-semibold">{selectedResume.resume_name}</p>

            <div className="mt-3 max-h-80 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedResume.feedback}
              </p>
            </div>

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
