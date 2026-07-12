import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "About Us",
  description: `${SITE.name} — free educational medical information for India. Not a hospital, clinic, or telemedicine service.`,
}, "/about");

export default function AboutPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "About", href: "/about" }]} />
      <h1 className="text-3xl font-bold mb-6">About {SITE.name}</h1>
      <div className="prose-medical space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">
          {SITE.name} is a free educational medical knowledge platform for India. We help people find clear, structured
          information about medicines, diseases, symptoms, lab tests, calculators, and first aid — without replacing
          professional medical care.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">What we are</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>An educational health information website</li>
            <li>A searchable library of patient-friendly medical content</li>
            <li>A platform built for organic discovery and topical authority</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">What we are not</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Not a hospital, clinic, or telemedicine provider</li>
            <li>Not affiliated with any named physician unless explicitly disclosed with permission</li>
            <li>Not a pharmacy — we do not sell or prescribe medicines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our educational resources</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Medicine guides — uses, dosage context, side effects, interactions</li>
            <li>Disease and symptom information</li>
            <li>Lab test preparation and result interpretation guides</li>
            <li>Free medical calculators (educational estimates only)</li>
            <li>First-aid step-by-step guides</li>
            <li>Health articles on wellness and disease management</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Trust and transparency</h2>
          <p>
            We follow documented editorial standards and cite authoritative public sources. Learn about our{" "}
            <Link href="/editorial-policy" className="text-primary hover:underline">editorial policy</Link>,{" "}
            <Link href="/content-review-process" className="text-primary hover:underline">research methodology</Link>, and{" "}
            <Link href="/medical-disclaimer" className="text-primary hover:underline">medical disclaimer</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
