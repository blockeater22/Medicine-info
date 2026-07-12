"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "doctors-hub-recently-viewed";
const MAX_ITEMS = 10;
const UPDATE_EVENT = "doctors-hub-recently-viewed-updated";

export interface RecentItem {
  slug: string;
  name: string;
  href: string;
  type: string;
  viewedAt: number;
}

function readItems(): RecentItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as RecentItem[]) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentItem, "viewedAt">) {
  const filtered = readItems().filter((i) => i.href !== item.href);
  const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(readItems());

    const sync = () => setItems(readItems());
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addItem = useCallback((item: Omit<RecentItem, "viewedAt">) => {
    addRecentlyViewed(item);
  }, []);

  return { items, addItem };
}
