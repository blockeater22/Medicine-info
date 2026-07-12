"use client";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import Link from "next/link";
import { getTypeLabel } from "@/lib/search";

export function RecentlyViewed() {
  const { items } = useRecentlyViewed();
  if (!items.length) return null;

  return (
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="text-xl font-semibold mb-4">Recently Viewed</h2>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:border-primary/30 hover:bg-accent transition-colors"
          >
            <span>{item.name}</span>
            <span className="text-xs text-muted-foreground">({getTypeLabel(item.type)})</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
