import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Circularity() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("", { headers: { Authorization: `Bearer ${token}` } }) // ✅ FIXED HERE
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching circularity data:", err);
        setData([]);
      });
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

  const avgScore = data.length
    ? (
        data.reduce((a, b) => a + (parseFloat(b.circularityScore) || 0), 0) /
        data.length
      ).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Circularity Overview</h1>
        <p className="text-sm text-gray-500 mb-6">
          Understand how materials contribute to overall circular performance.
        </p>

        {/* === Chart === */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Circularity Scores</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="circularityScore"
                  nameKey="material"
                  outerRadius={90}
                  label
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              Average Circularity Score
            </h3>
            <p className="text-5xl font-bold text-green-600">{avgScore}%</p>
            <p className="text-gray-500 mt-2 text-sm">Across all recorded materials</p>
          </div>
        </div>

        {/* === Table === */}
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Material-wise Circularity</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Material</th>
                <th>Circularity Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{item.material}</td>
                  <td className="text-center">{item.circularityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
