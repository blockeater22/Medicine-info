"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/hooks/use-recently-viewed";

interface TrackRecentlyViewedProps {
  slug: string;
  name: string;
  href: string;
  type: string;
}

export function TrackRecentlyViewed({ slug, name, href, type }: TrackRecentlyViewedProps) {
  useEffect(() => {
    addRecentlyViewed({ slug, name, href, type });
  }, [slug, name, href, type]);

  return null;
}
