import fs from "fs";
import path from "path";
import { getSitemapChunkCount, getSitemapStats, getCanonicalUrl } from "../lib/sitemap-urls.js";

/** Ensure out/sitemap.xml exists for static export (Next chunks to sitemap/N.xml when generateSitemaps is used). */
function main() {
  const outDir = path.join(process.cwd(), "out");
  const stats = getSitemapStats();
  const rootPath = path.join(outDir, "sitemap.xml");

  if (!fs.existsSync(outDir)) {
    console.warn("[fix-sitemap] out/ missing — skip");
    return;
  }

  if (stats.usesIndex) {
    const chunks = getSitemapChunkCount();
    const entries = Array.from({ length: chunks }, (_, id) => {
      const loc = getCanonicalUrl(`/sitemap/${id}.xml`);
      return `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`;
    });
    const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>\n`;
    fs.writeFileSync(rootPath, index);
    console.log(`[fix-sitemap] wrote sitemap index (${chunks} chunks)`);
    return;
  }

  const chunked = path.join(outDir, "sitemap", "0.xml");
  if (fs.existsSync(chunked)) {
    fs.copyFileSync(chunked, rootPath);
    console.log("[fix-sitemap] copied sitemap/0.xml → sitemap.xml");
    return;
  }

  if (!fs.existsSync(rootPath)) {
    console.warn("[fix-sitemap] no sitemap output found");
    process.exit(1);
  }
}

main();
