import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About Us",
  description: `Learn about ${SITE.name} — India's trusted free medical information platform.`,
}, "/about");

export default function AboutPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "About", href: "/about" }]} />
      <h1 className="text-3xl font-bold mb-6">About {SITE.name}</h1>
      <div className="prose-medical space-y-4">
        <p>{SITE.name} is India&apos;s leading free medical information platform, dedicated to making reliable healthcare knowledge accessible to everyone.</p>
        <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
        <p>To empower every Indian with accurate, easy-to-understand medical information that helps them make informed health decisions.</p>
        <h2 className="text-xl font-semibold text-foreground">What We Offer</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Comprehensive medicine information with dosage, side effects, and interactions</li>
          <li>Disease guides covering symptoms, causes, diagnosis, and treatment</li>
          <li>Lab test preparation and result interpretation guides</li>
          <li>Free medical calculators for BMI, BMR, pregnancy, and more</li>
          <li>Emergency first aid step-by-step guides</li>
          <li>Expert-reviewed health articles</li>
        </ul>
        <h2 className="text-xl font-semibold text-foreground">Our Commitment</h2>
        <p>We follow Google&apos;s Helpful Content Guidelines and EEAT principles. All content is reviewed by our medical editorial team and updated regularly.</p>
      </div>
    </div>
  );
}
