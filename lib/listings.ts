export const LISTING_PAGE_SIZE = 12;

export function getListingStaticPageParams(totalItems: number) {
  const totalPages = Math.ceil(totalItems / LISTING_PAGE_SIZE);
  if (totalPages <= 1) return [];
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export function listingPageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/list/${page}`;
}

export function parseListingPage(page: string, totalItems: number): number | null {
  const pageNum = Number.parseInt(page, 10);
  const totalPages = Math.ceil(totalItems / LISTING_PAGE_SIZE);
  if (!Number.isFinite(pageNum) || pageNum < 2 || pageNum > totalPages) return null;
  return pageNum;
}
