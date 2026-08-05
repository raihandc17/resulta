import { createHash, randomBytes } from "node:crypto";

import { connectDB } from "@/lib/db";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";

const RESET_TTL_MS = 60 * 60 * 1000;

function hashToken(rawToken) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function createPasswordResetToken(email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { sent: true };
  }

  await connectDB();
  const user = await User.findOne({ email: normalized }).select("_id email name");

  if (!user) {
    return { sent: true };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  await PasswordResetToken.deleteMany({ userId: user._id });
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    sent: true,
    rawToken,
    user: {
      email: user.email,
      name: user.name,
    },
  };
}

export async function resetPasswordWithToken(rawToken, newPasswordHash) {
  if (!rawToken?.trim()) {
    throw new Error("Invalid or expired reset link.");
  }

  const tokenHash = hashToken(rawToken.trim());
  await connectDB();

  const record = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new Error("Invalid or expired reset link.");
  }

  await User.findByIdAndUpdate(record.userId, {
    passwordHash: newPasswordHash,
  });

  await PasswordResetToken.updateOne(
    { _id: record._id },
    { $set: { usedAt: new Date() } },
  );
  await PasswordResetToken.deleteMany({ userId: record.userId });

  return true;
}
