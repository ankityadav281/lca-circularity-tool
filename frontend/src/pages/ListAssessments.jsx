import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function ListAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAssessments();
  }, []);

  // ✅ Fetch all assessments
  const fetchAssessments = async () => {
    try {
      const res = await api.get("", { headers: { Authorization: `Bearer ${token}` } });
      setAssessments(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching assessments:", err);
      setError("❌ Failed to load assessments. Please refresh.");
    }
  };

  // ✅ Delete assessment
  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAssessments();
    } catch (err) {
      console.error("Error deleting:", err);
      setError("❌ Could not delete assessment.");
    }
  };

  // ✅ Start editing mode
  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditData(item);
  };

  // ✅ Save edited item
  const handleSaveEdit = async (id) => {
    try {
      await api.put(`/${id}`, editData, { headers: { Authorization: `Bearer ${token}` } });
      setEditingId(null);
      fetchAssessments();
    } catch (err) {
      console.error("Error updating:", err);
      setError("❌ Failed to update assessment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">All Assessments</h1>

        {/* Display error if any */}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="py-2 px-4">Material</th>
              <th className="py-2 px-4">Energy</th>
              <th className="py-2 px-4">Water</th>
              <th className="py-2 px-4">CO₂</th>
              <th className="py-2 px-4">Recycled%</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.length > 0 ? (
              assessments.map((item) => (
                <tr key={item._id} className="border-t text-sm">
                  {editingId === item._id ? (
                    <>
                      {["material", "energy", "water", "co2", "recycledPercent"].map((field) => (
                        <td key={field} className="py-2 px-4">
                          <input
                            type={field === "material" ? "text" : "number"}
                            value={editData[field]}
                            onChange={(e) =>
                              setEditData({ ...editData, [field]: e.target.value })
                            }
                            className="border rounded w-full p-1"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleSaveEdit(item._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-xs hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4">{item.material}</td>
                      <td className="py-2 px-4">{item.energy}</td>
                      <td className="py-2 px-4">{item.water}</td>
                      <td className="py-2 px-4">{item.co2}</td>
                      <td className="py-2 px-4">{item.recycledPercent}</td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No assessments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
