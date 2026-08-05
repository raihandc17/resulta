import {
  jsonData,
  jsonError,
  requireApiAdmin,
  requireApiUser,
} from "@/lib/api/auth";
import { GENDERS } from "@/models/Product";
import { createProduct, listProducts } from "@/lib/shop/productService";
import { isAdminRole } from "@/lib/roles";

export async function GET(request) {
  const auth = await requireApiUser();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  const { searchParams } = new URL(request.url);
  const gender = searchParams.get("gender");
  const includeInactive =
    searchParams.get("includeInactive") === "1" &&
    isAdminRole(auth.user.role);

  try {
    const products = await listProducts({
      gender: gender ?? undefined,
      includeInactive,
    });
    return jsonData({ products });
  } catch (err) {
    console.error("[api/v1/products GET]", err);
    return jsonError("Unable to load products.", 500);
  }
}

export async function POST(request) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  const gender = String(body.gender ?? "").trim();
  const price = Number(body.price);
  const discountRaw = body.discountPrice;
  const discountPrice =
    discountRaw === null || discountRaw === undefined || discountRaw === ""
      ? null
      : Number(discountRaw);
  const sizes = Array.isArray(body.sizes)
    ? body.sizes.map((s) => String(s).trim()).filter(Boolean)
    : String(body.sizes ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const imageUrl = String(body.imageUrl ?? "").trim();

  if (!name) {
    return jsonError("Product name is required.");
  }
  if (!GENDERS.includes(gender)) {
    return jsonError("Gender must be gents or female.");
  }
  if (!Number.isFinite(price) || price < 0) {
    return jsonError("Valid price is required.");
  }
  if (
    discountPrice !== null &&
    (!Number.isFinite(discountPrice) || discountPrice < 0)
  ) {
    return jsonError("Invalid discount price.");
  }
  if (sizes.length === 0) {
    return jsonError("At least one size is required.");
  }

  try {
    const product = await createProduct({
      name,
      description,
      gender,
      price,
      discountPrice,
      sizes,
      imageUrl,
    });
    return jsonData({ product }, 201);
  } catch (err) {
    console.error("[api/v1/products POST]", err);
    return jsonError("Unable to create product.", 500);
  }
}
