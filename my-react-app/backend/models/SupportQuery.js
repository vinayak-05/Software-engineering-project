import mongoose from "mongoose";

const supportQuerySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
    response: { type: String },
  },
  { timestamps: true }
);

const SupportQuery = mongoose.model("SupportQuery", supportQuerySchema);
export default SupportQuery;
