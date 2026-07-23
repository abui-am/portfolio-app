import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD");
  }
  return password;
}

function signExpiry(exp: number) {
  return createHmac("sha256", getAdminPassword()).update(String(exp)).digest("base64url");
}

function buildToken(exp: number) {
  const signature = signExpiry(exp);
  return `${exp}.${signature}`;
}

function parseToken(token: string) {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const expRaw = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const exp = Number(expRaw);

  if (!Number.isFinite(exp)) return null;
  if (signature !== signExpiry(exp)) return null;
  if (Date.now() > exp) return null;

  return { exp };
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return parseToken(token) !== null;
}

export async function setAdminSession() {
  const exp = Date.now() + SESSION_TTL_MS;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, buildToken(exp), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function verifyAdminPassword(input: string) {
  const expected = getAdminPassword();
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(inputBuffer, expectedBuffer);
}
