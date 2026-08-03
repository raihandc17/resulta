import mongoose from "mongoose";

const workItemSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "complete", "on_hold", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.WorkItem;
}

export default mongoose.models.WorkItem ||
  mongoose.model("WorkItem", workItemSchema);
