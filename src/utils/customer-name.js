/** Split a display name into Medusa/Razorpay-safe first and last names. */
export function splitNameForMedusa(displayName) {
  const raw = (displayName || "").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  const first_name = parts[0] || "Customer";
  const last_name = parts.slice(1).join(" ") || first_name;
  return { first_name, last_name };
}
