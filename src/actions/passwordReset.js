"use server";

import bcrypt from "bcryptjs";

import {
  buildPasswordResetUrl,
  sendPasswordResetEmail,
} from "@/lib/mail/sendPasswordResetEmail";
import { validatePassword, validatePasswordMatch } from "@/lib/password";
import {
  createPasswordResetToken,
  resetPasswordWithToken,
} from "@/lib/passwordReset";

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_SUCCESS =
  "If an account exists for that email, we will sent password reset instructions.";

export async function requestPasswordReset(prevState, formData) {
  const email =
    typeof formData.get("email") === "string"
      ? formData.get("email").trim().toLowerCase()
      : "";

  if (!email) {
    return { error: "Email is required." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const result = await createPasswordResetToken(email);

    let devResetUrl;

    if (result.rawToken && result.user) {
      const resetUrl = buildPasswordResetUrl(result.rawToken);
      const mailResult = await sendPasswordResetEmail({
        to: result.user.email,
        name: result.user.name,
        resetUrl,
      });

      if (
        process.env.NODE_ENV !== "production" &&
        mailResult?.devLogged &&
        !mailResult?.delivered
      ) {
        devResetUrl = resetUrl;
      }
    }

    return { success: GENERIC_SUCCESS, devResetUrl };
  } catch (err) {
    console.error("requestPasswordReset:", err);
    return {
      error: "Unable to process your request. Please try again later.",
    };
  }
}

export async function completePasswordReset(prevState, formData) {
  const token =
    typeof formData.get("token") === "string"
      ? formData.get("token").trim()
      : "";
  const password =
    typeof formData.get("password") === "string"
      ? formData.get("password")
      : "";
  const confirmPassword =
    typeof formData.get("confirmPassword") === "string"
      ? formData.get("confirmPassword")
      : "";

  if (!token) {
    return { error: "Invalid or expired reset link." };
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.ok) {
    return { error: passwordCheck.error };
  }

  const matchCheck = validatePasswordMatch(password, confirmPassword);
  if (!matchCheck.ok) {
    return { error: matchCheck.error };
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await resetPasswordWithToken(token, passwordHash);
    return {
      success: "Your password has been updated. You can sign in now.",
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to reset password.";
    return { error: message };
  }
}
