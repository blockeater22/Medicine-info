import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { CategoryHubPage } from "@/components/shared/category-hub-page";
import { getMedicineCategories, getMedicinesByCategory } from "@/lib/categories";
import { categoryIntro } from "@/lib/category-copy";

export async function generateStaticParams() {
  return getMedicineCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const hub = getMedicineCategories().find((c) => c.slug === category);
  if (!hub) return {};
  return buildMetadata(
    {
      title: `${hub.name} Medicines in India | Doctors Hub`,
      description: `Browse ${hub.count} ${hub.name.toLowerCase()} medicine guides — uses, dosage, side effects, and safety for patients in India.`,
      keywords: [hub.name, "medicines India", "drug guide"],
    },
    `/medicines/${category}`
  );
}

export default async function MedicineCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const hub = getMedicineCategories().find((c) => c.slug === category);
  if (!hub) notFound();

  const items = getMedicinesByCategory(category);

  return (
    <CategoryHubPage
      title={`${hub.name} Medicines`}
      description={`Patient guides for ${hub.name.toLowerCase()} medicines available in India.`}
      intro={categoryIntro("medicine", hub.name, hub.count)}
      basePath="/medicines"
      categoryLabel="Medicines"
      categorySlug={category}
      items={items}
      itemBasePath="/medicine"
    />
  );
}
