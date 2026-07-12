import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";
import { firstAidListing } from "@/lib/listing-configs";

export const metadata = buildMetadata(firstAidListing.meta, firstAidListing.basePath);

export default function FirstAidListingPage() {
  return (
    <ListingPage
      title={firstAidListing.title}
      description={firstAidListing.description}
      basePath={firstAidListing.basePath}
      itemBasePath={firstAidListing.itemBasePath}
      breadcrumbLabel={firstAidListing.breadcrumbLabel}
      items={firstAidListing.getItems()}
      page={1}
    />
  );
}
