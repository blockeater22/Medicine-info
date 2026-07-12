import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { MEDICAL_DISCLAIMER, SITE } from "@/lib/constants";
import Link from "next/link";

export const metadata = buildMetadata(
  {
    title: "Medical Disclaimer",
    description: `${SITE.name} provides educational health information only — not medical advice, diagnosis, or treatment.`,
    keywords: ["medical disclaimer", "health information", "not medical advice"],
  },
  "/medical-disclaimer"
);

export default function MedicalDisclaimerPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Medical Disclaimer", href: "/medical-disclaimer" }]} />
      <h1 className="text-3xl font-bold mb-6">Medical Disclaimer</h1>
      <div className="prose-medical space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">{MEDICAL_DISCLAIMER}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Educational platform only</h2>
          <p>
            {SITE.name} publishes general health information for learning and awareness. We are not a hospital,
            clinic, telemedicine service, or pharmacy. Nothing on this website creates a doctor–patient relationship.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Not a substitute for professional care</h2>
          <p>
            Always seek the advice of a qualified registered medical practitioner with questions about a medical
            condition, medicines, lab results, or treatment options. Never disregard professional advice or delay
            seeking it because of something you read here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Emergency situations</h2>
          <p>
            If you think you may have a medical emergency, call emergency services immediately (<strong>112</strong> in
            India) or go to the nearest hospital. Do not rely on this website in emergencies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Accuracy and limitations</h2>
          <p>
            We strive for accuracy using authoritative public sources, but medical knowledge evolves and individual
            circumstances vary. We make no warranties about completeness, reliability, or suitability for any purpose.
            Content may become outdated between scheduled reviews.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Calculators and tools</h2>
          <p>
            All calculator results are estimates for educational purposes only. They are not validated for clinical
            decision-making and should not replace professional assessment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">No professional endorsement implied</h2>
          <p>
            Unless explicitly stated with verified permission, {SITE.name} does not claim that any licensed physician,
            hospital, or medical institution endorses, reviews, or is affiliated with this website.
          </p>
        </section>

        <p>
          See also:{" "}
          <Link href="/editorial-policy" className="text-primary hover:underline">Editorial Policy</Link>,{" "}
          <Link href="/content-review-process" className="text-primary hover:underline">Content Review Process</Link>,{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}
