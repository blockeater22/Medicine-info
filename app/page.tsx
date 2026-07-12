import Link from "next/link";
import {
  Pill, Heart, FlaskConical, Calculator, Siren, BookOpen, Activity,
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
// Newsletter disabled — no backend to store or email subscribers yet.
// import { NewsletterSection } from "@/components/home/newsletter-section";
import { DeferredRecentlyViewed } from "@/components/home/deferred-recently-viewed";
import { MedicalCard } from "@/components/shared/medical-card";
import { ArticleCard } from "@/components/shared/article-card";
import { CategoryCard } from "@/components/shared/category-card";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { TopBannerAd } from "@/components/ads/ad-placeholder";
import {
  getPopularCalculators,
  getPopularDiseases,
  getPopularLabTests,
  getPopularMedicines,
  getPopularFirstAid,
  getTrendingArticles,
} from "@/lib/data";
import { buildMetadata, faqSchema, JsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  keywords: ["medical information", "medicines India", "diseases", "health"],
});

const HOME_FAQS = [
  { question: "Is Doctors Hub free to use?", answer: "Yes, Doctors Hub is completely free. All medical information, calculators, and guides are available at no cost." },
  { question: "Can I use this information instead of seeing a doctor?", answer: "No. Our content is for educational purposes only. Always consult a qualified healthcare professional for diagnosis and treatment." },
  { question: "How often is content updated?", answer: "We follow our content review process and update pages when guidelines change, errors are reported, or on a scheduled review cycle." },
  { question: "Does Doctors Hub sell medicines?", answer: "No. We provide information only. We do not sell or prescribe medicines." },
];

const categories = [
  { title: "Medicines", description: "Drug information, dosage, side effects", href: "/medicines", icon: Pill },
  { title: "Diseases", description: "Symptoms, causes, treatment options", href: "/diseases", icon: Heart },
  { title: "Lab Tests", description: "Test preparation and interpretation", href: "/lab-tests", icon: FlaskConical },
  { title: "Symptoms", description: "Causes, remedies, when to see a doctor", href: "/symptoms", icon: Activity },
  { title: "Calculators", description: "BMI, BMR, pregnancy and more", href: "/calculators", icon: Calculator },
  { title: "First Aid", description: "Emergency step-by-step guides", href: "/first-aid", icon: Siren },
  { title: "Articles", description: "Health articles and educational resources", href: "/articles", icon: BookOpen },
];

export default function HomePage() {
  const medicines = getPopularMedicines(8);
  const diseases = getPopularDiseases(8);
  const tests = getPopularLabTests(6);
  const articles = getTrendingArticles(6);
  const calculators = getPopularCalculators(6);
  const firstAid = getPopularFirstAid(4);

  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <HeroSection />

      <div className="container-custom">
        <TopBannerAd />

        {/* Categories */}
        <section className="section-padding pt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.href} {...cat} />
            ))}
          </div>
        </section>

        {/* Popular Medicines */}
        <section className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Medicines</h2>
            <Link href="/medicines" prefetch={false} className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {medicines.map((m) => (
              <MedicalCard key={m.slug} title={m.name} description={m.description} href={`/medicine/${m.slug}`} category={m.category} />
            ))}
          </div>
        </section>

        {/* Popular Diseases */}
        <section className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Diseases</h2>
            <Link href="/diseases" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {diseases.map((d) => (
              <MedicalCard key={d.slug} title={d.name} description={d.description} href={`/disease/${d.slug}`} category={d.category} />
            ))}
          </div>
        </section>

        {/* Lab Tests + Calculators */}
        <section className="section-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Popular Lab Tests</h2>
                <Link href="/lab-tests" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="grid gap-3">
                {tests.map((t) => (
                  <MedicalCard key={t.slug} title={t.name} description={t.description} href={`/lab-test/${t.slug}`} category={t.category} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Medical Calculators</h2>
                <Link href="/calculators" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {calculators.map((c) => (
                  <Link key={c.slug} href={`/calculator/${c.slug}`} className="flex items-center gap-3 rounded-xl border p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                    <Calculator className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Emergency + First Aid */}
        <section className="section-padding">
          <EmergencyBanner />
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Emergency First Aid Guides</h2>
              <Link href="/first-aid" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {firstAid.map((f) => (
                <MedicalCard key={f.slug} title={f.name} description={f.description} href={`/first-aid/${f.slug}`} badge={f.severity} />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Articles */}
        <section className="section-padding">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Trending Health Articles</h2>
            <Link href="/articles" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.slug} title={a.name} description={a.description} href={`/article/${a.slug}`} category={a.category} author={a.author} publishedAt={a.publishedAt} readTime={a.readTime} />
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        <section className="section-padding">
          <DeferredRecentlyViewed />
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <FAQAccordion faqs={HOME_FAQS} title="Frequently Asked Questions" />
        </section>

        {/* <NewsletterSection /> */}
      </div>
    </>
  );
}
