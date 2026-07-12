import { getAllLabTests } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";

export const metadata = buildMetadata({
  title: "Lab Tests — Purpose, Preparation & Normal Range",
  description: "Complete guide to medical lab tests in India — preparation, procedure, normal ranges, and result interpretation.",
  keywords: ["lab tests", "blood tests", "diagnostic tests India"],
}, "/lab-tests");

export default function LabTestsPage() {
  const items = getAllLabTests().sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ListingPage
      title="Lab Tests"
      description="Diagnostic test guides — preparation, procedure, normal ranges, and interpretation."
      basePath="/lab-tests"
      itemBasePath="/lab-test"
      breadcrumbLabel="Lab Tests"
      items={items}
    />
  );
}
