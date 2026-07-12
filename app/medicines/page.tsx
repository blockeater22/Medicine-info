import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";
import { medicinesListing } from "@/lib/listing-configs";

export const metadata = buildMetadata(medicinesListing.meta, medicinesListing.basePath);

export default function MedicinesPage() {
  return (
    <ListingPage
      title={medicinesListing.title}
      description={medicinesListing.description}
      basePath={medicinesListing.basePath}
      itemBasePath={medicinesListing.itemBasePath}
      breadcrumbLabel={medicinesListing.breadcrumbLabel}
      items={medicinesListing.getItems()}
      page={1}
    />
  );
}
