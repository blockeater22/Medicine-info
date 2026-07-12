import { notFound } from "next/navigation";
import { getAllMedicines, getMedicine, getRelatedDiseases, getRelatedMedicines } from "@/lib/data";
import { buildMetadata, medicineSchema, medicalWebPageSchema, faqSchema, JsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AuthorBlock } from "@/components/shared/author-block";
import { ContentSection, ContentList, TableOfContents } from "@/components/shared/content-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ContentMeta } from "@/components/shared/content-meta";
import { RelatedCardGrid } from "@/components/shared/related-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { TopBannerAd, InlineAd, SidebarAd } from "@/components/ads/ad-placeholder";

export async function generateStaticParams() {
  return getAllMedicines().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const medicine = getMedicine(slug);
  if (!medicine) return {};
  return buildMetadata(medicine.seo, `/medicine/${slug}`);
}

const SECTIONS = [
  { id: "uses", title: "Uses" }, { id: "how-it-works", title: "How It Works" },
  { id: "dosage", title: "Dosage" }, { id: "side-effects", title: "Side Effects" },
  { id: "warnings", title: "Warnings" }, { id: "interactions", title: "Interactions" },
  { id: "safety", title: "Safety Information" }, { id: "faqs", title: "FAQs" },
];

export default async function MedicinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const medicine = getMedicine(slug);
  if (!medicine) notFound();

  const relatedMeds = getRelatedMedicines(medicine.alternatives);
  const relatedDis = getRelatedDiseases(medicine.relatedDiseases);
  const breadcrumbItems = [{ label: "Medicines", href: "/medicines" }, { label: medicine.name, href: `/medicine/${slug}` }];

  return (
    <div className="container-custom py-8">
      <TrackRecentlyViewed slug={slug} name={medicine.name} href={`/medicine/${slug}`} type="medicine" />
      <JsonLd
        data={[
          medicineSchema(medicine),
          medicalWebPageSchema({
            name: medicine.name,
            description: medicine.description,
            path: `/medicine/${slug}`,
            dateModified: medicine.updatedAt,
          }),
          ...(medicine.faqs?.length ? [faqSchema(medicine.faqs)] : []),
        ]}
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-8">
          <header>
            <span className="text-sm font-medium text-primary">{medicine.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-2">{medicine.name}</h1>
            <p className="text-muted-foreground">Generic: {medicine.genericName} | Brands: {medicine.brandNames.join(", ")}</p>
            <p className="mt-4 text-lg leading-relaxed">{medicine.description}</p>
            <AuthorBlock authoredBy={medicine.authoredBy} className="mt-4" />
            <div className="mt-4">
              <ShareButtons url={`/medicine/${slug}`} title={medicine.name} />
            </div>
          </header>

          <TopBannerAd />

          <ContentSection title="Composition" id="composition">
            <p>{medicine.composition}</p>
          </ContentSection>

          <ContentSection title="Uses" id="uses">
            <ContentList items={medicine.uses} />
          </ContentSection>

          <ContentSection title="How It Works" id="how-it-works">
            <p>{medicine.howItWorks}</p>
          </ContentSection>

          <ContentSection title="Dosage" id="dosage">
            <div className="space-y-2">
              <p><strong>Adults:</strong> {medicine.dosage.adults}</p>
              {medicine.dosage.children && <p><strong>Children:</strong> {medicine.dosage.children}</p>}
              {medicine.dosage.elderly && <p><strong>Elderly:</strong> {medicine.dosage.elderly}</p>}
              {medicine.dosage.notes && <p><strong>Notes:</strong> {medicine.dosage.notes}</p>}
            </div>
            <div className="mt-4 space-y-2">
              <p><strong>Missed Dose:</strong> {medicine.missedDose}</p>
              <p><strong>Overdose:</strong> {medicine.overdose}</p>
            </div>
          </ContentSection>

          <InlineAd />

          <ContentSection title="Side Effects" id="side-effects">
            <ContentList items={medicine.sideEffects} />
          </ContentSection>

          <ContentSection title="Warnings" id="warnings">
            <ContentList items={medicine.warnings} />
          </ContentSection>

          <ContentSection title="Drug & Food Interactions" id="interactions">
            <p className="mb-2"><strong>Food:</strong> {medicine.foodInteraction}</p>
            <p className="mb-2"><strong>Alcohol:</strong> {medicine.alcohol}</p>
            <ContentList items={medicine.drugInteractions} />
          </ContentSection>

          <ContentSection title="Safety Information" id="safety">
            <div className="space-y-2">
              <p><strong>Pregnancy:</strong> {medicine.pregnancy}</p>
              <p><strong>Breastfeeding:</strong> {medicine.breastfeeding}</p>
              <p><strong>Kidney Disease:</strong> {medicine.kidneyDisease}</p>
              <p><strong>Liver Disease:</strong> {medicine.liverDisease}</p>
              <p><strong>Driving:</strong> {medicine.driving}</p>
              <p><strong>Storage:</strong> {medicine.storage}</p>
            </div>
          </ContentSection>

          {medicine.faqs && <FAQAccordion faqs={medicine.faqs} />}
          <ContentMeta updatedAt={medicine.updatedAt} sources={medicine.sources} />
          <MedicalDisclaimer />
        </article>

        <aside className="space-y-6">
          <TableOfContents sections={SECTIONS} />
          <SidebarAd />
        </aside>
      </div>

      <div className="mt-12 space-y-8">
        {relatedMeds.length > 0 && <RelatedCardGrid title="Related Medicines" items={relatedMeds} basePath="/medicine" />}
        {relatedDis.length > 0 && <RelatedCardGrid title="Related Diseases" items={relatedDis} basePath="/disease" />}
      </div>
    </div>
  );
}
