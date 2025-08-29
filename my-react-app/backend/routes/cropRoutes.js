import express from "express";
import multer from "multer";
import Crop from "../models/Crop.js";

const router = express.Router();

// ⚡ Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // create "uploads" folder in backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 👉 Farmer: Upload crop
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const crop = new Crop({
      name,
      price,
      quantity,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      uploadedBy: req.user ? req.user.id : null, // optional if using auth
    });

    await crop.save();
    res.status(201).json({ message: "Crop uploaded successfully!", crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading crop" });
  }
});

// 👉 Consumer: Get all crops
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crops" });
  }
});

// 👉 Consumer: Buy crop (reduce quantity)
router.post("/buy/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    const { quantity } = req.body;
    if (crop.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    crop.quantity -= quantity;
    await crop.save();

    res.json({ message: "Purchase successful!", crop });
  } catch (error) {
    res.status(500).json({ message: "Error buying crop" });
  }
});

export default router;
