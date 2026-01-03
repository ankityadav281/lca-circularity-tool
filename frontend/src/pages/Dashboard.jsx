import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { Zap, Droplets, Cloud, Recycle, Leaf } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("", { headers: { Authorization: `Bearer ${token}` } }) // ✅ FIXED
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching data:", err);
        setData([]);
      });
  }, []);

  const total = (key) =>
    data.length
      ? data.reduce((a, b) => a + (parseFloat(b[key]) || 0), 0).toFixed(1)
      : 0;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-1">LCA Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          Life Cycle Assessment & Circularity in Metallurgy and Mining
        </p>

        {/* === METRICS === */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Energy (kWh)", key: "energy", icon: <Zap />, color: "text-yellow-500" },
            { label: "Water (L)", key: "water", icon: <Droplets />, color: "text-blue-500" },
            { label: "CO₂ (kg)", key: "co2", icon: <Cloud />, color: "text-red-500" },
            { label: "Recycled (%)", key: "recycledPercent", icon: <Recycle />, color: "text-green-500" },
            { label: "Circularity", key: "circularityScore", icon: <Leaf />, color: "text-purple-500" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
              <div className={`flex items-center justify-center gap-2 ${item.color}`}>
                {item.icon}
                <h3 className="font-semibold text-gray-700 text-sm">{item.label}</h3>
              </div>
              <p className="text-xl font-bold mt-2">{total(item.key)}</p>
            </div>
          ))}
        </div>

        {/* === CHARTS SECTION === */}
        <div className="grid grid-cols-2 gap-6">
          {/* Energy vs CO₂ Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Energy vs CO₂</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} barCategoryGap="15%">
                <XAxis dataKey="material" fontSize={11} />
                <Tooltip />
                <Bar dataKey="energy" fill="#3b82f6" name="Energy" />
                <Bar dataKey="co2" fill="#ef4444" name="CO₂" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Circularity Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Circularity Share</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data} dataKey="circularityScore" nameKey="material" outerRadius={70}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* === INSIGHTS + RECENT MATERIALS + ABOUT === */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow text-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Insights</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✔ Increase recycled % to boost circularity.</li>
              <li>⚡ Optimize processes to cut energy waste.</li>
              <li>💧 Monitor water intensity in metallurgy.</li>
              <li>🌿 Reduce CO₂ through efficient design.</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Recent Materials</h3>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b">
                  <th>Material</th>
                  <th>CO₂</th>
                  <th>Energy</th>
                  <th>Recycled%</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-3).map((item, i) => (
                  <tr key={i} className="border-b text-gray-700">
                    <td>{item.material}</td>
                    <td>{item.co2}</td>
                    <td>{item.energy}</td>
                    <td>{item.recycledPercent}</td>
                    <td>{item.circularityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-sm">
            <h3 className="font-semibold text-gray-700 mb-2">About LCA</h3>
            <p className="text-gray-600 leading-relaxed">
              Life Cycle Assessment (LCA) evaluates the total environmental impact
              of materials and processes — from extraction to recycling.
              It’s a key tool for advancing sustainability and circularity in metallurgy and mining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
