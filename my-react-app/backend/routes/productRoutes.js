import express from "express";
import Crop from "../models/Crop.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👉 Get all products (crops) for marketplace
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate("farmer", "name email")
      .sort({ createdAt: -1 });
    const cropsWithFarmerName = crops.map(crop => ({
      ...crop.toObject(),
      farmerName: crop.farmer ? crop.farmer.name : 'Unknown Farmer'
    }));
    res.json(cropsWithFarmerName);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// 👉 Get user's own products (for farmer dashboard)
router.get("/mine", protect, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your products" });
  }
});

// 👉 Create new product (crop)
router.post("/", protect, async (req, res) => {
  try {
    const { name, price, unit, quantity, description } = req.body;

    const crop = new Crop({
      name,
      price,
      unit,
      quantity,
      description,
      farmer: req.user.id,
    });

    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

// 👉 Delete product (crop) by ID (only by owner)
router.delete("/:id", protect, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;
