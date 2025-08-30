// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Optional: Handle disconnection
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDB;
