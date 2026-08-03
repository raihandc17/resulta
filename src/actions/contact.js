"use server";

import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/session";
import ContactMessage from "@/models/ContactMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

function getString(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactMessage(_prevState, formData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const message = getString(formData, "message");

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  if (name.length < MIN_NAME_LENGTH) {
    return {
      error: `Name must be at least ${MIN_NAME_LENGTH} characters.`,
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return {
      error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`,
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: "Message is too long." };
  }

  try {
    await connectDB();

    const session = await getSession();
    const userId =
      typeof session?.userId === "string" ? session.userId : null;

    await ContactMessage.create({
      name,
      email,
      message,
      ...(userId ? { userId } : {}),
    });

    return {
      success: true,
      formKey: Date.now(),
    };
  } catch (err) {
    console.error("submitContactMessage error:", err);
    return { error: "submit_failed" };
  }
}
