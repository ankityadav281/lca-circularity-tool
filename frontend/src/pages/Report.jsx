import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Report() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching report data:", err);
        setData([]);
      });
  }, []);

  const handleDownload = () => {
    console.log("Download clicked! Data length:", data.length);

    if (!data.length) {
      alert("No data available to generate the report!");
      return;
    }

    try {
      const doc = new jsPDF("p", "pt", "a4");

      doc.setFontSize(18);
      doc.text("Life Cycle Assessment Report", 40, 40);
      doc.setFontSize(11);
      doc.text(
        "LCA Tool for Advancing Circularity and Sustainability in Metallurgy & Mining",
        40,
        60
      );

      const tableColumn = [
        "Material",
        "Energy (kWh)",
        "Water (L)",
        "CO₂ (kg)",
        "Recycled (%)",
        "Circularity Score",
      ];

      const tableRows = data.map((item) => [
        item.material || "-",
        item.energy || 0,
        item.water || 0,
        item.co2 || 0,
        item.recycledPercent || 0,
        item.circularityScore || 0,
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [25, 118, 210] },
      });

      const totalEnergy = data
        .reduce((sum, i) => sum + (parseFloat(i.energy) || 0), 0)
        .toFixed(2);
      const totalWater = data
        .reduce((sum, i) => sum + (parseFloat(i.water) || 0), 0)
        .toFixed(2);
      const totalCO2 = data
        .reduce((sum, i) => sum + (parseFloat(i.co2) || 0), 0)
        .toFixed(2);

      const y = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.text(`Total Energy: ${totalEnergy} kWh`, 40, y);
      doc.text(`Total Water: ${totalWater} L`, 40, y + 15);
      doc.text(`Total CO₂: ${totalCO2} kg`, 40, y + 30);

      doc.save("LCA_Report.pdf");
      console.log("✅ PDF successfully generated!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error generating report. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Assessment Report</h1>
        <p className="text-sm text-gray-500 mb-6">
          Generate and download a detailed Life Cycle Assessment report.
        </p>

        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Available Assessments</h3>

          {!data.length ? (
            <p className="text-gray-500">No assessments found.</p>
          ) : (
            <table className="w-full border text-sm mb-4">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-2">Material</th>
                  <th className="border p-2">Energy (kWh)</th>
                  <th className="border p-2">Water (L)</th>
                  <th className="border p-2">CO₂ (kg)</th>
                  <th className="border p-2">Recycled (%)</th>
                  <th className="border p-2">Circularity</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{item.material}</td>
                    <td className="p-2">{item.energy}</td>
                    <td className="p-2">{item.water}</td>
                    <td className="p-2">{item.co2}</td>
                    <td className="p-2">{item.recycledPercent}</td>
                    <td className="p-2">{item.circularityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
