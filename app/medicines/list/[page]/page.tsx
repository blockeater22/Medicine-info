import { notFound } from "next/navigation";
import { ListingPage } from "@/components/shared/listing-page";
import { buildMetadata } from "@/lib/seo";
import { medicinesListing } from "@/lib/listing-configs";
import { getListingStaticPageParams, parseListingPage } from "@/lib/listings";

export function generateStaticParams() {
  return getListingStaticPageParams(medicinesListing.getItems().length);
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return buildMetadata(
    {
      ...medicinesListing.meta,
      title: `${medicinesListing.meta.title} — Page ${page}`,
    },
    `${medicinesListing.basePath}/list/${page}`
  );
}

export default async function MedicinesListPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const items = medicinesListing.getItems();
  const pageNum = parseListingPage(page, items.length);
  if (pageNum === null) notFound();

  return (
    <ListingPage
      title={medicinesListing.title}
      description={medicinesListing.description}
      basePath={medicinesListing.basePath}
      itemBasePath={medicinesListing.itemBasePath}
      breadcrumbLabel={medicinesListing.breadcrumbLabel}
      items={items}
      page={pageNum}
    />
  );
}
