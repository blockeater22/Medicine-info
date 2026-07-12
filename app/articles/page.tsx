import { getAllArticles } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ArticleCard } from "@/components/shared/article-card";
import { TopBannerAd } from "@/components/ads/ad-placeholder";

export const metadata = buildMetadata({
  title: "Health Articles — Educational Medical Content",
  description: "Educational health articles covering nutrition, fitness, disease management, and wellness for India.",
  keywords: ["health articles", "medical articles", "wellness India"],
}, "/articles");

export default function ArticlesPage() {
  const articles = getAllArticles().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "Articles", href: "/articles" }]} />
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Health Articles</h1>
        <p className="text-muted-foreground text-lg">Evidence-based health information written for Indian readers.</p>
      </header>

      <TopBannerAd />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {articles.map((a) => (
          <ArticleCard key={a.slug} title={a.name} description={a.description} href={`/article/${a.slug}`} category={a.category} author={a.author} publishedAt={a.publishedAt} readTime={a.readTime} />
        ))}
      </div>
    </div>
  );
}
