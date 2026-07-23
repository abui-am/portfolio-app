const GUEST_ID_PATTERN = /^guest_[a-z0-9]{6}$/;

const ANONYMOUS_COLORS = [
  "Turquoise",
  "Crimson",
  "Amber",
  "Violet",
  "Indigo",
  "Coral",
  "Sage",
  "Ruby",
  "Azure",
  "Jade",
  "Scarlet",
  "Copper",
  "Mint",
  "Plum",
  "Rose",
  "Slate",
  "Cobalt",
  "Maroon",
  "Ivory",
  "Bronze",
] as const;

const ANONYMOUS_ANIMALS = [
  "Fish",
  "Otter",
  "Falcon",
  "Panda",
  "Lynx",
  "Heron",
  "Badger",
  "Koala",
  "Raven",
  "Tiger",
  "Dolphin",
  "Fox",
  "Owl",
  "Bear",
  "Wolf",
  "Crane",
  "Gecko",
  "Moose",
  "Finch",
  "Swan",
] as const;

export function isValidGuestId(value: string | null | undefined): value is string {
  return typeof value === "string" && GUEST_ID_PATTERN.test(value);
}

function hashGuestId(guestId: string) {
  let hash = 0;
  for (let i = 0; i < guestId.length; i += 1) {
    hash = (hash * 31 + guestId.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function deriveGuestLabel(guestId: string) {
  const hash = hashGuestId(guestId);
  const color = ANONYMOUS_COLORS[hash % ANONYMOUS_COLORS.length];
  const animal = ANONYMOUS_ANIMALS[(hash >>> 8) % ANONYMOUS_ANIMALS.length];
  return `${color} ${animal}`;
}

export function sanitizeUserLabel(_label: string | undefined, guestId: string) {
  return deriveGuestLabel(guestId);
}
