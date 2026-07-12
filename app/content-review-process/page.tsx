import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE, MEDICAL_DISCLAIMER } from "@/lib/constants";
import Link from "next/link";

export const metadata = buildMetadata(
  {
    title: "Content Review Process",
    description: `How ${SITE.name} researches, validates, and updates educational health content using public authoritative sources.`,
    keywords: ["content review", "editorial process", "health information standards"],
  },
  "/content-review-process"
);

export default function ContentReviewProcessPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Content Review Process", href: "/content-review-process" }]} />
      <h1 className="text-3xl font-bold mb-6">Content Review Process</h1>
      <div className="prose-medical space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">
          {SITE.name} is an educational medical knowledge platform. We do not provide telemedicine, prescriptions,
          hospital services, or clinical care. We do not claim endorsement by any licensed physician unless explicit
          written permission has been obtained and clearly disclosed.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">How we create content</h2>
          <p>
            Our healthcare content is built from structured research using publicly available, authoritative sources.
            Each page is written in plain language for patients and caregivers in India, with emphasis on accuracy,
            clarity, and practical context (including commonly used brand names where relevant for search clarity only).
          </p>
          <ol className="list-decimal pl-5 space-y-2 mt-3">
            <li>Topic selection based on common patient questions and search demand.</li>
            <li>Research from recognized government health agencies, established medical organizations, and peer-reviewed literature.</li>
            <li>Structured drafting with required sections (uses, safety, FAQs, sources) per content type.</li>
            <li>Automated quality checks for placeholders, broken links, and template duplication.</li>
            <li>Publication with source citations and last-updated date.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Sources we prioritize</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>World Health Organization (WHO) and National Institutes of Health (NIH) / MedlinePlus</li>
            <li>Indian Council of Medical Research (ICMR) and Ministry of Health &amp; Family Welfare (MoHFW) India</li>
            <li>Central Drugs Standard Control Organisation (CDSCO) safety communications</li>
            <li>Peer-reviewed clinical guidelines from recognized medical societies</li>
            <li>Established formularies and pharmacopoeias for drug information</li>
          </ul>
          <p className="mt-3">
            We do not fabricate references. Every YMYL page lists at least two verifiable sources with access dates
            where possible. We do not use anonymous forums, unverified social media, or promotional pharmaceutical
            material as primary sources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Updates and corrections</h2>
          <p>
            Medical knowledge changes. We schedule periodic content reviews and update pages when guidelines change,
            safety alerts are issued, or readers report material errors. Significant corrections follow our{" "}
            <Link href="/corrections" className="text-primary hover:underline">Corrections Policy</Link>.
            Report issues to{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">What we do not claim</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not state that named doctors review or endorse our content unless formally contracted and disclosed.</li>
            <li>We are not a hospital, clinic, or telemedicine provider.</li>
            <li>We do not sell medicines or accept payment for favourable coverage of any product or treatment.</li>
            <li>Calculator and first-aid tools are educational only — not diagnostic.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Educational use only</h2>
          <p>{MEDICAL_DISCLAIMER}</p>
          <p className="mt-3">
            Read our full{" "}
            <Link href="/medical-disclaimer" className="text-primary hover:underline">Medical Disclaimer</Link>{" "}
            and <Link href="/editorial-policy" className="text-primary hover:underline">Editorial Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
