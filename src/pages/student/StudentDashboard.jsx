import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import dayjs from "dayjs";
import "../../index.css";

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [progressInputs, setProgressInputs] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get("/student/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get("/courses/all");
      setAllCourses(res.data);
    } catch (err) {
      console.error("Error fetching all courses:", err);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourseId) return;
    try {
      await axios.post(
        `/student/enroll/${selectedCourseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Enrolled successfully!");
      setSelectedCourseId("");
      fetchEnrolledCourses();
    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Enrollment failed.");
    }
  };

  const handleProgressChange = (courseId, value) => {
    setProgressInputs((prev) => ({
      ...prev,
      [courseId]: value,
    }));
  };

  const handleProgressUpdate = async (courseId) => {
    const newProgress = parseInt(progressInputs[courseId]);
    if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
      setMessage("❌ Enter valid progress (0-100)");
      return;
    }

    try {
      await axios.post(
        `/student/courses/${courseId}/progress`,
        { progress: newProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Progress updated successfully!");
      fetchEnrolledCourses();
    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Progress update failed.");
    }
  };

  const enrolledCourseIds = new Set(enrolledCourses.map((c) => c.course_id));
  const availableCourses = allCourses.filter((c) => !enrolledCourseIds.has(c.id));

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <span>🎓</span> My Learning Dashboard
      </h2>

      <div className="mb-6 flex gap-4 items-center">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="border px-4 py-2 rounded-md w-64 text-sm shadow-sm"
        >
          <option value="">-- Select a course to enroll --</option>
          {availableCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleEnroll}
          className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 text-sm"
        >
          Enroll
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded shadow">
          {message}
        </div>
      )}

      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500 text-sm">You haven't enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const isDueSoon = dayjs(course.due_date).diff(dayjs(), "day") <= 7;

            return (
              <div
                key={course.course_id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4"
              >
                <img
                  src={course.thumbnail || "https://via.placeholder.com/400x200?text=Course+Image"}
                  alt={course.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>

                <p className="text-sm text-gray-600 mt-1">
                  Due: {course.due_date}
                  {isDueSoon && (
                    <span className="ml-2 text-red-600 font-semibold">⚠️ Soon</span>
                  )}
                </p>

                {course.progress === 100 && (
                  <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded">
                    🏆 Completed
                  </span>
                )}

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-full transition-all duration-700 ease-in-out rounded-full ${
                        course.progress === 100 ? "bg-green-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">{course.progress}% Completed</p>
                </div>

                <div className="flex items-center mt-3 gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Update %"
                    value={progressInputs[course.course_id] || ""}
                    onChange={(e) =>
                      handleProgressChange(course.course_id, e.target.value)
                    }
                    className="border px-2 py-1 rounded text-sm w-20"
                  />
                  <button
                    onClick={() => handleProgressUpdate(course.course_id)}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
