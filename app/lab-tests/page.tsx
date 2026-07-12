import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";
import { labTestsListing } from "@/lib/listing-configs";

export const metadata = buildMetadata(labTestsListing.meta, labTestsListing.basePath);

export default function LabTestsPage() {
  return (
    <ListingPage
      title={labTestsListing.title}
      description={labTestsListing.description}
      basePath={labTestsListing.basePath}
      itemBasePath={labTestsListing.itemBasePath}
      breadcrumbLabel={labTestsListing.breadcrumbLabel}
      items={labTestsListing.getItems()}
      page={1}
    />
  );
}
