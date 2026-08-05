import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { serializeProduct } from "@/lib/shop/productService";
import Product from "@/models/Product";

export async function listFavoriteProducts(userId) {
  await connectDB();
  const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 }).lean();
  if (favorites.length === 0) {
    return [];
  }
  const ids = favorites.map((f) => f.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();
  const byId = new Map(products.map((p) => [String(p._id), serializeProduct(p)]));
  return favorites
    .map((f) => byId.get(String(f.productId)))
    .filter(Boolean);
}

export async function listFavoriteIds(userId) {
  await connectDB();
  const rows = await Favorite.find({ userId }).select("productId").lean();
  return rows.map((r) => String(r.productId));
}

export async function addFavorite(userId, productId) {
  await connectDB();
  const product = await Product.findOne({ _id: productId, isActive: true }).lean();
  if (!product) {
    throw new Error("Product not found.");
  }
  await Favorite.updateOne(
    { userId, productId },
    { $setOnInsert: { userId, productId } },
    { upsert: true },
  );
  return listFavoriteIds(userId);
}

export async function removeFavorite(userId, productId) {
  await connectDB();
  await Favorite.deleteOne({ userId, productId });
  return listFavoriteIds(userId);
}
