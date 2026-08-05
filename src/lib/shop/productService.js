import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import Product, { GENDERS } from "@/models/Product";

export function effectivePrice(product) {
  if (
    typeof product.discountPrice === "number" &&
    product.discountPrice >= 0 &&
    product.discountPrice < product.price
  ) {
    return product.discountPrice;
  }
  return product.price;
}

export function serializeProduct(doc) {
  const price = doc.price;
  const discountPrice =
    typeof doc.discountPrice === "number" ? doc.discountPrice : null;
  const finalPrice = effectivePrice(doc);

  return {
    id: String(doc._id),
    name: doc.name,
    description: doc.description ?? "",
    price,
    discountPrice,
    finalPrice,
    hasDiscount: finalPrice < price,
    gender: doc.gender,
    sizes: Array.isArray(doc.sizes) ? doc.sizes : [],
    imageUrl: doc.imageUrl ?? "",
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt?.toISOString?.() ?? null,
  };
}

export async function listProducts({
  gender,
  activeOnly = true,
  includeInactive = false,
} = {}) {
  await connectDB();

  if (!includeInactive) {
    await Product.deleteMany({ isActive: false });
  }

  const query = {};
  if (!includeInactive && activeOnly) {
    query.isActive = true;
  }
  if (gender && GENDERS.includes(gender)) {
    query.gender = gender;
  }

  const rows = await Product.find(query).sort({ createdAt: -1 }).lean();
  return rows.map(serializeProduct);
}

export async function createProduct(input) {
  await connectDB();
  const doc = await Product.create(input);
  return serializeProduct(doc.toObject());
}

export async function getProductById(id) {
  await connectDB();
  const doc = await Product.findById(id).lean();
  return doc ? serializeProduct(doc) : null;
}

export async function updateProductActive(id, isActive) {
  await connectDB();
  const doc = await Product.findByIdAndUpdate(
    id,
    { isActive: Boolean(isActive) },
    { new: true },
  ).lean();
  return doc ? serializeProduct(doc) : null;
}

export async function deleteProduct(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  await connectDB();
  await Favorite.deleteMany({ productId: id });
  const result = await Product.findByIdAndDelete(id);
  return Boolean(result);
}
