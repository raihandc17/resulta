import { jsonData, jsonError, requireApiUser } from "@/lib/api/auth";
import { removeFavorite } from "@/lib/shop/favoriteService";

export async function DELETE(_request, { params }) {
  const auth = await requireApiUser();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  const { productId } = await params;

  try {
    const favoriteIds = await removeFavorite(auth.user._id, productId);
    return jsonData({ favoriteIds });
  } catch (err) {
    console.error("[api/v1/favorites DELETE]", err);
    return jsonError("Unable to remove favorite.", 500);
  }
}
