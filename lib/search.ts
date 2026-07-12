import Fuse from "fuse.js";
import type { SearchResult } from "@/types";

export interface SearchIndexItem {
  slug: string;
  name: string;
  description: string;
  type: string;
  href: string;
  category?: string;
  keywords?: string;
}

export function createSearchEngine(items: SearchIndexItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "name", weight: 0.4 },
      { name: "description", weight: 0.2 },
      { name: "keywords", weight: 0.2 },
      { name: "category", weight: 0.1 },
      { name: "type", weight: 0.1 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  });
}

export function searchItems(
  engine: Fuse<SearchIndexItem>,
  query: string,
  limit = 20
): SearchResult[] {
  if (!query.trim()) return [];
  return engine
    .search(query, { limit })
    .map((r) => ({
      slug: r.item.slug,
      name: r.item.name,
      description: r.item.description,
      type: r.item.type as SearchResult["type"],
      href: r.item.href,
      category: r.item.category,
    }));
}

export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    medicine: "Medicine",
    disease: "Disease",
    symptom: "Symptom",
    "lab-test": "Lab Test",
    calculator: "Calculator",
    "first-aid": "First Aid",
    article: "Article",
  };
  return labels[type] || type;
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    medicine: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    disease: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    symptom: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    "lab-test": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    calculator: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "first-aid": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    article: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}
