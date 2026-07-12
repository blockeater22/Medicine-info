import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";
import { diseasesListing } from "@/lib/listing-configs";

export const metadata = buildMetadata(diseasesListing.meta, diseasesListing.basePath);

export default function DiseasesPage() {
  return (
    <ListingPage
      title={diseasesListing.title}
      description={diseasesListing.description}
      basePath={diseasesListing.basePath}
      itemBasePath={diseasesListing.itemBasePath}
      breadcrumbLabel={diseasesListing.breadcrumbLabel}
      items={diseasesListing.getItems()}
      page={1}
    />
  );
}
