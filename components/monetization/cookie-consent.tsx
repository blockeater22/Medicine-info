"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

const STORAGE_KEY = "doctors-hub-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-rejected"));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur p-4 md:p-6 shadow-lg"
    >
      <div className="container-custom flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          {SITE.name} uses cookies for analytics, advertising, and to remember your preferences.
          See our{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button size="sm" onClick={accept}>
            Accept
          </Button>
          <Button size="sm" variant="outline" onClick={reject}>
            Reject non-essential
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/privacy-policy">Learn more</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "accepted";
}
