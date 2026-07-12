import { MedicalCard } from "@/components/shared/medical-card";
import { Pagination } from "@/components/shared/pagination";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TopBannerAd } from "@/components/ads/ad-placeholder";
import { LISTING_PAGE_SIZE } from "@/lib/listings";
import { paginate } from "@/utils/helpers";

interface ListingPageProps {
  title: string;
  description: string;
  basePath: string;
  itemBasePath: string;
  breadcrumbLabel: string;
  items: { slug: string; name: string; description: string; category?: string }[];
  page?: number;
}

export function ListingPage({
  title, description, basePath, itemBasePath, breadcrumbLabel, items, page = 1,
}: ListingPageProps) {
  const paginated = paginate(items, page, LISTING_PAGE_SIZE);

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: breadcrumbLabel, href: basePath }]} />
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
        <p className="text-sm text-muted-foreground mt-2">{items.length} items</p>
      </header>

      <TopBannerAd />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {paginated.items.map((item) => (
          <MedicalCard
            key={item.slug}
            title={item.name}
            description={item.description}
            href={`${itemBasePath}/${item.slug}`}
            category={item.category}
          />
        ))}
      </div>

      <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} basePath={basePath} />
    </div>
  );
}
