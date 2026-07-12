import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/seo";
import type { BreadcrumbItem, FAQItem } from "@/types";

interface PageSchemasProps {
  breadcrumbs: BreadcrumbItem[];
  faqs?: FAQItem[];
  extra?: Record<string, unknown> | Record<string, unknown>[];
}

export function PageSchemas({ breadcrumbs, faqs, extra }: PageSchemasProps) {
  const schemas: Record<string, unknown>[] = [breadcrumbSchema(breadcrumbs)];
  if (faqs?.length) schemas.push(faqSchema(faqs));

  if (extra) {
    const extras = Array.isArray(extra) ? extra : [extra];
    schemas.push(...extras);
  }

  return <JsonLd data={schemas} />;
}
