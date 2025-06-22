import React, { useEffect, useState } from "react";
import axios from "../../api/axios";


const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    due_date: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/instructor/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/instructor/courses", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Course created successfully!");
      setFormData({ name: "", thumbnail: "", due_date: "" });
      fetchCourses(); // Refresh the course list
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to create course.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>

      {/* Course Creation Form */}
      <form
        onSubmit={handleCourseSubmit}
        className="bg-white p-6 shadow-md rounded-lg mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>

        {message && (
          <p className="text-sm mb-4 text-blue-600 font-medium">{message}</p>
        )}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Course Name"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleInputChange}
          placeholder="Thumbnail URL"
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleInputChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>

      {/* Course Display */}
      {courses.length === 0 ? (
        <p>No courses created yet.</p>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 shadow-md rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <p className="text-sm text-gray-600">Due: {course.due_date}</p>
                </div>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
              </div>

              <p className="mb-2 text-sm text-gray-700">
                Enrolled Students: <strong>{course.enrollment_count}</strong>
              </p>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">
                  Completion: {course.completion_percentage}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all"
                    style={{ width: `${course.completion_percentage}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="font-medium mb-2">Enrolled Students:</h3>
              {course.enrolled_students.length === 0 ? (
                <p className="text-sm text-gray-500">No students enrolled.</p>
              ) : (
                <ul className="pl-4 text-sm list-disc text-gray-700">
                  {course.enrolled_students.map((student) => (
                    <li key={student.id}>
                      {student.name} – {student.progress}%
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
