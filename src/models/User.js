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
  },
  {
    // Automatically adds:
    // createdAt
    // updatedAt
    timestamps: true,
  },
);

// If the User model already exists, reuse it.
// Otherwise, create it.
//
// Prevents:
// OverwriteModelError: Cannot overwrite 'User' model once compiled.
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
