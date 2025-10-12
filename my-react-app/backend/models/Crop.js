import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    image: { type: String }, // Optional image field
    description: { type: String, required: true }, // Farmer can add address, contact, etc.
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
