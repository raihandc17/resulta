"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { clearSession, createSession } from "@/lib/session";

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getString(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function registerUser(prevState, formData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  // Required fields
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  // Name validation
  if (name.length < MIN_NAME_LENGTH) {
    return {
      error: `Name must be at least ${MIN_NAME_LENGTH} characters long.`,
    };
  }

  // Email validation
  if (!EMAIL_REGEX.test(email)) {
    return {
      error: "Please enter a valid email address.",
    };
  }

  // Password validation
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  // Confirm password
  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  try {
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        error: "An account with this email already exists.",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    await User.create({
      name,
      email,
      passwordHash,
    });
  } catch (err) {
    console.error("Register error:", err);

    // Handle duplicate email (extra safety)
    if (err?.code === 11000) {
      return {
        error: "An account with this email already exists.",
      };
    }

    return {
      error: "Registration failed. Please try again.",
    };
  }

  redirect("/?login=true");
}

export async function loginUser(formData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return {
        error: "Invalid email or password.",
      };
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return {
        error: "Invalid email or password.",
      };
    }

    await createSession(user);
  } catch (err) {
    console.error("Login error:", err);

    return {
      error: "Login failed. Please try again.",
    };
  }

  return {
    success: true,
  };
}

export async function logoutUser() {
  await clearSession();
  redirect("/");
}
