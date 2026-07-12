import { slugifyCategory, normalizeCategory } from "@/lib/categories";

export function getMedicineCategoryHref(category: string): string {
  return `/medicines/${slugifyCategory(normalizeCategory(category, "General Medicine"))}`;
}

export function getDiseaseSystemHref(category: string): string {
  return `/diseases/${slugifyCategory(normalizeCategory(category, "General Health"))}`;
}
