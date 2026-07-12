import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description: `Editorial standards, medical review process, and content governance for ${SITE.name}.`,
}, "/editorial-policy");

export default function EditorialPolicyPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Editorial Policy", href: "/editorial-policy" }]} />
      <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>
      <div className="prose-medical space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg">
          {SITE.name} publishes free, evidence-informed medical information for patients, caregivers, and health-conscious readers in India.
          Because health content can directly affect decisions about medicines and care, we hold every page to strict editorial standards
          aligned with Google&apos;s Your Money Your Life (YMYL) and Experience, Expertise, Authoritativeness, and Trustworthiness (EEAT) guidelines.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Mission</h2>
          <p>
            Our mission is to make reliable, India-relevant health information accessible in plain English — covering medicines (including
            widely used Indian brands such as Crocin and Dolo), common diseases, lab tests, symptoms, calculators, and first-aid guidance.
            We do not sell medicines, provide prescriptions, or replace in-person medical consultation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Content creation</h2>
          <p>
            Content is built from structured medical data, authoritative reference sources, and clinical review. Each medicine and disease
            page is authored by a named physician and independently reviewed by a qualified medical reviewer before publication. Author and
            reviewer names, credentials, and profile links appear on every health content page. See our{" "}
            <Link href="/medical-team" className="text-primary hover:underline">Medical Team</Link> page for full profiles.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Medicine pages are reviewed for correct drug class, uses, dosage framing, and interaction warnings.</li>
            <li>Disease pages must contain condition-specific symptoms, causes, and treatment — not generic boilerplate.</li>
            <li>India-specific context (brand availability, local disease burden, ICMR/WHO guidance) is included where relevant.</li>
            <li>We cite at least two authoritative sources (WHO, ICMR, MedlinePlus, Indian Pharmacopoeia, peer-reviewed references) on YMYL pages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Medical review process</h2>
          <p>
            All new and updated YMYL content passes through a documented review workflow: (1) structured data validation, (2) clinical
            accuracy check against reference sources, (3) medical reviewer sign-off, (4) publication with author/reviewer attribution and
            last-reviewed date. Content is scheduled for re-review at least every 12 months, or sooner when clinical guidelines change,
            new safety alerts are issued, or a reader reports a material error.
          </p>
          <p className="mt-3">
            Calculators and first-aid guides are reviewed for formula accuracy, safety warnings, and appropriate disclaimers. Interactive
            tools are for educational use only and do not constitute diagnosis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Sources we use</h2>
          <p>We prioritise the following categories of sources, in order of preference for Indian readers:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>World Health Organization (WHO) and ICMR publications</li>
            <li>MedlinePlus and NIH resources for patient-friendly explanations</li>
            <li>Indian Pharmacopoeia Commission and CDSCO safety communications</li>
            <li>Peer-reviewed clinical guidelines from recognised medical societies</li>
            <li>Established medical textbooks and formularies for drug information</li>
          </ul>
          <p className="mt-3">
            We do not rely on anonymous forums, unverified social media claims, or promotional material from pharmaceutical companies as
            primary sources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Corrections and updates</h2>
          <p>
            Medical knowledge evolves. When we identify an error — through internal review, reader feedback, or updated guidelines — we
            correct it promptly and update the &quot;Last reviewed&quot; date on the affected page. Significant corrections are logged per our{" "}
            <Link href="/corrections" className="text-primary hover:underline">Corrections Policy</Link>.
            Report errors to <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Conflicts of interest</h2>
          <p>
            {SITE.name} is an independent health information platform. Our medical authors and reviewers are not compensated by
            pharmaceutical manufacturers to favour specific products. Brand names (e.g., Crocin, Dolo) are mentioned for patient search
            clarity only. We do not accept payment for favourable coverage of any medicine, hospital, or treatment. Advertising, where
            present, is clearly separated from editorial content and does not influence medical review decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Advertising and independence</h2>
          <p>
            Display advertising may appear on some pages to support free access to content. Ad placement never affects which medicines or
            diseases we cover, how they are reviewed, or the order of information on a page. Sponsored content, if ever introduced, will
            be clearly labelled and excluded from the medical review workflow described above.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Limitations</h2>
          <p>
            Information on {SITE.name} is for general education. It is not personalised medical advice. Always consult a registered medical
            practitioner before starting, stopping, or changing any treatment. In an emergency, call <strong>112</strong> or go to the nearest hospital.
          </p>
        </section>
      </div>
    </div>
  );
}
