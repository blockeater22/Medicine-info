import type { MetadataRoute } from "next";
import {
  getSitemapChunkCount,
  getSitemapChunkEntries,
  getSitemapEntries,
  toMetadataSitemapEntry,
  usesSitemapIndex,
} from "@/lib/sitemap-urls";

export const dynamic = "force-static";

export async function generateSitemaps() {
  const count = getSitemapChunkCount();
  return Array.from({ length: count }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<number> }): Promise<MetadataRoute.Sitemap> {
  if (usesSitemapIndex()) {
    const id = await props.id;
    return getSitemapChunkEntries(id).map(toMetadataSitemapEntry);
  }

  return getSitemapEntries().map(toMetadataSitemapEntry);
}
