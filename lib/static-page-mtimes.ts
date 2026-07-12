import fs from "fs";
import path from "path";

/** Map sitemap path → source file(s); lastmod = latest mtime among sources. */
const STATIC_PAGE_SOURCES: Record<string, string[]> = {
  "/": ["app/page.tsx"],
  "/medicines": ["app/medicines/page.tsx", "lib/listing-configs.ts"],
  "/diseases": ["app/diseases/page.tsx", "lib/listing-configs.ts"],
  "/symptoms": ["app/symptoms/page.tsx", "lib/listing-configs.ts"],
  "/lab-tests": ["app/lab-tests/page.tsx", "lib/listing-configs.ts"],
  "/calculators": ["app/calculators/page.tsx"],
  "/first-aid": ["app/first-aid/page.tsx", "lib/listing-configs.ts"],
  "/articles": ["app/articles/page.tsx"],
  "/about": ["app/about/page.tsx"],
  "/contact": ["app/contact/page.tsx"],
  "/editorial-policy": ["app/editorial-policy/page.tsx"],
  "/content-review-process": ["app/content-review-process/page.tsx"],
  "/medical-disclaimer": ["app/medical-disclaimer/page.tsx", "app/disclaimer/page.tsx"],
  "/corrections": ["app/corrections/page.tsx"],
  "/privacy-policy": ["app/privacy-policy/page.tsx"],
  "/terms": ["app/terms/page.tsx"],
  "/disclaimer": ["app/disclaimer/page.tsx"],
  "/drug-classes": ["app/drug-classes/page.tsx", "data/drug-classes"],
  "/health-az": ["app/health-az/page.tsx", "app/health-az/[letter]/page.tsx"],
};

const LISTING_PAGINATION_TEMPLATE = "app/medicines/list/[page]/page.tsx";

function latestMtime(target: string): number | null {
  const full = path.join(process.cwd(), target);
  if (!fs.existsSync(full)) return null;

  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    let max = 0;
    for (const file of fs.readdirSync(full)) {
      if (!file.endsWith(".json")) continue;
      const m = fs.statSync(path.join(full, file)).mtimeMs;
      if (m > max) max = m;
    }
    return max || stat.mtimeMs;
  }

  return stat.mtimeMs;
}

export function getStaticPageLastModified(routePath: string): string | undefined {
  const sources = STATIC_PAGE_SOURCES[routePath];
  if (sources) {
    const mtimes = sources.map(latestMtime).filter((m): m is number => m !== null);
    if (mtimes.length) return new Date(Math.max(...mtimes)).toISOString();
  }

  if (routePath.includes("/list/")) {
    const m = latestMtime(LISTING_PAGINATION_TEMPLATE);
    if (m) return new Date(m).toISOString();
  }

  return undefined;
}
