import { getAllDiseases } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";

export const metadata = buildMetadata({
  title: "Diseases — Symptoms, Causes & Treatment",
  description: "Browse disease information including symptoms, causes, diagnosis, treatment, and prevention guides.",
  keywords: ["diseases", "medical conditions", "health conditions India"],
}, "/diseases");

export default function DiseasesPage() {
  const items = getAllDiseases().sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ListingPage
      title="Diseases & Conditions"
      description="Learn about common diseases — symptoms, causes, diagnosis, treatment, and prevention."
      basePath="/diseases"
      itemBasePath="/disease"
      breadcrumbLabel="Diseases"
      items={items}
    />
  );
}
