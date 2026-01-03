import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function AddAssessment() {
  const [form, setForm] = useState({
    material: "",
    energy: "",
    water: "",
    co2: "",
    recycledPercent: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  try {
    await api.post("/", form); // ✅ Correct endpoint
    setMessage("✅ Assessment added successfully!");
    setTimeout(() => navigate("/list"), 1000);
  } catch (err) {
    console.error("Error Response:", err.response?.data || err.message);
    setMessage(
      `❌ Error adding assessment: ${
        err.response?.data?.error || err.message
      }`
    );
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        >
          <h1 className="text-xl font-bold mb-4 text-center text-gray-800">
            Add New Assessment
          </h1>

          {["material", "energy", "water", "co2", "recycledPercent"].map(
            (key, i) => (
              <div key={i}>
                <label className="block mb-2 text-sm font-medium text-gray-700 capitalize">
                  {key === "co2"
                    ? "CO₂ (kg)"
                    : key === "recycledPercent"
                    ? "Recycled (%)"
                    : key}
                </label>
                <input
                  type={key === "material" ? "text" : "number"}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded p-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )
          )}

          {message && (
            <p
              className={`text-sm text-center mb-3 ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Save Assessment
          </button>
        </form>
      </div>
    </div>
  );
}