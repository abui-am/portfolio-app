const AVATAR_COLORS = [
  "#7c4dff",
  "#18a0fb",
  "#0acf83",
  "#ff7262",
  "#ffc700",
  "#9747ff",
  "#14b8a6",
  "#f97316",
];

function hashLabel(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getAvatarColor(label: string) {
  return AVATAR_COLORS[hashLabel(label) % AVATAR_COLORS.length];
}

export function getInitial(label: string) {
  const trimmed = label.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  const source = parts.length > 1 ? parts[parts.length - 1]! : parts[0]!;
  return source.charAt(0).toUpperCase();
}

export function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
