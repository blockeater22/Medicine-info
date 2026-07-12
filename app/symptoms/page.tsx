import { getAllSymptoms } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";

export const metadata = buildMetadata({
  title: "Symptoms — Causes, Remedies & When to See a Doctor",
  description: "Understand common symptoms, their possible causes, home remedies, and when to consult a doctor.",
  keywords: ["symptoms", "health symptoms", "medical symptoms"],
}, "/symptoms");

export default function SymptomsPage() {
  const items = getAllSymptoms().sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ListingPage
      title="Symptoms"
      description="Understand symptoms, possible causes, and when to seek medical attention."
      basePath="/symptoms"
      itemBasePath="/symptom"
      breadcrumbLabel="Symptoms"
      items={items}
    />
  );
}
