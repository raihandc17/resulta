import { v2 as cloudinary } from "cloudinary";

const FOLDER = "resulta/products";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadProductImageToCloudinary(buffer, mimeType) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  configureCloudinary();

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER,
    resource_type: "image",
  });

  if (!result?.secure_url) {
    throw new Error("Cloudinary upload did not return a URL.");
  }

  return result.secure_url;
}
