import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.post("/signup", form);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create an Account</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Sign up to use the LCA Sustainability Tool
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 mb-3 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
