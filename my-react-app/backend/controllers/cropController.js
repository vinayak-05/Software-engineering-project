import Crop from "../models/Crop.js";

// Add crop (only Farmer)
export const addCrop = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can sell crops" });
    }

    const crop = await Crop.create({
      name,
      price,
      quantity,
      farmer: req.user.id,
    });

    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all crops (Consumers can see, but Farmers also can view their own)
export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate("farmer", "name email");
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
