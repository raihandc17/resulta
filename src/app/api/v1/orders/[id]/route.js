import {
  jsonData,
  jsonError,
  requireApiAdmin,
} from "@/lib/api/auth";
import { updateOrderStatus, deleteOrder } from "@/lib/shop/orderService";

export async function PATCH(request, { params }) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const status = String(body.status ?? "").trim();

  try {
    const order = await updateOrderStatus(id, status);
    if (!order) {
      return jsonError("Order not found.", 404);
    }
    return jsonData({ order });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to update order.";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  const { id } = await params;

  try {
    const removed = await deleteOrder(id);
    if (!removed) {
      return jsonError("Order not found.", 404);
    }
    return jsonData({ ok: true });
  } catch (err) {
    console.error("[api/v1/orders DELETE]", err);
    return jsonError("Unable to remove order.", 500);
  }
}
