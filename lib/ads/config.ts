/**
 * AdSense is disabled by default until publisher approval.
 * To enable after approval:
 *   NEXT_PUBLIC_ENABLE_ADS=true
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
 */
export function isAdsEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ENABLE_ADS === "true" &&
    Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) &&
    !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID!.includes("xxxx")
  );
}

export function getAdSenseClientId(): string | undefined {
  if (!isAdsEnabled()) return undefined;
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
}

/** Show dashed layout placeholders in local dev when ads are off */
export function showDevAdPlaceholders(): boolean {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS !== "false";
}

export const AD_SLOTS = {
  topBanner: process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER || "top-banner",
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || "sidebar",
  inline: process.env.NEXT_PUBLIC_AD_SLOT_INLINE || "inline",
  footer: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || "footer",
  stickyMobile: process.env.NEXT_PUBLIC_AD_SLOT_STICKY_MOBILE || "sticky-mobile",
} as const;
