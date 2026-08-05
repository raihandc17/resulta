import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { isAdminRole } from "@/lib/roles";
import Order, { PAYMENT_METHODS } from "@/models/Order";
import { getProductById } from "@/lib/shop/productService";

const VALID_STATUS = new Set([
  "pending",
  "confirmed",
  "processing",
  "completed",
]);

export function serializeOrder(doc) {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    customerEmail: doc.customerEmail,
    customerName: doc.customerName,
    phone: doc.phone,
    shippingAddress: doc.shippingAddress,
    items: doc.items.map((line) => ({
      productId: String(line.productId),
      name: line.name,
      gender: line.gender,
      size: line.size,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      lineTotal: line.lineTotal,
    })),
    subtotal: doc.subtotal,
    total: doc.total,
    status: doc.status,
    paymentMethod: doc.paymentMethod ?? "cash_on_delivery",
    createdAt: doc.createdAt?.toISOString?.() ?? null,
  };
}

export async function listOrdersForUser(user) {
  await connectDB();
  await Order.deleteMany({ status: "cancelled" });
  const query = isAdminRole(user.role) ? {} : { userId: user._id };
  const rows = await Order.find(query).sort({ createdAt: -1 }).lean();
  return rows.map(serializeOrder);
}

export async function createOrder(user, payload) {
  const { phone, shippingAddress, items, paymentMethod } = payload;

  if (!phone?.trim() || !shippingAddress?.trim()) {
    throw new Error("Phone and shipping address are required.");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one order item is required.");
  }
  const pay =
    typeof paymentMethod === "string" ? paymentMethod.trim() : "cash_on_delivery";
  if (!PAYMENT_METHODS.includes(pay)) {
    throw new Error("Invalid payment method.");
  }

  const orderLines = [];
  let subtotal = 0;

  for (const entry of items) {
    const product = await getProductById(entry.productId);
    if (!product || !product.isActive) {
      throw new Error("One or more products are unavailable.");
    }
    const size = String(entry.size ?? "").trim();
    if (!size || !product.sizes.includes(size)) {
      throw new Error(`Invalid size for ${product.name}.`);
    }
    const quantity = Number(entry.quantity);
    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Invalid quantity.");
    }
    const unitPrice = product.finalPrice;
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;
    orderLines.push({
      productId: new mongoose.Types.ObjectId(product.id),
      name: product.name,
      gender: product.gender,
      size,
      quantity,
      unitPrice,
      lineTotal,
    });
  }

  await connectDB();
  const doc = await Order.create({
    userId: user._id,
    customerEmail: user.email,
    customerName: user.name,
    phone: phone.trim(),
    shippingAddress: shippingAddress.trim(),
    items: orderLines,
    subtotal,
    total: subtotal,
    status: "pending",
    paymentMethod: pay,
  });

  return serializeOrder(doc.toObject());
}

export async function updateOrderStatus(orderId, status) {
  if (!VALID_STATUS.has(status)) {
    throw new Error("Invalid status.");
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return null;
  }

  await connectDB();

  const doc = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean();

  return doc ? serializeOrder(doc) : null;
}

export async function deleteOrder(orderId) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return false;
  }
  await connectDB();
  const result = await Order.findByIdAndDelete(orderId);
  return Boolean(result);
}
