import { useState } from "react";
import { api } from "../api";

export default function AssessmentForm({ onSaved }) {
  const [form, setForm] = useState({
    material: "",
    source: "",
    energyUsed: "",
    waterUsed: "",
    co2Emission: "",
    recyclability: ""
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    await api.post("/", {
      ...form,
      energyUsed: +form.energyUsed,
      waterUsed: +form.waterUsed,
      co2Emission: +form.co2Emission,
      recyclability: +form.recyclability
    });
    setForm({
      material: "",
      source: "",
      energyUsed: "",
      waterUsed: "",
      co2Emission: "",
      recyclability: ""
    });
    onSaved();
  };

  return (
    <form onSubmit={submit}>
      <input name="material" placeholder="Material" onChange={handleChange} value={form.material} required />
      <input name="source" placeholder="Source" onChange={handleChange} value={form.source} />
      <input name="energyUsed" placeholder="Energy (kWh)" onChange={handleChange} value={form.energyUsed} />
      <input name="waterUsed" placeholder="Water (L)" onChange={handleChange} value={form.waterUsed} />
      <input name="co2Emission" placeholder="CO₂ (kg)" onChange={handleChange} value={form.co2Emission} />
      <input name="recyclability" placeholder="Recyclability %" onChange={handleChange} value={form.recyclability} />
      <button>Save</button>
    </form>
  );
}
