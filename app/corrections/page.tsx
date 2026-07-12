import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Corrections Policy",
  description: `How to report and request corrections to content on ${SITE.name}.`,
}, "/corrections");

export default function CorrectionsPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Corrections Policy", href: "/corrections" }]} />
      <h1 className="text-3xl font-bold mb-6">Corrections Policy</h1>
      <div className="prose-medical space-y-4">
        <p>Accuracy matters. We welcome reports of factual errors, outdated information, or unclear medical content.</p>
        <h2 className="text-xl font-semibold text-foreground">How to Report</h2>
        <p>Email {SITE.email} with the page URL, the incorrect information, and your suggested correction with a reference if available.</p>
        <h2 className="text-xl font-semibold text-foreground">What We Do</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Review reports within 5 business days</li>
          <li>Verify against trusted medical references</li>
          <li>Update content and refresh the last updated date</li>
          <li>Log significant corrections internally</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground">Limitations</h2>
        <p>We cannot provide personal medical advice via corrections requests. For individual health concerns, consult a qualified healthcare provider.</p>
      </div>
    </div>
  );
}
