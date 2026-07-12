import type { SourceRecord } from "./schemas.js";
import { isoNow } from "./utils.js";

/**
 * Rewrites factual medical snippets into original concise wording.
 * Never passes source text through unchanged.
 */
export function rephraseFact(text: string, context: "use" | "effect" | "warning" | "general" = "general"): string {
  let fact = text.trim().replace(/\s+/g, " ");
  if (fact.length < 8) return fact;

  // Strip label boilerplate and long regulatory blocks
  fact = fact
    .replace(/^(INDICATIONS AND USAGE|DOSAGE AND ADMINISTRATION|ADVERSE REACTIONS|WARNINGS|PRECAUTIONS|DIRECTIONS|OTHER INFORMATION|STORAGE)[:\s-]*/i, "")
    .replace(/^(see|refer to|do not)\s+/i, "")
    .replace(/\b(NDC|Rx only|OTC|KEEP OUT OF REACH)\b.*$/i, "")
    .trim();

  // Keep only first meaningful clause to avoid copying long label blocks
  const clause = fact.split(/(?:\.\s+|;\s+|\n)/)[0]?.trim() ?? fact;
  fact = clause.length > 160 ? clause.slice(0, 157).replace(/[,;]\s*[^,;]*$/, "") + "..." : clause;

  const templates: Record<string, string[]> = {
    use: [
      "Clinicians may prescribe this medicine when managing {fact}.",
      "This agent is commonly used in care plans involving {fact}.",
      "Medical teams consider this option for patients needing support with {fact}.",
    ],
    effect: [
      "Some patients report {fact} while taking this medicine.",
      "A possible treatment-related effect includes {fact}.",
      "Monitoring is advised because {fact} may occur.",
    ],
    warning: [
      "Extra caution is needed because {fact}.",
      "Healthcare providers evaluate risk when {fact}.",
      "Patients should discuss safety when {fact}.",
    ],
    general: [
      "From a clinical perspective, {fact}.",
      "In routine practice, {fact}.",
      "Health professionals note that {fact}.",
    ],
  };

  const pool = templates[context];
  const template = pool[Math.abs(hashCode(fact)) % pool.length];
  const rewritten = template.replace("{fact}", lowercaseFirst(normalizeFact(fact)));

  return capitalizeFirst(rewritten.replace(/\s+/g, " ").trim());
}

export function rephraseList(items: string[], context: "use" | "effect" | "warning" | "general" = "general", max = 10): string[] {
  return items
    .slice(0, max * 2)
    .map((item) => rephraseFact(item, context))
    .filter((item, idx, arr) => arr.findIndex((x) => x.toLowerCase() === item.toLowerCase()) === idx)
    .slice(0, max);
}

export function synthesizeOverview(topic: string, facts: string[]): string {
  const keyPoints = facts.slice(0, 3).map((f) => normalizeFact(f));
  const intro = `${titleCase(topic)} is a health topic that clinicians and patients frequently discuss during care planning in India and worldwide.`;
  const body = keyPoints.length
    ? ` Key considerations include ${keyPoints.join("; ").toLowerCase()}.`
    : " Understanding core features, warning signs, and follow-up steps helps people make informed decisions with their doctor.";
  const close = " This summary is educational and should be paired with professional medical evaluation.";
  return (intro + body + close).replace(/\s+/g, " ").trim();
}

export function synthesizeHowItWorks(drugName: string, drugClass: string): string {
  return `${titleCase(drugName)} belongs to the ${drugClass.toLowerCase()} category. It influences relevant biological pathways linked to its approved therapeutic role. The exact mechanism can vary by formulation and individual patient factors, so prescribers tailor use after assessing diagnosis, comorbidities, and response over time.`;
}

export function buildFaqs(topic: string, type: "medicine" | "disease" | "symptom" | "test" | "general"): Array<{ question: string; answer: string }> {
  const common = {
    question: `Can I rely on this ${topic} information instead of a doctor visit?`,
    answer: "No. This content supports learning and preparation for conversations with qualified healthcare professionals. It is not a substitute for diagnosis or treatment.",
  };

  const specific: Record<string, Array<{ question: string; answer: string }>> = {
    medicine: [
      {
        question: `Can I adjust the dose of ${topic} on my own?`,
        answer: "Dose changes should only be made with clinician guidance. Self-adjustment can increase side effects or reduce effectiveness.",
      },
    ],
    disease: [
      {
        question: `What should I do if ${topic} symptoms worsen suddenly?`,
        answer: "Seek urgent medical care, especially if severe pain, breathing difficulty, confusion, or high fever develops.",
      },
    ],
    symptom: [
      {
        question: `When should I worry about ${topic.toLowerCase()}?`,
        answer: "Consult a doctor if symptoms persist, worsen, recur frequently, or are accompanied by red-flag features described above.",
      },
    ],
    test: [
      {
        question: `Do I need fasting before ${topic}?`,
        answer: "Preparation depends on the exact test order. Follow the instructions provided by your laboratory or physician.",
      },
    ],
    general: [],
  };

  return [common, ...(specific[type] ?? [])];
}

export function makeSource(name: string, url: string): SourceRecord {
  return { name, url, accessedAt: isoNow() };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return hash;
}

function normalizeFact(text: string): string {
  return text.replace(/\.$/, "").trim();
}

function lowercaseFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function titleCase(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export { titleCase };
