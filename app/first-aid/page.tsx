import { getAllFirstAid } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";

export const metadata = buildMetadata({
  title: "First Aid Guides — Emergency Step-by-Step Instructions",
  description: "Emergency first aid guides for burns, choking, CPR, snake bites, and more with Indian emergency numbers.",
  keywords: ["first aid", "emergency guide", "CPR", "first aid India"],
}, "/first-aid");

export default function FirstAidListingPage() {
  const items = getAllFirstAid().sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ListingPage
      title="First Aid Guides"
      description="Step-by-step emergency first aid instructions with do's, don'ts, and emergency numbers."
      basePath="/first-aid"
      itemBasePath="/first-aid"
      breadcrumbLabel="First Aid"
      items={items}
    />
  );
}
