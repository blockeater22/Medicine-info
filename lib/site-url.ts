/** Canonical site origin (no trailing slash). Set via SITE_URL / NEXT_PUBLIC_SITE_URL at build time. */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.doctors-hub.in";
  return url.replace(/\/$/, "");
}
