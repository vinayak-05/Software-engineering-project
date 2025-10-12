import express from "express";
import Scheme from "../models/Scheme.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👉 Get all government schemes
router.get("/", async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schemes" });
  }
});

// 👉 Add new scheme (admin only)
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { title, description, link } = req.body;
    const scheme = new Scheme({ title, description, link });
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: "Error adding scheme" });
  }
});

// 👉 Delete scheme by ID (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }
    res.json({ message: "Scheme deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting scheme" });
  }
});

export default router;
