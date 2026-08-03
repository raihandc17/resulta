import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },

    // Hashed password (never store the original password)
    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["general", "admin"],
      default: "general",
    },

    sidebarOrder: {
      type: [String],
      default: undefined,
    },
  },
  {
    // Automatically adds:
    // createdAt
    // updatedAt
    timestamps: true,
  },
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", userSchema);
