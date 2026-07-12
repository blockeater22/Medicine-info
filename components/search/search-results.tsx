"use client";

import { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import Link from "next/link";
import { SearchBar } from "@/components/search/search-bar";
import { getTypeColor, getTypeLabel } from "@/lib/search";
import type { SearchIndexItem } from "@/lib/search";
import { cn } from "@/lib/utils";
import { PopularSearches, RecentSearches, useSearchHistory } from "@/hooks/use-search-history";

export function SearchResults({ index }: { index: SearchIndexItem[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { history, addSearch } = useSearchHistory();

  useEffect(() => {
    if (query.trim().length >= 2) addSearch(query.trim());
  }, [query, addSearch]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const fuse = new Fuse(index, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "description", weight: 0.2 },
        { name: "keywords", weight: 0.2 },
        { name: "category", weight: 0.1 },
        { name: "type", weight: 0.1 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
    });
    return fuse.search(query, { limit: 50 }).map((r) => r.item);
  }, [index, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchIndexItem[]> = {};
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    return groups;
  }, [results]);

  return (
    <div>
      <div className="mb-8">
        <SearchBar autoFocus />
      </div>

      {query && (
        <p className="text-muted-foreground mb-6">
          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {!query && (
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-medium mb-3">Popular Searches</h2>
            <PopularSearches />
          </div>
          <RecentSearches items={history} />
        </div>
      )}

      {query && results.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No results found. Try different keywords.</p>
      )}

      {Object.entries(grouped).map(([type, items]) => (
        <section key={type} className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{getTypeLabel(type)}</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={`${item.type}-${item.slug}`}
                href={item.href}
                className="block rounded-xl border p-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{item.name}</span>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full", getTypeColor(item.type))}>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
