import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE_NAME = "stockflow_session";
const SESSION_DURATION = "7d";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET env var is not set. Add it to .env (any long random string works)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export type SessionPayload = {
  userId: string;
  organizationId: string;
  email: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function getSessionFromToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return getSessionFromToken(token);
}

/** Use in Server Components / Server Actions that require a logged-in user. */
export async function requireUser() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { organization: true },
  });
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export { COOKIE_NAME };
