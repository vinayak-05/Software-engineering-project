import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String
});

export default mongoose.model("Scheme", schemeSchema);
