import { SignJWT, jwtVerify } from "jose";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined.");
}

const SECRET_KEY = new TextEncoder().encode(secret);

const ISSUER = "resulta-api";
const AUDIENCE = "resulta-web";

export async function signSessionToken(user) {
  return await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    return payload;
  } catch {
    return null;
  }
}

export { MAX_AGE };