import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/data";
import { buildMetadata, articleSchema, medicalWebPageSchema, faqSchema, JsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AuthorBlock } from "@/components/shared/author-block";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ShareButtons } from "@/components/shared/share-buttons";
import { TrackRecentlyViewed } from "@/components/shared/track-recently-viewed";
import { TopBannerAd, InlineAd } from "@/components/ads/ad-placeholder";
import { formatDate } from "@/utils/helpers";
import { Clock, User } from "lucide-react";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildMetadata(article.seo, `/article/${slug}`);
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith("- ")) return <li key={i} className="ml-5 list-disc">{line.slice(2)}</li>;
    if (/^\d+\./.test(line)) return <li key={i} className="ml-5 list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>;
    if (!line.trim()) return <br key={i} />;
    return <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{line}</p>;
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="container-custom py-8 max-w-3xl">
      <TrackRecentlyViewed slug={slug} name={article.name} href={`/article/${slug}`} type="article" />
      <JsonLd
        data={[
          articleSchema(article),
          medicalWebPageSchema({
            name: article.name,
            description: article.description,
            path: `/article/${slug}`,
            dateModified: article.updatedAt,
          }),
          ...(article.faqs?.length ? [faqSchema(article.faqs)] : []),
        ]}
      />
      <Breadcrumb items={[{ label: "Articles", href: "/articles" }, { label: article.name, href: `/article/${slug}` }]} />

      <header className="mb-8">
        <span className="text-sm font-medium text-primary">{article.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-4">{article.name}</h1>
        <AuthorBlock authoredBy={article.authoredBy} className="mb-4" />
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{article.author}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{article.readTime} min read</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <div className="mt-4"><ShareButtons url={`/article/${slug}`} title={article.name} /></div>
      </header>

      <TopBannerAd />

      <article className="prose-medical">{renderContent(article.content)}</article>

      <InlineAd />

      {article.faqs && <div className="mt-8"><FAQAccordion faqs={article.faqs} /></div>}
      <div className="mt-8"><MedicalDisclaimer /></div>
    </div>
  );
}
