// src/pages/FarmerUpload.js
import React, { useState, useContext } from "react";
import api from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function FarmerUpload() {
  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please login first to upload crops");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cropName", cropName);
      formData.append("price", price);
      formData.append("quantity", quantity);
      if (image) {
        formData.append("image", image);
      }

      const res = await api.post("/crops/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Uploaded successfully!");
      setCropName("");
      setPrice("");
      setQuantity("");
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error uploading crop");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Farmer Upload Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Crop Name"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Quantity (Kg)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Upload Crop
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
