/** Canonical site origin (no trailing slash). Always uses www for doctors-hub.in. */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.doctors-hub.in";
  const normalized = url.replace(/\/$/, "");
  if (normalized === "https://doctors-hub.in") {
    return "https://www.doctors-hub.in";
  }
  return normalized;
}
