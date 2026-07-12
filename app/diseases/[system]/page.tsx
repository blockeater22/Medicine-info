import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { CategoryHubPage } from "@/components/shared/category-hub-page";
import { getDiseaseSystems, getDiseasesBySystem } from "@/lib/categories";
import { categoryIntro } from "@/lib/category-copy";

export async function generateStaticParams() {
  return getDiseaseSystems().map((c) => ({ system: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ system: string }> }) {
  const { system } = await params;
  const hub = getDiseaseSystems().find((c) => c.slug === system);
  if (!hub) return {};
  return buildMetadata(
    {
      title: `${hub.name} Diseases & Conditions | Doctors Hub`,
      description: `${hub.count} guides on ${hub.name.toLowerCase()} conditions — symptoms, diagnosis, treatment, and prevention in India.`,
      keywords: [hub.name, "diseases India", "health conditions"],
    },
    `/diseases/${system}`
  );
}

export default async function DiseaseSystemPage({ params }: { params: Promise<{ system: string }> }) {
  const { system } = await params;
  const hub = getDiseaseSystems().find((c) => c.slug === system);
  if (!hub) notFound();

  const items = getDiseasesBySystem(system);

  return (
    <CategoryHubPage
      title={`${hub.name} Diseases`}
      description={`Health guides for ${hub.name.toLowerCase()} conditions.`}
      intro={categoryIntro("disease", hub.name, hub.count)}
      basePath="/diseases"
      categoryLabel="Diseases"
      categorySlug={system}
      items={items}
      itemBasePath="/disease"
    />
  );
}
