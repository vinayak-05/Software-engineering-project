// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Note: These options are no longer needed in latest Mongoose (>=6.x)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Optional: Close connection gracefully when app stops
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDB;
