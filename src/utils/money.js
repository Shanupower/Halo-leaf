export function formatInr(amount, { currency = "INR" } = {}) {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `₹${value.toFixed(2)}`;
  }
}

/** Medusa v2 stores INR in major units (999 = ₹999). */
export function minorToMajor(minor) {
  return typeof minor === "number" ? minor : 0;
}

/** Convert major units to paise for Razorpay/external APIs when needed. */
export function majorToMinor(major) {
  return Math.round(Number(major || 0) * 100);
}
