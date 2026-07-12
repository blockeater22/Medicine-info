import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "@/types";
import { breadcrumbSchema, JsonLd } from "@/lib/seo";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbSchema(allItems)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
              {i === allItems.length - 1 ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {i === 0 && <Home className="inline h-3.5 w-3.5 mr-1" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {i === 0 && <Home className="inline h-3.5 w-3.5 mr-1" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
