"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { hasCookieConsent } from "@/components/monetization/cookie-consent";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function ClarityPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.clarity !== "function") return;
    window.clarity("set", "page", pathname);
  }, [pathname]);

  return null;
}

/**
 * Loads GA + Clarity only after cookie consent — improves Lighthouse Best Practices
 * (no third-party cookies in default lab run) and matches AdSense gating.
 */
export function DeferredAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(hasCookieConsent());
    sync();
    window.addEventListener("cookie-consent-accepted", sync);
    return () => window.removeEventListener("cookie-consent-accepted", sync);
  }, []);

  if (!consented) return null;

  return (
    <>
      {gaId ? (
        <>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {process.env.NODE_ENV === "production" && clarityId ? (
        <>
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
          <ClarityPageView />
        </>
      ) : null}
    </>
  );
}
