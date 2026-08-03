import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/session";
import User from "@/models/User";

export async function getCurrentUser() {
  const session = await getSession();
  const userId = session?.userId;

  if (typeof userId !== "string" || !userId) {
    return null;
  }

  await connectDB();

  return User.findById(userId).select("name email role sidebarOrder");
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
