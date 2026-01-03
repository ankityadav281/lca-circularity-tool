import { useEffect, useState } from "react";
import { api } from "../api";

export default function AssessmentList() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await api.get("/");
    setData(res.data);
  };

  useEffect(() => { load(); }, []);

  return data.map(a => (
    <div key={a._id}>
      <h3>{a.material}</h3>
      <p>Circularity Score: {a.circularityScore.toFixed(2)}</p>
      <button onClick={() => api.delete(`/${a._id}`).then(load)}>Delete</button>
    </div>
  ));
}
