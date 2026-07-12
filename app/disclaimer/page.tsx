import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { MEDICAL_DISCLAIMER, SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Medical Disclaimer",
  description: `Medical disclaimer for ${SITE.name} — educational information only, not medical advice.`,
}, "/disclaimer");

export default function DisclaimerPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Disclaimer", href: "/disclaimer" }]} />
      <h1 className="text-3xl font-bold mb-6">Medical Disclaimer</h1>
      <div className="prose-medical space-y-4">
        <p>{MEDICAL_DISCLAIMER}</p>
        <h2 className="text-xl font-semibold text-foreground">Not a Substitute for Professional Care</h2>
        <p>The content on {SITE.name} is created for general informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
        <h2 className="text-xl font-semibold text-foreground">Emergency Situations</h2>
        <p>If you think you may have a medical emergency, call your doctor or emergency services (112 in India) immediately. Do not rely on information from this website in emergency situations.</p>
        <h2 className="text-xl font-semibold text-foreground">Accuracy of Information</h2>
        <p>While we strive to keep information accurate and up-to-date, medical knowledge evolves. We make no warranties about the completeness, reliability, or accuracy of information.</p>
        <h2 className="text-xl font-semibold text-foreground">Calculator Results</h2>
        <p>All calculator results are estimates for educational purposes only and should not be used for clinical decision-making.</p>
      </div>
    </div>
  );
}
