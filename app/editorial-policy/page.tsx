import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description: `Editorial standards, research methodology, and content governance for ${SITE.name}.`,
}, "/editorial-policy");

export default function EditorialPolicyPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Editorial Policy", href: "/editorial-policy" }]} />
      <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>
      <div className="prose-medical space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">
          {SITE.name} publishes free, evidence-informed medical information for patients, caregivers, and health-conscious
          readers in India. Because health content can affect decisions about medicines and care, we apply strict
          editorial standards aligned with helpful-content and trust (EEAT) principles for Your Money Your Life (YMYL) topics.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Mission</h2>
          <p>
            Our mission is to make reliable, India-relevant health information accessible in plain English — covering
            medicines (including widely searched Indian brand names for clarity), diseases, lab tests, symptoms,
            calculators, and first-aid guidance. We do not sell medicines, provide prescriptions, or replace in-person
            medical consultation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Our editorial process</h2>
          <p>
            Content is developed through our documented{" "}
            <Link href="/content-review-process" className="text-primary hover:underline">content review process</Link>.
            We use structured research from authoritative public sources — not fabricated credentials or implied physician
            endorsement. Each health page includes source citations and a last-updated date where applicable.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Medicine pages are checked for correct drug class framing, dosage context, and interaction warnings.</li>
            <li>Disease pages must contain condition-specific information — not generic duplicated boilerplate.</li>
            <li>India-relevant context (ICMR/WHO guidance, commonly used brands for search clarity) is included where appropriate.</li>
            <li>We cite at least two authoritative sources on YMYL pages (WHO, ICMR, MedlinePlus, CDSCO, peer-reviewed guidelines).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Evidence standards</h2>
          <p>Our reference sources are selected in this order of preference:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>World Health Organization (WHO) and ICMR publications</li>
            <li>MedlinePlus and NIH resources for patient-friendly explanations</li>
            <li>Indian Pharmacopoeia Commission and CDSCO safety communications</li>
            <li>Peer-reviewed clinical guidelines from recognized medical societies</li>
          </ul>
          <p className="mt-3">
            We do not rely on anonymous forums, unverified social media claims, or promotional pharmaceutical material as
            primary sources. We do not fabricate references.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Corrections and updates</h2>
          <p>
            When we identify an error — through internal review, reader feedback, or updated guidelines — we correct it
            promptly and update the page date. Significant corrections are logged per our{" "}
            <Link href="/corrections" className="text-primary hover:underline">Corrections Policy</Link>.
            Report errors to <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Independence</h2>
          <p>
            {SITE.name} is an independent educational platform. Brand names (e.g., Crocin, Dolo) are mentioned for patient
            search clarity only. We do not accept payment for favourable coverage of any medicine, hospital, or treatment.
            Advertising, where present, is separated from editorial content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Limitations</h2>
          <p>
            Information on {SITE.name} is for general education. It is not personalised medical advice. Always consult a
            registered medical practitioner before starting, stopping, or changing any treatment. In an emergency, call{" "}
            <strong>112</strong> or go to the nearest hospital. See our{" "}
            <Link href="/medical-disclaimer" className="text-primary hover:underline">Medical Disclaimer</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
