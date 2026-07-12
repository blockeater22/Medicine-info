import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: `Terms of service for using ${SITE.name}.`,
}, "/terms");

export default function TermsPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Terms of Service", href: "/terms" }]} />
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose-medical space-y-4">
        <p>Last updated: July 1, 2026</p>
        <p>By accessing {SITE.domain}, you agree to these Terms of Service.</p>
        <h2 className="text-xl font-semibold text-foreground">Use of Service</h2>
        <p>You may use our website for personal, non-commercial informational purposes. You may not scrape, reproduce, or redistribute content without permission.</p>
        <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
        <p>All content, design, and branding on {SITE.name} are protected by copyright and other intellectual property laws.</p>
        <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
        <p>{SITE.name} shall not be liable for any damages arising from the use of information on this website. See our Medical Disclaimer for health-related limitations.</p>
        <h2 className="text-xl font-semibold text-foreground">Changes</h2>
        <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of updated terms.</p>
      </div>
    </div>
  );
}
