import type { MetadataRoute } from "next";
import { getCanonicalUrl, getSitemapEntries } from "@/lib/sitemap-urls";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries().map((entry) => ({
    url: getCanonicalUrl(entry.path),
    lastModified: entry.lastModified ? new Date(entry.lastModified) : undefined,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
