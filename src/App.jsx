import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute requiredRole="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
};

export default App;
