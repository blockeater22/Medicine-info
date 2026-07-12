"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { hasCookieConsent } from "@/components/monetization/cookie-consent";
import { getAdSenseClientId, isAdsEnabled } from "@/lib/ads/config";

/**
 * Loads the AdSense script only when NEXT_PUBLIC_ENABLE_ADS=true and user consented.
 * Returns null in production until approval — no external AdSense JS is loaded.
 */
export function AdSenseScript() {
  if (!isAdsEnabled()) return null;
  return <AdSenseScriptLoader />;
}

function AdSenseScriptLoader() {
  const clientId = getAdSenseClientId();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => setConsented(hasCookieConsent());
    check();
    window.addEventListener("cookie-consent-accepted", check);
    return () => window.removeEventListener("cookie-consent-accepted", check);
  }, []);

  if (!clientId || !consented) return null;

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
