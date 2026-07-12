import fs from "fs";
import path from "path";
import {
  getSitemapEntries,
  getSitemapStats,
  getCanonicalUrl,
  SITEMAP_EXCLUDED_PATHS,
} from "../lib/sitemap-urls.js";
import { AI_CRAWLER_USER_AGENTS } from "../lib/sitemap-config.js";
import { getSiteUrl } from "../lib/site-url.js";

const errors: string[] = [];
const siteUrl = getSiteUrl();

function main() {
  const entries = getSitemapEntries();
  const stats = getSitemapStats();
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

  const staticWithLastMod = entries.filter(
    (e) =>
      e.path === "/" ||
      ["/medicines", "/diseases", "/drug-classes", "/health-az", "/editorial-policy"].includes(e.path)
  );
  if (staticWithLastMod.some((e) => !e.lastModified)) {
    errors.push("Some key static pages missing lastmod in sitemap entries");
  }

  const requiredPrefixes = [
    `${siteUrl}/`,
    `${siteUrl}/medicine/`,
    `${siteUrl}/disease/`,
    `${siteUrl}/symptom/`,
    `${siteUrl}/lab-test/`,
    `${siteUrl}/drug-class/`,
    `${siteUrl}/health-az/`,
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
      const robotsLower = robots.toLowerCase();
      if (/Disallow:\s*\/\s*$/m.test(robots) && !robotsLower.includes("user-agent: *")) {
        errors.push("robots.txt blocks entire site for all agents");
      }
      for (const bot of AI_CRAWLER_USER_AGENTS.slice(0, 3)) {
        if (!robotsLower.includes(`user-agent: ${bot.toLowerCase()}`)) {
          errors.push(`robots.txt missing AI crawler block: ${bot}`);
          break;
        }
      }
    }

    if (!fs.existsSync(sitemapPath)) {
      const chunked = path.join(outDir, "sitemap", "0.xml");
      if (!stats.usesIndex && fs.existsSync(chunked)) {
        errors.push("out/sitemap.xml missing but sitemap/0.xml exists — run postbuild fix-sitemap-export");
      } else {
        errors.push("out/sitemap.xml missing — run npm run build");
      }
    } else {
      const xml = fs.readFileSync(sitemapPath, "utf-8");
      if (stats.usesIndex) {
        if (!xml.includes("<sitemapindex")) {
          errors.push("Expected sitemap index at current URL count (>5000)");
        }
      } else if (xml.includes("<sitemapindex")) {
        const chunkPath = path.join(outDir, "sitemap", "0.xml");
        if (!fs.existsSync(chunkPath)) {
          errors.push("sitemap index present but sitemap/0.xml missing");
        }
      } else if (!xml.includes("<urlset")) {
        errors.push("sitemap.xml is not valid urlset XML");
      }
      if (xml.includes(`${siteUrl}/sitemap.xml</loc>`)) {
        errors.push("sitemap.xml self-references in index (invalid)");
      }
    }

    const stalePublicRobots = path.join(process.cwd(), "public/robots.txt");
    if (fs.existsSync(stalePublicRobots)) {
      errors.push("Remove stale public/robots.txt — use app/robots.ts only");
    }
  }

  console.log(`✓ sitemap entries: ${entries.length} (chunks: ${stats.chunks}, index: ${stats.usesIndex})`);
  console.log(`✓ entries with lastmod: ${stats.withLastMod}`);
  console.log(`✓ canonical base: ${siteUrl}`);

  if (errors.length) {
    console.error("\nSitemap validation failed:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log("\nSitemap validation passed.");
}

main();
