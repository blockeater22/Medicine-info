"use client";

import dynamic from "next/dynamic";

export const DeferredRecentlyViewed = dynamic(
  () => import("@/components/shared/recently-viewed").then((m) => ({ default: m.RecentlyViewed })),
  { ssr: false }
);
