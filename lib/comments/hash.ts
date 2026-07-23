import { createHash } from "crypto";

function getGuestSalt() {
  const salt = process.env.COMMENT_GUEST_SALT;
  if (!salt) {
    throw new Error("Missing COMMENT_GUEST_SALT");
  }
  return salt;
}

function getIpSalt() {
  return process.env.COMMENT_IP_SALT ?? "";
}

export function hashGuestToken(guestId: string) {
  return createHash("sha256").update(`${guestId}:${getGuestSalt()}`).digest("hex");
}

export function hashIp(ip: string | null) {
  if (!ip) return null;
  const trimmed = ip.split(",")[0]?.trim();
  if (!trimmed) return null;
  return createHash("sha256").update(`${trimmed}:${getIpSalt()}`).digest("hex");
}
