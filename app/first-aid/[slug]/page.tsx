import { notFound } from "next/navigation";
import { getAllFirstAid, getFirstAid } from "@/lib/data";
import { buildMetadata, faqSchema, JsonLd, medicalWebPageSchema } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EditorialAttribution } from "@/components/shared/editorial-attribution";
import { ContentSection, ContentList } from "@/components/shared/content-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { ShareButtons } from "@/components/shared/share-buttons";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { TopBannerAd } from "@/components/ads/ad-placeholder";

export async function generateStaticParams() {
  return getAllFirstAid().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getFirstAid(slug);
  if (!guide) return {};
  return buildMetadata(guide.seo, `/first-aid/${slug}`);
}

export default async function FirstAidPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getFirstAid(slug);
  if (!guide) notFound();

  return (
    <div className="container-custom py-8 max-w-4xl">
      <TrackRecentlyViewed slug={slug} name={guide.name} href={`/first-aid/${slug}`} type="first-aid" />
      <JsonLd
        data={[
          medicalWebPageSchema({
            name: guide.name,
            description: guide.description,
            path: `/first-aid/${slug}`,
            dateModified: guide.updatedAt,
          }),
          ...(guide.faqs?.length ? [faqSchema(guide.faqs)] : []),
        ]}
      />
      <Breadcrumb items={[{ label: "First Aid", href: "/first-aid" }, { label: guide.name, href: `/first-aid/${slug}` }]} />

      <EmergencyBanner />

      <header className="my-8">
        <span className="text-sm font-medium text-red-600 capitalize">{guide.severity} emergency</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-4">{guide.name}</h1>
        <p className="text-lg leading-relaxed">{guide.description}</p>
        <EditorialAttribution contentReview={guide.contentReview} updatedAt={guide.updatedAt} className="mt-4" />
        <div className="mt-4"><ShareButtons url={`/first-aid/${slug}`} title={guide.name} /></div>
      </header>

      <TopBannerAd />

      <article className="space-y-8">
        <ContentSection title="Step-by-Step Guide">
          <ol className="space-y-4">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </ContentSection>

        <div className="grid md:grid-cols-2 gap-6">
          <ContentSection title="Do's"><ContentList items={guide.dos} /></ContentSection>
          <ContentSection title="Don'ts"><ContentList items={guide.donts} /></ContentSection>
        </div>

        <ContentSection title="Emergency Numbers">
          <div className="flex flex-wrap gap-4">
            {guide.emergencyNumbers.map((num) => (
              <a key={num.number} href={`tel:${num.number}`} className="rounded-xl border px-4 py-3 hover:border-primary/30 transition-colors">
                <p className="text-sm text-muted-foreground">{num.label}</p>
                <p className="text-lg font-bold text-primary">{num.number}</p>
              </a>
            ))}
          </div>
        </ContentSection>

        {guide.faqs && <FAQAccordion faqs={guide.faqs} />}
        <MedicalDisclaimer />
      </article>
    </div>
  );
}
