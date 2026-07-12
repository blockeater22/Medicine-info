import { notFound } from "next/navigation";
import { getAllDrugClasses, getDrugClass, getRelatedMedicines } from "@/lib/data";
import { buildMetadata, medicalWebPageSchema, faqSchema, JsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EditorialAttribution } from "@/components/shared/editorial-attribution";
import { ContentSection, ContentList } from "@/components/shared/content-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ContentMeta } from "@/components/shared/content-meta";
import { RelatedCardGrid } from "@/components/shared/related-card";
import { ShareButtons } from "@/components/shared/share-buttons";

export async function generateStaticParams() {
  return getAllDrugClasses().map((dc) => ({ slug: dc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dc = getDrugClass(slug);
  if (!dc) return {};
  return buildMetadata(dc.seo, `/drug-class/${slug}`);
}

export default async function DrugClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dc = getDrugClass(slug);
  if (!dc) notFound();

  const relatedMeds = getRelatedMedicines(dc.medicineSlugs);

  return (
    <div className="container-custom py-8">
      <JsonLd
        data={[
          medicalWebPageSchema({
            name: dc.name,
            description: dc.description,
            path: `/drug-class/${slug}`,
            dateModified: dc.updatedAt,
          }),
          ...(dc.faqs?.length ? [faqSchema(dc.faqs)] : []),
        ]}
      />
      <Breadcrumb
        items={[
          { label: "Drug Classes", href: "/drug-classes" },
          { label: dc.name, href: `/drug-class/${slug}` },
        ]}
      />

      <article className="max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{dc.name}</h1>
          <p className="text-lg text-muted-foreground">{dc.description}</p>
          <EditorialAttribution contentReview={dc.contentReview} updatedAt={dc.updatedAt} className="mt-4" />
          <ShareButtons url={`/drug-class/${slug}`} title={dc.name} />
        </header>

        <ContentSection title="Overview" id="overview">
          <p>{dc.overview}</p>
        </ContentSection>

        <ContentSection title="Common Uses" id="uses">
          <ContentList items={dc.commonUses} />
        </ContentSection>

        {dc.examples.length > 0 && (
          <ContentSection title="Examples" id="examples">
            <ContentList items={dc.examples} />
          </ContentSection>
        )}

        <ContentSection title="Safety Notes" id="safety">
          <ContentList items={dc.safetyNotes} />
        </ContentSection>

        {relatedMeds.length > 0 && (
          <RelatedCardGrid title="Medicines in this class" items={relatedMeds} basePath="/medicine" />
        )}

        {dc.faqs && <FAQAccordion faqs={dc.faqs} />}
        <ContentMeta updatedAt={dc.updatedAt} sources={dc.sources} />
        <MedicalDisclaimer />
      </article>
    </div>
  );
}
