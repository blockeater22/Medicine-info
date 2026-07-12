import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { MedicalCard } from "@/components/shared/medical-card";

interface CategoryHubPageProps {
  title: string;
  description: string;
  intro: string;
  basePath: string;
  categoryLabel: string;
  categorySlug: string;
  items: { slug: string; name: string; description: string; category?: string }[];
  itemBasePath: string;
}

export function CategoryHubPage({
  title,
  description,
  intro,
  basePath,
  categoryLabel,
  categorySlug,
  items,
  itemBasePath,
}: CategoryHubPageProps) {
  return (
    <div className="container-custom py-8">
      <Breadcrumb
        items={[
          { label: categoryLabel, href: basePath },
          { label: title, href: `${basePath}/${categorySlug}` },
        ]}
      />
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{description}</p>
        <div className="prose-medical text-muted-foreground leading-relaxed space-y-3">
          {intro.split("\n\n").map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">{items.length} pages in this category</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MedicalCard
            key={item.slug}
            title={item.name}
            description={item.description}
            href={`${itemBasePath}/${item.slug}`}
            badge={item.category}
          />
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Browse all {categoryLabel.toLowerCase()}{" "}
        <Link href={basePath} className="text-primary hover:underline">
          here
        </Link>
        .
      </p>
    </div>
  );
}
