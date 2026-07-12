import { notFound } from "next/navigation";
import { getAllLabTests, getDiseasesForLabTest, getLabTest, getRelatedDiseases } from "@/lib/data";
import { buildMetadata, medicalTestSchema, medicalWebPageSchema, faqSchema, JsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EditorialAttribution } from "@/components/shared/editorial-attribution";
import { ContentSection, ContentList } from "@/components/shared/content-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ShareButtons } from "@/components/shared/share-buttons";
import { RelatedCardGrid } from "@/components/shared/related-card";
import { ContextualText } from "@/components/shared/contextual-text";
import { EntityHubLinks } from "@/components/shared/entity-hub-links";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { TopBannerAd, InlineAd } from "@/components/ads/ad-placeholder";

export async function generateStaticParams() {
  return getAllLabTests().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getLabTest(slug);
  if (!test) return {};
  return buildMetadata(test.seo, `/lab-test/${slug}`);
}

export default async function LabTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getLabTest(slug);
  if (!test) notFound();

  const relatedDis = getRelatedDiseases(test.relatedDiseases ?? getDiseasesForLabTest(slug).map((d) => d.slug));
  const pageHref = `/lab-test/${slug}`;

  return (
    <div className="container-custom py-8 max-w-4xl">
      <TrackRecentlyViewed slug={slug} name={test.name} href={`/lab-test/${slug}`} type="lab-test" />
      <JsonLd
        data={[
          medicalTestSchema(test),
          medicalWebPageSchema({
            name: test.name,
            description: test.description,
            path: `/lab-test/${slug}`,
            dateModified: test.updatedAt,
          }),
          ...(test.faqs?.length ? [faqSchema(test.faqs)] : []),
        ]}
      />
      <Breadcrumb items={[{ label: "Lab Tests", href: "/lab-tests" }, { label: test.name, href: `/lab-test/${slug}` }]} />

      <header className="mb-8">
        <span className="text-sm font-medium text-primary">{test.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-4">{test.name}</h1>
        <p className="text-lg leading-relaxed">
          <ContextualText text={test.description} excludeHref={pageHref} maxLinks={1} />
        </p>
        <EditorialAttribution contentReview={test.contentReview} updatedAt={test.updatedAt} className="mt-4" />
        <EntityHubLinks type="lab-test" name={test.name} category={test.category} />
        <div className="mt-4"><ShareButtons url={`/lab-test/${slug}`} title={test.name} /></div>
      </header>

      <TopBannerAd />

      <article className="space-y-8">
        <ContentSection title="Overview"><p><ContextualText text={test.overview} excludeHref={pageHref} maxLinks={1} /></p></ContentSection>
        <ContentSection title="Purpose"><ContentList items={test.purpose} contextual excludeHref={pageHref} maxLinks={1} /></ContentSection>
        <ContentSection title="Preparation"><ContentList items={test.preparation} /></ContentSection>
        <ContentSection title="Procedure"><ContentList items={test.procedure} /></ContentSection>
        <InlineAd />
        <ContentSection title="Normal Range"><p>{test.normalRange}</p></ContentSection>
        <ContentSection title="High Values Mean"><ContentList items={test.highMeans} /></ContentSection>
        <ContentSection title="Low Values Mean"><ContentList items={test.lowMeans} /></ContentSection>
        <ContentSection title="Interpretation"><ContentList items={test.interpretation} /></ContentSection>
        {test.faqs && <FAQAccordion faqs={test.faqs} />}
        <MedicalDisclaimer />
      </article>

      {relatedDis.length > 0 && (
        <div className="mt-12">
          <RelatedCardGrid title="Related Diseases" items={relatedDis} basePath="/disease" />
        </div>
      )}
    </div>
  );
}
