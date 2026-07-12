import {
  getAllArticles,
  getAllCalculators,
  getAllDiseases,
  getAllFirstAid,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
} from "@/lib/data";
import { getListingStaticPageParams } from "@/lib/listings";
import {
  diseasesListing,
  labTestsListing,
  medicinesListing,
  symptomsListing,
} from "@/lib/listing-configs";
import { getSiteUrl } from "@/lib/site-url";
import { getAllTeamMembers } from "@/lib/team";

export type SitemapEntry = {
  path: string;
  lastModified?: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

/** Paths that must never appear in the sitemap. */
export const SITEMAP_EXCLUDED_PATHS = new Set(["/search", "/404"]);

const STATIC_PAGES: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/medicines", changeFrequency: "weekly", priority: 0.9 },
  { path: "/diseases", changeFrequency: "weekly", priority: 0.9 },
  { path: "/symptoms", changeFrequency: "weekly", priority: 0.9 },
  { path: "/lab-tests", changeFrequency: "weekly", priority: 0.9 },
  { path: "/calculators", changeFrequency: "weekly", priority: 0.9 },
  { path: "/first-aid", changeFrequency: "weekly", priority: 0.9 },
  { path: "/articles", changeFrequency: "weekly", priority: 0.8 },
  { path: "/medical-team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/editorial-policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/corrections", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
];

function listingPages(basePath: string, itemCount: number): SitemapEntry[] {
  return getListingStaticPageParams(itemCount).map(({ page }) => ({
    path: `${basePath}/list/${page}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
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

/** All indexable paths for sitemap generation (deduplicated, sorted). */
export function getSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    ...STATIC_PAGES,
    ...listingPages(medicinesListing.basePath, medicinesListing.getItems().length),
    ...listingPages(diseasesListing.basePath, diseasesListing.getItems().length),
    ...listingPages(symptomsListing.basePath, symptomsListing.getItems().length),
    ...listingPages(labTestsListing.basePath, labTestsListing.getItems().length),
    ...entityPages("/medicine", getAllMedicines()),
    ...entityPages("/disease", getAllDiseases()),
    ...entityPages("/symptom", getAllSymptoms()),
    ...entityPages("/lab-test", getAllLabTests()),
    ...entityPages("/article", getAllArticles(), 0.75),
    ...entityPages("/calculator", getAllCalculators(), 0.75),
    ...entityPages("/first-aid", getAllFirstAid(), 0.85),
    ...entityPages(
      "/medical-team",
      getAllTeamMembers().map((m) => ({ slug: m.slug, updatedAt: m.updatedAt })),
      0.5
    ),
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

export function getCanonicalUrl(path: string): string {
  const base = getSiteUrl();
  if (path === "/" || path === "") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSitemapStats() {
  const entries = getSitemapEntries();
  return {
    total: entries.length,
    medicines: getAllMedicines().length,
    diseases: getAllDiseases().length,
    symptoms: getAllSymptoms().length,
    labTests: getAllLabTests().length,
    articles: getAllArticles().length,
    calculators: getAllCalculators().length,
    firstAid: getAllFirstAid().length,
    team: getAllTeamMembers().length,
  };
}
