"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
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

export function MicrosoftClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (process.env.NODE_ENV !== "production" || !projectId) {
    return null;
  }

  return (
    <>
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");`}
      </Script>
      <ClarityPageView />
    </>
  );
}
