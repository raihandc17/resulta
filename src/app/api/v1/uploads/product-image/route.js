import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  jsonData,
  jsonError,
  requireApiAdmin,
} from "@/lib/api/auth";
import {
  isCloudinaryConfigured,
  uploadProductImageToCloudinary,
} from "@/lib/cloudinary";

const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export async function POST(request) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return jsonError(auth.error.message, auth.error.status);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Choose an image file to upload.");
  }

  if (file.size > MAX_BYTES) {
    return jsonError("Image must be 4 MB or smaller.");
  }

  const ext = ALLOWED_TYPES.get(file.type);
  if (!ext) {
    return jsonError("Use JPEG, PNG, WebP, or GIF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (isCloudinaryConfigured()) {
      const url = await uploadProductImageToCloudinary(buffer, file.type);
      return jsonData({ url }, 201);
    }

    if (process.env.NODE_ENV === "production") {
      return jsonError(
        "Image upload is not configured. Add Cloudinary environment variables on the server.",
        503,
      );
    }

    const filename = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    const absolutePath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(absolutePath, buffer);

    const url = `/uploads/products/${filename}`;
    return jsonData({ url }, 201);
  } catch (err) {
    console.error("[api/v1/uploads/product-image POST]", err);
    return jsonError("Unable to save image.", 500);
  }
}
