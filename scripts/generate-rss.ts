import fs from "fs";
import path from "path";
import { buildSearchIndex } from "../lib/data.js";
import { getAllArticles } from "../lib/data.js";
import { SITE } from "../lib/constants.js";

const DOMAIN = SITE.domain;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function main() {
  const index = buildSearchIndex();
  const articles = getAllArticles().slice(0, 50);

  const items = [
    ...articles.map((a) => ({
      title: a.name,
      link: `${DOMAIN}/article/${a.slug}`,
      description: a.description,
      pubDate: new Date(a.updatedAt).toUTCString(),
    })),
    ...index.slice(0, 30).map((item) => ({
      title: item.name,
      link: `${DOMAIN}${item.href}`,
      description: item.description,
      pubDate: new Date().toUTCString(),
    })),
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${DOMAIN}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  const outPath = path.join(process.cwd(), "public", "feed.xml");
  fs.writeFileSync(outPath, rss.trim());
  console.log(`RSS feed generated: ${items.length} items → public/feed.xml`);
}

main();
