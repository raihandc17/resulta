import { jsonData, jsonError, requireApiUser } from "@/lib/api/auth";
import { createOrder, listOrdersForUser } from "@/lib/shop/orderService";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  try {
    const orders = await listOrdersForUser(auth.user);
    return jsonData({ orders });
  } catch (err) {
    console.error("[api/v1/orders GET]", err);
    return jsonError("Unable to load orders.", 500);
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

  try {
    const order = await createOrder(auth.user, {
      phone: body.phone,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      items: body.items,
    });
    return jsonData({ order }, 201);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to place order.";
    return jsonError(message, 400);
  }
}
