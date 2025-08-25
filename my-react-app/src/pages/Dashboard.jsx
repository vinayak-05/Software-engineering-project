import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      const res = await api.get("/crops");
      setCrops(res.data);
    };
    fetchCrops();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Crop Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Crop</th>
            <th className="p-2 border">Predicted Price</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{crop.name}</td>
              <td className="p-2 border">₹{crop.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
