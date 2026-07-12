import {
  getAllArticles,
  getAllCalculators,
  getAllDiseases,
  getAllDrugClasses,
  getAllFirstAid,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
} from "@/lib/data";
import { getMedicineCategories, getDiseaseSystems } from "@/lib/categories";
import { SITEMAP_CHUNK_SIZE } from "@/lib/sitemap-config";
import { getStaticPageLastModified } from "@/lib/static-page-mtimes";
import { getListingStaticPageParams } from "@/lib/listings";
import {
  diseasesListing,
  labTestsListing,
  medicinesListing,
  symptomsListing,
} from "@/lib/listing-configs";
import { getSiteUrl } from "@/lib/site-url";

export type SitemapEntry = {
  path: string;
  lastModified?: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

/** Paths that must never appear in the sitemap. */
export const SITEMAP_EXCLUDED_PATHS = new Set(["/search", "/404"]);

const STATIC_PAGES: Omit<SitemapEntry, "lastModified">[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/medicines", changeFrequency: "weekly", priority: 0.9 },
  { path: "/diseases", changeFrequency: "weekly", priority: 0.9 },
  { path: "/symptoms", changeFrequency: "weekly", priority: 0.9 },
  { path: "/lab-tests", changeFrequency: "weekly", priority: 0.9 },
  { path: "/calculators", changeFrequency: "weekly", priority: 0.9 },
  { path: "/first-aid", changeFrequency: "weekly", priority: 0.9 },
  { path: "/articles", changeFrequency: "weekly", priority: 0.8 },
  { path: "/drug-classes", changeFrequency: "weekly", priority: 0.85 },
  { path: "/health-az", changeFrequency: "weekly", priority: 0.75 },
  { path: "/content-review-process", changeFrequency: "monthly", priority: 0.5 },
  { path: "/medical-disclaimer", changeFrequency: "yearly", priority: 0.4 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/editorial-policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/corrections", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
];

const HEALTH_AZ_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

function staticPagesWithLastMod(): SitemapEntry[] {
  return STATIC_PAGES.map((page) => ({
    ...page,
    lastModified: getStaticPageLastModified(page.path),
  }));
}

function listingPages(basePath: string, itemCount: number): SitemapEntry[] {
  return getListingStaticPageParams(itemCount).map(({ page }) => ({
    path: `${basePath}/list/${page}`,
    lastModified: getStaticPageLastModified(`${basePath}/list/${page}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

function categoryHubPages(
  basePath: string,
  categories: { slug: string; updatedAt?: string }[]
): SitemapEntry[] {
  return categories.map((cat) => ({
    path: `${basePath}/${cat.slug}`,
    lastModified: cat.updatedAt ?? getStaticPageLastModified(`${basePath}/${cat.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
}

function entityPages(
  prefix: string,
  items: { slug: string; updatedAt?: string }[],
  priority = 0.8
): SitemapEntry[] {
  return items.map((item) => ({
    path: `${prefix}/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly" as const,
    priority,
  }));
}

function healthAzPages(): SitemapEntry[] {
  const mtime = getStaticPageLastModified("/health-az");
  return HEALTH_AZ_LETTERS.map((letter) => ({
    path: `/health-az/${letter}`,
    lastModified: mtime,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));
}

/** All indexable paths for sitemap generation (deduplicated, sorted). */
export function getSitemapEntries(): SitemapEntry[] {
  const medicineCats = getMedicineCategories().map((c) => ({
    slug: c.slug,
    updatedAt: c.latestUpdate,
  }));
  const diseaseSystems = getDiseaseSystems().map((c) => ({
    slug: c.slug,
    updatedAt: c.latestUpdate,
  }));

  const entries: SitemapEntry[] = [
    ...staticPagesWithLastMod(),
    ...listingPages(medicinesListing.basePath, medicinesListing.getItems().length),
    ...listingPages(diseasesListing.basePath, diseasesListing.getItems().length),
    ...listingPages(symptomsListing.basePath, symptomsListing.getItems().length),
    ...listingPages(labTestsListing.basePath, labTestsListing.getItems().length),
    ...categoryHubPages("/medicines", medicineCats),
    ...categoryHubPages("/diseases", diseaseSystems),
    ...healthAzPages(),
    ...entityPages("/medicine", getAllMedicines()),
    ...entityPages("/disease", getAllDiseases()),
    ...entityPages("/symptom", getAllSymptoms()),
    ...entityPages("/lab-test", getAllLabTests()),
    ...entityPages("/article", getAllArticles(), 0.75),
    ...entityPages("/calculator", getAllCalculators(), 0.75),
    ...entityPages("/first-aid", getAllFirstAid(), 0.85),
    ...entityPages("/drug-class", getAllDrugClasses(), 0.8),
  ];

  const seen = new Set<string>();
  const unique: SitemapEntry[] = [];

  for (const entry of entries) {
    if (SITEMAP_EXCLUDED_PATHS.has(entry.path)) continue;
    if (seen.has(entry.path)) continue;
    seen.add(entry.path);
    unique.push(entry);
  }

  return unique.sort((a, b) => a.path.localeCompare(b.path));
}

export function getSitemapChunkCount(): number {
  const total = getSitemapEntries().length;
  return Math.max(1, Math.ceil(total / SITEMAP_CHUNK_SIZE));
}

export function getSitemapChunkEntries(id: number): SitemapEntry[] {
  const entries = getSitemapEntries();
  const start = id * SITEMAP_CHUNK_SIZE;
  return entries.slice(start, start + SITEMAP_CHUNK_SIZE);
}

export function usesSitemapIndex(): boolean {
  return getSitemapEntries().length > SITEMAP_CHUNK_SIZE;
}

export function toMetadataSitemapEntry(entry: SitemapEntry) {
  return {
    url: getCanonicalUrl(entry.path),
    lastModified: entry.lastModified ? new Date(entry.lastModified) : undefined,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  };
}

export function getCanonicalUrl(path: string): string {
  const base = getSiteUrl();
  if (path === "/" || path === "") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSitemapStats() {
  const entries = getSitemapEntries();
  return {
    total: entries.length,
    chunks: getSitemapChunkCount(),
    usesIndex: usesSitemapIndex(),
    withLastMod: entries.filter((e) => e.lastModified).length,
    medicines: getAllMedicines().length,
    diseases: getAllDiseases().length,
    symptoms: getAllSymptoms().length,
    labTests: getAllLabTests().length,
    articles: getAllArticles().length,
    calculators: getAllCalculators().length,
    firstAid: getAllFirstAid().length,
    drugClasses: getAllDrugClasses().length,
  };
}
