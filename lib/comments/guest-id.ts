import { isValidGuestId as isValidGuestIdShared } from "@/lib/comments/guest-id-shared";

export { deriveGuestLabel, sanitizeUserLabel } from "@/lib/comments/guest-id-shared";

const GUEST_ID_COOKIE = "portfolio_guest_id";
const GUEST_ID_STORAGE = "portfolio_guest_id";
const GUEST_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function randomGuestSuffix() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateGuestId() {
  return `guest_${randomGuestSuffix()}`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function isValidGuestId(value: string | null | undefined): value is string {
  return isValidGuestIdShared(value);
}

export function getOrCreateGuestId() {
  const fromCookie = readCookie(GUEST_ID_COOKIE);
  if (isValidGuestId(fromCookie)) {
    writeStorage(GUEST_ID_STORAGE, fromCookie);
    return fromCookie;
  }

  const fromStorage = readStorage(GUEST_ID_STORAGE);
  if (isValidGuestId(fromStorage)) {
    writeCookie(GUEST_ID_COOKIE, fromStorage, GUEST_ID_MAX_AGE_SECONDS);
    return fromStorage;
  }

  const guestId = generateGuestId();
  writeCookie(GUEST_ID_COOKIE, guestId, GUEST_ID_MAX_AGE_SECONDS);
  writeStorage(GUEST_ID_STORAGE, guestId);
  return guestId;
}
