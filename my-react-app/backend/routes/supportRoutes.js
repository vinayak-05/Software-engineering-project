import express from "express";
import SupportQuery from "../models/SupportQuery.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👉 Submit support query (protected, any user)
router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const query = new SupportQuery({ user: req.user.id, message });
    await query.save();
    res.status(201).json({ message: "Query submitted successfully", query });
  } catch (error) {
    res.status(500).json({ message: "Error submitting query" });
  }
});

// 👉 Get all support queries (admin only)
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const queries = await SupportQuery.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries" });
  }
});

// 👉 Respond to query (admin only)
router.post("/:id/response", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { response } = req.body;
    const query = await SupportQuery.findByIdAndUpdate(
      req.params.id,
      { response, status: "resolved" },
      { new: true }
    );
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.json({ message: "Response sent", query });
  } catch (error) {
    res.status(500).json({ message: "Error responding to query" });
  }
});

// 👉 Delete query (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const query = await SupportQuery.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.json({ message: "Query deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting query" });
  }
});

export default router;
