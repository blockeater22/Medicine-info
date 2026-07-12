"use client";

import Script from "next/script";
import { hasCookieConsent } from "./cookie-consent";
import { useEffect, useState } from "react";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(hasCookieConsent());
    check();
    window.addEventListener("cookie-consent-accepted", check);
    return () => window.removeEventListener("cookie-consent-accepted", check);
  }, []);

  if (!gaId || gaId.includes("XXXX") || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
