import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/products", productRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/pricing", pricingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🌱 Farm2Market API is running...");
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
