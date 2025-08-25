import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  name: String,
  price: Number,
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Crop", cropSchema);
