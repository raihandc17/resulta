import { cookies } from "next/headers";

import { MAX_AGE, signSessionToken, verifySessionToken } from "@/lib/jwt";

const COOKIE_NAME = "session";

export async function createSession(user) {
  const token = await signSessionToken(user);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  // If there is no session cookie, there is nothing to verify.
  if (!token) return null;
  return verifySessionToken(token);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { verifySessionToken };
