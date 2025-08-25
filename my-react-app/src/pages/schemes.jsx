import { useEffect, useState } from "react";
import api from "../services/api";

function Schemes() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      const res = await api.get("/schemes");
      setSchemes(res.data);
    };
    fetchSchemes();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Government Schemes</h2>
      <ul className="space-y-2">
        {schemes.map((scheme, idx) => (
          <li key={idx} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{scheme.title}</h3>
            <p>{scheme.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Schemes;
