export function getDisplayInitials(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return "U";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0][0].toUpperCase();
}

export function getDisplayName(name) {
  return (name || "")
    .trim()
    .replace(/\s+-\s*$/, "")
    .trim();
}
