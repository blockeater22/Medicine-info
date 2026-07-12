import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SearchResults } from "@/components/search/search-results";
import { buildSearchIndex } from "@/lib/data";

export const metadata = buildMetadata({
  title: "Search — Find Medicines, Diseases & Health Info",
  description: "Search Doctors Hub for medicines, diseases, symptoms, lab tests, calculators, and health articles.",
  keywords: ["search", "medical search"],
  noindex: true,
}, "/search");

export default function SearchPage() {
  const index = buildSearchIndex();

  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Search", href: "/search" }]} />
      <h1 className="text-3xl font-bold mb-8">Search Medical Information</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading search...</p>}>
        <SearchResults index={index} />
      </Suspense>
    </div>
  );
}
