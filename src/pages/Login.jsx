import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ use navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Full response:", response);

      const { access_token, user } = response.data;

      // ✅ Store token and role in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", user.role);

      // ✅ Redirect to role-based dashboard
      if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "instructor") {
        navigate("/instructor/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.msg || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
