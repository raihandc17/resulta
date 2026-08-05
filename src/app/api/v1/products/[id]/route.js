import {
  jsonData,
  jsonError,
  requireApiAdmin,
} from "@/lib/api/auth";
import { deleteProduct } from "@/lib/shop/productService";

export async function DELETE(_request, { params }) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  const { id } = await params;

  try {
    const removed = await deleteProduct(id);
    if (!removed) {
      return jsonError("Product not found.", 404);
    }
    return jsonData({ ok: true });
  } catch (err) {
    console.error("[api/v1/products DELETE]", err);
    return jsonError("Unable to delete product.", 500);
  }
}
