import mongoose from "mongoose";

const GENDERS = ["gents", "female"];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    gender: {
      type: String,
      enum: GENDERS,
      required: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  },
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Product;
}

export { GENDERS };
export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
