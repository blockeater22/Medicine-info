import { notFound } from "next/navigation";
import { ListingPage } from "@/components/shared/listing-page";
import { buildMetadata } from "@/lib/seo";
import { labTestsListing } from "@/lib/listing-configs";
import { getListingStaticPageParams, parseListingPage } from "@/lib/listings";

export function generateStaticParams() {
  return getListingStaticPageParams(labTestsListing.getItems().length);
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return buildMetadata(
    {
      ...labTestsListing.meta,
      title: `${labTestsListing.meta.title} — Page ${page}`,
    },
    `${labTestsListing.basePath}/list/${page}`
  );
}

export default async function LabTestsListPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const items = labTestsListing.getItems();
  const pageNum = parseListingPage(page, items.length);
  if (pageNum === null) notFound();

  return (
    <ListingPage
      title={labTestsListing.title}
      description={labTestsListing.description}
      basePath={labTestsListing.basePath}
      itemBasePath={labTestsListing.itemBasePath}
      breadcrumbLabel={labTestsListing.breadcrumbLabel}
      items={items}
      page={pageNum}
    />
  );
}
