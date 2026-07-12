import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { MedicalCard } from "@/components/shared/medical-card";
import { getDrugClassCategories } from "@/lib/categories";

export const metadata = buildMetadata(
  {
    title: "Drug Classes: Medicine Groups & Safety Guides | Doctors Hub",
    description:
      "Browse drug classes used in India — antibiotics, statins, NSAIDs, antidiabetics, and more. Patient-friendly guides with linked medicines.",
    keywords: ["drug classes", "medicine groups", "pharmacology India"],
  },
  "/drug-classes"
);

export default function DrugClassesPage() {
  const classes = getDrugClassCategories();

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "Drug Classes", href: "/drug-classes" }]} />
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Drug Classes</h1>
        <p className="text-lg text-muted-foreground">
          Medicines grouped by therapeutic class — how they work, common uses, and safety notes for patients in India.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((dc) => (
          <MedicalCard
            key={dc.slug}
            title={dc.name}
            description={`${dc.count} linked medicine${dc.count === 1 ? "" : "s"}`}
            href={`/drug-class/${dc.slug}`}
          />
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Browse individual medicines on the{" "}
        <Link href="/medicines" className="text-primary hover:underline">
          medicines directory
        </Link>
        .
      </p>
    </div>
  );
}
