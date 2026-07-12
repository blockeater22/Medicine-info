import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description: `Editorial standards and content review process for ${SITE.name}.`,
}, "/editorial-policy");

export default function EditorialPolicyPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Editorial Policy", href: "/editorial-policy" }]} />
      <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>
      <div className="prose-medical space-y-4">
        <p>{SITE.name} is committed to publishing accurate, helpful, and accessible medical information for Indian readers.</p>
        <h2 className="text-xl font-semibold text-foreground">Content Standards</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>All content is for educational purposes and reviewed against trusted public health references.</li>
          <li>We prioritize clarity, evidence-based framing, and patient safety language.</li>
          <li>We do not publish content intended to replace licensed medical consultation.</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground">Review Process</h2>
        <p>Content is created from structured medical data pipelines, validated with schemas, and periodically updated when source data changes.</p>
        <h2 className="text-xl font-semibold text-foreground">Corrections</h2>
        <p>If you identify an error, please see our <a href="/corrections" className="text-primary hover:underline">Corrections Policy</a> or contact {SITE.email}.</p>
      </div>
    </div>
  );
}
