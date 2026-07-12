import { notFound } from "next/navigation";
import { getAllCalculators, getCalculator } from "@/lib/data";
import { buildMetadata, faqSchema, JsonLd, medicalWebPageSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EditorialAttribution } from "@/components/shared/editorial-attribution";
import { CalculatorEngine } from "@/components/calculators/calculator-engine";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { TopBannerAd } from "@/components/ads/ad-placeholder";

export async function generateStaticParams() {
  return getAllCalculators().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};
  return buildMetadata(calc.seo, `/calculator/${slug}`);
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  return (
    <div className="container-custom py-8 max-w-2xl">
      <TrackRecentlyViewed slug={slug} name={calc.name} href={`/calculator/${slug}`} type="calculator" />
      <JsonLd
        data={[
          medicalWebPageSchema({
            name: calc.name,
            description: calc.description,
            path: `/calculator/${slug}`,
            dateModified: calc.updatedAt,
          }),
          ...(calc.faqs?.length ? [faqSchema(calc.faqs)] : []),
        ]}
      />
      <Breadcrumb items={[{ label: "Calculators", href: "/calculators" }, { label: calc.name, href: `/calculator/${slug}` }]} />

      <header className="mb-8">
        <span className="text-sm font-medium text-primary">{calc.category}</span>
        <h1 className="text-3xl font-bold mt-1 mb-4">{calc.name}</h1>
        <p className="text-muted-foreground">{calc.description}</p>
        <EditorialAttribution contentReview={calc.contentReview} updatedAt={calc.updatedAt} className="mt-4" />
      </header>

      <TopBannerAd />

      <CalculatorEngine slug={slug} name={calc.name} inputs={calc.inputs} />

      {calc.interpretation && (
        <div className="mt-6 rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Interpretation Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {calc.interpretation.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
        </div>
      )}

      {calc.faqs && <div className="mt-8"><FAQAccordion faqs={calc.faqs} /></div>}
      <div className="mt-8"><MedicalDisclaimer compact /></div>
    </div>
  );
}
