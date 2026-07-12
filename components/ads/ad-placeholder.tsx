"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AD_SLOTS, getAdSenseClientId, isAdsEnabled, showDevAdPlaceholders } from "@/lib/ads/config";

type AdVariant = "banner" | "sidebar" | "inline" | "footer" | "sticky-mobile";

interface AdPlaceholderProps {
  variant?: AdVariant;
  className?: string;
  slot?: string;
}

const VARIANTS: Record<AdVariant, string> = {
  banner: "w-full h-[90px] md:h-[120px]",
  sidebar: "w-full h-[250px] md:h-[600px]",
  inline: "w-full h-[250px]",
  footer: "w-full h-[90px]",
  "sticky-mobile": "fixed bottom-0 left-0 right-0 h-[50px] md:hidden z-30",
};

function DevPlaceholder({ variant, className, slot }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 text-xs text-muted-foreground",
        VARIANTS[variant ?? "inline"],
        className
      )}
      role="complementary"
      aria-label="Advertisement placeholder (development)"
      aria-hidden="true"
    >
      Ad slot — {variant}
      {slot ? ` (${slot})` : ""}
    </div>
  );
}

function LiveAdUnit({ variant = "inline", className, slot }: AdPlaceholderProps) {
  const ref = useRef<HTMLModElement>(null);
  const clientId = getAdSenseClientId();

  useEffect(() => {
    if (!ref.current || !clientId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [clientId, slot]);

  if (!clientId) return null;

  return (
    <ins
      ref={ref}
      className={cn("adsbygoogle block", VARIANTS[variant], className)}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slot || ""}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export function AdPlaceholder({ variant = "inline", className, slot }: AdPlaceholderProps) {
  if (isAdsEnabled()) {
    return <LiveAdUnit variant={variant} className={className} slot={slot} />;
  }

  if (showDevAdPlaceholders()) {
    return <DevPlaceholder variant={variant} className={className} slot={slot} />;
  }

  return null;
}

/** @alias TopBannerAd — top-of-page banner slot */
export function AdBanner(props: Omit<AdPlaceholderProps, "variant">) {
  return <AdPlaceholder variant="banner" slot={AD_SLOTS.topBanner} className={props.className ?? "mb-6"} />;
}

export function TopBannerAd() {
  return <AdBanner />;
}

export function SidebarAd() {
  return <AdPlaceholder variant="sidebar" slot={AD_SLOTS.sidebar} />;
}

export function InlineAd() {
  return <AdPlaceholder variant="inline" slot={AD_SLOTS.inline} className="my-8" />;
}

export function FooterAd() {
  return <AdPlaceholder variant="footer" slot={AD_SLOTS.footer} className="mt-8" />;
}

export function StickyMobileAd() {
  return <AdPlaceholder variant="sticky-mobile" slot={AD_SLOTS.stickyMobile} />;
}
