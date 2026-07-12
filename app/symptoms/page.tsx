import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";
import { symptomsListing } from "@/lib/listing-configs";

export const metadata = buildMetadata(symptomsListing.meta, symptomsListing.basePath);

export default function SymptomsPage() {
  return (
    <ListingPage
      title={symptomsListing.title}
      description={symptomsListing.description}
      basePath={symptomsListing.basePath}
      itemBasePath={symptomsListing.itemBasePath}
      breadcrumbLabel={symptomsListing.breadcrumbLabel}
      items={symptomsListing.getItems()}
      page={1}
    />
  );
}
