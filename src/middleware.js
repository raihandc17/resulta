import { NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/jwt";

const COOKIE_NAME = "session";

function redirectToLogin(request) {
  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("login", "true");

  return NextResponse.redirect(loginUrl);
}

export async function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};