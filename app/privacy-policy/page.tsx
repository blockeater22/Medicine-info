import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name} — how we collect, use, and protect your data.`,
}, "/privacy-policy");

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose-medical space-y-4">
        <p>Last updated: July 1, 2026</p>
        <p>{SITE.name} (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates {SITE.domain}. This page informs you of our policies regarding the collection, use, and disclosure of personal information.</p>
        <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
        <p>We may collect information you provide directly (such as email for newsletter subscription) and automatically collected data (such as browser type, pages visited, and cookies for analytics).</p>
        <h2 className="text-xl font-semibold text-foreground">How We Use Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide and improve our services</li>
          <li>To send newsletters (with your consent)</li>
          <li>To analyze site usage and improve user experience</li>
          <li>To display relevant advertisements</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
        <p>We use cookies for analytics, advertising, and to remember your preferences such as dark mode and recently viewed items stored in local storage.</p>
        <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
        <p>We may use analytics and, after approval, advertising services such as Google AdSense that collect data according to their own privacy policies.</p>
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>For privacy-related questions, contact us at {SITE.email}.</p>
      </div>
    </div>
  );
}
