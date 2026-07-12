import { getAllMedicines } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/shared/listing-page";

export const metadata = buildMetadata({
  title: "Medicines — Drug Information, Uses & Side Effects",
  description: "Browse comprehensive medicine information including uses, dosage, side effects, and drug interactions for Indian patients.",
  keywords: ["medicines", "drugs", "medicine guide India"],
}, "/medicines");

export default function MedicinesPage() {
  const items = getAllMedicines().sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ListingPage
      title="Medicines"
      description="Comprehensive drug information including uses, dosage, side effects, and safety warnings."
      basePath="/medicines"
      itemBasePath="/medicine"
      breadcrumbLabel="Medicines"
      items={items}
    />
  );
}
