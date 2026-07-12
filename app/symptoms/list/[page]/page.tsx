import { notFound } from "next/navigation";
import { ListingPage } from "@/components/shared/listing-page";
import { buildMetadata } from "@/lib/seo";
import { symptomsListing } from "@/lib/listing-configs";
import { getListingStaticPageParams, parseListingPage } from "@/lib/listings";

export function generateStaticParams() {
  return getListingStaticPageParams(symptomsListing.getItems().length);
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return buildMetadata(
    {
      ...symptomsListing.meta,
      title: `${symptomsListing.meta.title} — Page ${page}`,
    },
    `${symptomsListing.basePath}/list/${page}`
  );
}

export default async function SymptomsListPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const items = symptomsListing.getItems();
  const pageNum = parseListingPage(page, items.length);
  if (pageNum === null) notFound();

  return (
    <ListingPage
      title={symptomsListing.title}
      description={symptomsListing.description}
      basePath={symptomsListing.basePath}
      itemBasePath={symptomsListing.itemBasePath}
      breadcrumbLabel={symptomsListing.breadcrumbLabel}
      items={items}
      page={pageNum}
    />
  );
}
