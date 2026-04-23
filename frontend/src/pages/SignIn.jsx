import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.post("/signin", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      const backendMsg =
        err?.response?.data?.msg || err?.response?.data?.error || "";

      const looksLikeBadCreds =
        status === 400 ||
        status === 401 ||
        /invalid/i.test(backendMsg) ||
        /not\s*found/i.test(backendMsg);

      setError(looksLikeBadCreds ? "Invalid email or password ❌" : "Something went wrong. Please try again.");
      console.error("Sign-in error:", err?.response?.data || err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Sign in to your account
        </p>

        {error && (
          <p className="text-red-600 text-center text-sm mb-3">{error}</p>
        )}

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-2 rounded-md font-semibold text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => alert("Password reset feature coming soon!")}
          >
            Forgot Password?
          </button>

          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
