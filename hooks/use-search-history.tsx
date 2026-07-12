"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { POPULAR_SEARCHES } from "@/lib/constants";

const STORAGE_KEY = "doctors-hub-search-history";
const MAX = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const addSearch = useCallback((query: string) => {
    const q = query.trim();
    if (q.length < 2) return;
    setHistory((prev) => {
      const updated = [q, ...prev.filter((h) => h.toLowerCase() !== q.toLowerCase())].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { history, addSearch };
}

export function PopularSearches() {
  return (
    <div className="flex flex-wrap gap-2">
      {POPULAR_SEARCHES.map((term) => (
        <Link
          key={term}
          href={`/search?q=${encodeURIComponent(term.toLowerCase())}`}
          className="rounded-full border px-3 py-1 text-sm hover:border-primary/30 hover:bg-accent transition-colors"
        >
          {term}
        </Link>
      ))}
    </div>
  );
}

export function RecentSearches({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-accent transition-colors"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
