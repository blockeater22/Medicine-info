import Link from "next/link";
import { MedicalCard } from "@/components/shared/medical-card";

interface RelatedCardProps {
  title: string;
  items: { slug: string; name: string; description: string }[];
  basePath: string;
}

export function RelatedCardGrid({ title, items, basePath }: RelatedCardProps) {
  if (!items.length) return null;

  return (
    <section aria-labelledby={`related-${title.toLowerCase().replace(/\s/g, "-")}`}>
      <h2 id={`related-${title.toLowerCase().replace(/\s/g, "-")}`} className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MedicalCard
            key={item.slug}
            title={item.name}
            description={item.description}
            href={`${basePath}/${item.slug}`}
          />
        ))}
      </div>
    </section>
  );
}

export function RelatedLinks({ title, items, basePath }: RelatedCardProps) {
  if (!items.length) return null;

  return (
    <aside>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`${basePath}/${item.slug}`} className="text-sm text-primary hover:underline">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
