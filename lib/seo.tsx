import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getCanonicalUrl } from "@/lib/sitemap-urls";
import type { BreadcrumbItem, FAQItem, SEOData } from "@/types";

export function buildMetadata(seo: SEOData, path = "/"): Metadata {
  const url = seo.canonical || getCanonicalUrl(path);
  const ogImage =
    seo.ogImage ??
    (path && path !== "/" ? `${SITE.domain}/og${path}.svg` : `${SITE.domain}/og-default.svg`);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    authors: [{ name: SITE.name, url: SITE.domain }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: { canonical: url },
    robots: seo.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE.name,
      locale: "en_IN",
      type: "website",
      images: seo.ogImage
        ? [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }]
        : [{ url: ogImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [ogImage],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    logo: `${SITE.domain}/icon.svg`,
    description: SITE.description,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: Object.values(SITE.social).filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.domain}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE.domain}${item.href}`,
    })),
  };
}

export function faqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Educational medicine markup — NOT schema.org/Drug.
 * Drug subtypes Product; Google then requires offers/review/aggregateRating for Product snippets.
 * This site does not sell medicines, so Product/Drug markup triggers false GSC critical errors.
 */
export function medicineSchema(medicine: {
  name: string;
  slug: string;
  description: string;
  genericName: string;
  composition: string;
  uses: string[];
  sideEffects: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    name: medicine.name,
    alternateName: medicine.genericName,
    url: `${SITE.domain}/medicine/${medicine.slug}`,
    description: medicine.description,
    medicineSystem: "Western Conventional",
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "activeIngredient",
        value: medicine.composition,
      },
      {
        "@type": "PropertyValue",
        name: "indication",
        value: medicine.uses.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "adverseOutcome",
        value: medicine.sideEffects.join(", "),
      },
    ],
  };
}

export function medicalWebPageSchema(page: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.name,
    url: `${SITE.domain}${page.path}`,
    description: page.description,
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.domain },
  };
}

export function medicalTestSchema(test: {
  name: string;
  slug: string;
  description: string;
  purpose: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalTest",
    name: test.name,
    url: `${SITE.domain}/lab-test/${test.slug}`,
    description: test.description,
    usedToDiagnose: test.purpose.join(", "),
  };
}

export function articleSchema(article: {
  name: string;
  slug: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.name,
    description: article.description,
    author: { "@type": "Organization", name: SITE.name, url: SITE.domain },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: article.image || `${SITE.domain}/og-default.svg`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.domain}/icon.svg` },
    },
    mainEntityOfPage: `${SITE.domain}/article/${article.slug}`,
  };
}

export function medicalConditionSchema(disease: {
  name: string;
  slug: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: disease.name,
    url: `${SITE.domain}/disease/${disease.slug}`,
    description: disease.description,
    signOrSymptom: disease.symptoms.map((s) => ({ "@type": "MedicalSignOrSymptom", name: s })),
    cause: disease.causes.join(", "),
    possibleTreatment: disease.treatment.join(", "),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
