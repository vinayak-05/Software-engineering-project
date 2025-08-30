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
    res.json(crops);
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
    const { name, category, price, unit, quantity } = req.body;

    const crop = new Crop({
      name,
      price,
      quantity,
      farmer: req.user.id,
    });

    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

export default router;
