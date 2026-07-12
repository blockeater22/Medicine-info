import { notFound } from "next/navigation";
import { getAllDiseases, getDisease, getRelatedLabTests, getRelatedMedicines } from "@/lib/data";
import { buildMetadata, medicalConditionSchema, medicalWebPageSchema, faqSchema, JsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EditorialAttribution } from "@/components/shared/editorial-attribution";
import { ContentSection, ContentList, TableOfContents } from "@/components/shared/content-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ContentMeta } from "@/components/shared/content-meta";
import { RelatedCardGrid } from "@/components/shared/related-card";
import { ContextualText } from "@/components/shared/contextual-text";
import { EntityHubLinks } from "@/components/shared/entity-hub-links";
import { ShareButtons } from "@/components/shared/share-buttons";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { TopBannerAd, InlineAd, SidebarAd } from "@/components/ads/ad-placeholder";

export async function generateStaticParams() {
  return getAllDiseases().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) return {};
  return buildMetadata(disease.seo, `/disease/${slug}`);
}

const SECTIONS = [
  { id: "overview", title: "Overview" }, { id: "symptoms", title: "Symptoms" },
  { id: "causes", title: "Causes" }, { id: "diagnosis", title: "Diagnosis" },
  { id: "treatment", title: "Treatment" }, { id: "prevention", title: "Prevention" },
  { id: "faqs", title: "FAQs" },
];

export default async function DiseasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) notFound();

  const relatedMeds = getRelatedMedicines(disease.relatedMedicines);
  const relatedTests = getRelatedLabTests(disease.relatedSlugs ?? []);
  const pageHref = `/disease/${slug}`;

  return (
    <div className="container-custom py-8">
      <TrackRecentlyViewed slug={slug} name={disease.name} href={`/disease/${slug}`} type="disease" />
      <JsonLd
        data={[
          medicalConditionSchema(disease),
          medicalWebPageSchema({
            name: disease.name,
            description: disease.description,
            path: `/disease/${slug}`,
            dateModified: disease.updatedAt,
          }),
          ...(disease.faqs?.length ? [faqSchema(disease.faqs)] : []),
        ]}
      />
      <Breadcrumb items={[{ label: "Diseases", href: "/diseases" }, { label: disease.name, href: `/disease/${slug}` }]} />

      <div className="grid lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-8">
          <header>
            <span className="text-sm font-medium text-primary">{disease.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-4">{disease.name}</h1>
            <p className="text-lg leading-relaxed">
              <ContextualText text={disease.description} excludeHref={pageHref} maxLinks={2} />
            </p>
            <EditorialAttribution contentReview={disease.contentReview} updatedAt={disease.updatedAt} className="mt-4" />
            <EntityHubLinks type="disease" name={disease.name} category={disease.category} />
            <div className="mt-4"><ShareButtons url={`/disease/${slug}`} title={disease.name} /></div>
          </header>

          <TopBannerAd />

          <ContentSection title="Overview" id="overview">
            <p>
              <ContextualText text={disease.overview} excludeHref={pageHref} maxLinks={2} />
            </p>
          </ContentSection>
          <ContentSection title="Symptoms" id="symptoms"><ContentList items={disease.symptoms} /></ContentSection>
          <ContentSection title="Causes" id="causes"><ContentList items={disease.causes} /></ContentSection>
          <ContentSection title="Risk Factors" id="risk-factors"><ContentList items={disease.riskFactors} /></ContentSection>
          <ContentSection title="Diagnosis" id="diagnosis"><ContentList items={disease.diagnosis} /></ContentSection>

          <InlineAd />

          <ContentSection title="Treatment" id="treatment">
            <ContentList items={disease.treatment} contextual excludeHref={pageHref} maxLinks={1} />
          </ContentSection>
          <ContentSection title="Home Care" id="home-care"><ContentList items={disease.homeCare} /></ContentSection>
          <ContentSection title="Prevention" id="prevention"><ContentList items={disease.prevention} /></ContentSection>
          <ContentSection title="Complications" id="complications"><ContentList items={disease.complications} /></ContentSection>

          <EmergencyBanner />
          <ContentSection title="Emergency Warning Signs" id="emergency">
            <ContentList items={disease.emergencyWarningSigns} />
          </ContentSection>

          {disease.faqs && <FAQAccordion faqs={disease.faqs} />}
          <ContentMeta updatedAt={disease.updatedAt} sources={disease.sources} />
          <MedicalDisclaimer />
        </article>

        <aside className="space-y-6">
          <TableOfContents sections={SECTIONS} />
          <SidebarAd />
        </aside>
      </div>

      <div className="mt-12 space-y-8">
        {relatedMeds.length > 0 && <RelatedCardGrid title="Related Medicines" items={relatedMeds} basePath="/medicine" />}
        {relatedTests.length > 0 && <RelatedCardGrid title="Related Lab Tests" items={relatedTests} basePath="/lab-test" />}
      </div>
    </div>
  );
}
