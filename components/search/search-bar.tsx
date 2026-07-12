"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { getTypeColor, getTypeLabel } from "@/lib/search";
import type { SearchIndexItem } from "@/lib/search";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  compact?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({ compact = false, autoFocus = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => {});
  }, []);

  const fuse = useMemo(() => {
    if (!index.length) return null;
    return new Fuse(index, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "description", weight: 0.2 },
        { name: "keywords", weight: 0.2 },
        { name: "category", weight: 0.1 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
    });
  }, [index]);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (!fuse || q.length < 2) {
        setResults([]);
        return;
      }
      setResults(fuse.search(q, { limit: 8 }).map((r) => r.item));
      setOpen(true);
    },
    [fuse]
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", compact ? "" : "max-w-2xl mx-auto")}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search medicines, diseases, symptoms..."
            value={query}
            onChange={(e) => search(e.target.value)}
            onFocus={() => query.length >= 2 && setOpen(true)}
            autoFocus={autoFocus}
            className={cn("pl-10 pr-10", compact ? "h-9" : "h-12 text-base rounded-xl")}
            aria-label="Search medical information"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-popover shadow-lg z-50 overflow-hidden"
        >
          {results.map((item) => (
            <li key={`${item.type}-${item.slug}`} role="option" aria-selected="false">
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-0"
                onClick={() => { router.push(item.href); setOpen(false); setQuery(""); }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full", getTypeColor(item.type))}>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="w-full text-center py-2 text-sm text-primary hover:bg-accent font-medium"
              onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setOpen(false); }}
            >
              View all results for &quot;{query}&quot;
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
