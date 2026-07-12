import fs from "fs";
import path from "path";
import { getSitemapEntries, getCanonicalUrl, SITEMAP_EXCLUDED_PATHS } from "../lib/sitemap-urls.js";
import { getSiteUrl } from "../lib/site-url.js";

const errors: string[] = [];
const siteUrl = getSiteUrl();

function main() {
  const entries = getSitemapEntries();
  const urls = entries.map((e) => getCanonicalUrl(e.path));

  if (!siteUrl.startsWith("https://www.doctors-hub.in")) {
    errors.push(`Canonical base must be https://www.doctors-hub.in (got ${siteUrl})`);
  }

  if (urls.some((u) => u.includes("doctors-hub.in") && !u.includes("www.doctors-hub.in"))) {
    errors.push("Sitemap contains non-www doctors-hub.in URLs");
  }

  const unique = new Set(urls);
  if (unique.size !== urls.length) {
    errors.push(`Duplicate sitemap URLs detected (${urls.length - unique.size} duplicates)`);
  }

  for (const excluded of SITEMAP_EXCLUDED_PATHS) {
    if (urls.some((u) => u.endsWith(excluded))) {
      errors.push(`Excluded path in sitemap: ${excluded}`);
    }
  }

  const requiredPrefixes = [
    `${siteUrl}/`,
    `${siteUrl}/medicine/`,
    `${siteUrl}/disease/`,
    `${siteUrl}/symptom/`,
    `${siteUrl}/lab-test/`,
    `${siteUrl}/article/`,
    `${siteUrl}/calculator/`,
  ];

  for (const prefix of requiredPrefixes) {
    if (!urls.some((u) => u === prefix.replace(/\/$/, "") || u.startsWith(prefix))) {
      errors.push(`Missing sitemap coverage for prefix: ${prefix}`);
    }
  }

  const outDir = path.join(process.cwd(), "out");
  if (fs.existsSync(outDir)) {
    const robotsPath = path.join(outDir, "robots.txt");
    const sitemapPath = path.join(outDir, "sitemap.xml");

    if (!fs.existsSync(robotsPath)) {
      errors.push("out/robots.txt missing — run npm run build");
    } else {
      const robots = fs.readFileSync(robotsPath, "utf-8");
      if (robots.includes("Host:")) errors.push("robots.txt contains unsupported Host directive");
      if (!robots.includes(`${siteUrl}/sitemap.xml`)) {
        errors.push("robots.txt does not reference canonical sitemap.xml");
      }
      if (/Disallow:\s*\/\s*$/m.test(robots) && !robots.includes("Allow:")) {
        errors.push("robots.txt blocks entire site");
      }
    }

    if (!fs.existsSync(sitemapPath)) {
      errors.push("out/sitemap.xml missing — run npm run build");
    } else {
      const xml = fs.readFileSync(sitemapPath, "utf-8");
      if (xml.includes("<sitemapindex")) {
        errors.push("Expected single urlset sitemap.xml (no sitemap index needed at current scale)");
      }
      if (xml.includes(`${siteUrl}/sitemap.xml</loc>`)) {
        errors.push("sitemap.xml self-references in index (invalid)");
      }
      if (!xml.includes("<urlset")) errors.push("sitemap.xml is not valid urlset XML");
    }

    const stalePublicRobots = path.join(process.cwd(), "public/robots.txt");
    if (fs.existsSync(stalePublicRobots)) {
      errors.push("Remove stale public/robots.txt — use app/robots.ts only");
    }
  }

  console.log(`✓ sitemap entries: ${entries.length}`);
  console.log(`✓ canonical base: ${siteUrl}`);

  if (errors.length) {
    console.error("\nSitemap validation failed:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log("\nSitemap validation passed.");
}

main();
