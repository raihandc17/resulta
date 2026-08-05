import { jsonData, jsonError, requireApiUser } from "@/lib/api/auth";
import {
  addFavorite,
  listFavoriteIds,
  listFavoriteProducts,
} from "@/lib/shop/favoriteService";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  try {
    const [products, favoriteIds] = await Promise.all([
      listFavoriteProducts(auth.user._id),
      listFavoriteIds(auth.user._id),
    ]);
    return jsonData({ products, favoriteIds });
  } catch (err) {
    console.error("[api/v1/favorites GET]", err);
    return jsonError("Unable to load favorites.", 500);
  }
}

export async function POST(request) {
  const auth = await requireApiUser();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const productId = String(body.productId ?? "").trim();
  if (!productId) {
    return jsonError("productId is required.");
  }

  try {
    const favoriteIds = await addFavorite(auth.user._id, productId);
    return jsonData({ favoriteIds }, 201);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to save favorite.";
    return jsonError(message, 400);
  }
}
