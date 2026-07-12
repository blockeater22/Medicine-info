import { notFound } from "next/navigation";
import { ListingPage } from "@/components/shared/listing-page";
import { buildMetadata } from "@/lib/seo";
import { diseasesListing } from "@/lib/listing-configs";
import { getListingStaticPageParams, parseListingPage } from "@/lib/listings";

export function generateStaticParams() {
  return getListingStaticPageParams(diseasesListing.getItems().length);
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return buildMetadata(
    {
      ...diseasesListing.meta,
      title: `${diseasesListing.meta.title} — Page ${page}`,
    },
    `${diseasesListing.basePath}/list/${page}`
  );
}

export default async function DiseasesListPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const items = diseasesListing.getItems();
  const pageNum = parseListingPage(page, items.length);
  if (pageNum === null) notFound();

  return (
    <ListingPage
      title={diseasesListing.title}
      description={diseasesListing.description}
      basePath={diseasesListing.basePath}
      itemBasePath={diseasesListing.itemBasePath}
      breadcrumbLabel={diseasesListing.breadcrumbLabel}
      items={items}
      page={pageNum}
    />
  );
}
