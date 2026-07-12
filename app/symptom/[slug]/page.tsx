import { notFound } from "next/navigation";
import { getAllSymptoms, getSymptom, getRelatedDiseases } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ContentSection, ContentList } from "@/components/shared/content-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { RelatedCardGrid } from "@/components/shared/related-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { TopBannerAd, InlineAd } from "@/components/ads/ad-placeholder";

export async function generateStaticParams() {
  return getAllSymptoms().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const symptom = getSymptom(slug);
  if (!symptom) return {};
  return buildMetadata(symptom.seo, `/symptom/${slug}`);
}

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const symptom = getSymptom(slug);
  if (!symptom) notFound();

  const relatedDis = getRelatedDiseases(symptom.relatedDiseases);

  return (
    <div className="container-custom py-8 max-w-4xl">
      <TrackRecentlyViewed slug={slug} name={symptom.name} href={`/symptom/${slug}`} type="symptom" />
      <Breadcrumb items={[{ label: "Symptoms", href: "/symptoms" }, { label: symptom.name, href: `/symptom/${slug}` }]} />

      <header className="mb-8">
        <span className="text-sm font-medium text-primary">{symptom.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-4">{symptom.name}</h1>
        <p className="text-lg leading-relaxed">{symptom.description}</p>
        <div className="mt-4"><ShareButtons url={`/symptom/${slug}`} title={symptom.name} /></div>
      </header>

      <TopBannerAd />

      <article className="space-y-8">
        <ContentSection title="Description"><p>{symptom.description}</p></ContentSection>
        <ContentSection title="Possible Causes"><ContentList items={symptom.possibleCauses} /></ContentSection>
        <EmergencyBanner />
        <ContentSection title="Emergency Symptoms"><ContentList items={symptom.emergencySymptoms} /></ContentSection>
        <InlineAd />
        <ContentSection title="Home Remedies"><ContentList items={symptom.homeRemedies} /></ContentSection>
        <ContentSection title="When to Visit a Doctor"><ContentList items={symptom.whenToVisitDoctor} /></ContentSection>
        {symptom.faqs && <FAQAccordion faqs={symptom.faqs} />}
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
