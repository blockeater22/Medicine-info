/** Category hub intro paragraphs (unique per hub name). */
export function categoryIntro(kind: "medicine" | "disease", name: string, count: number): string {
  if (kind === "medicine") {
    return `${name} medicines are commonly prescribed across India for a range of conditions. This hub lists ${count} patient-friendly guides covering uses, dosage, side effects, interactions, and safety — including brand names where relevant for Indian patients.

Always take prescription medicines exactly as directed by a registered medical practitioner. Do not change dose or stop treatment without medical advice. If you are pregnant, breastfeeding, or have kidney or liver disease, discuss options with your doctor before starting any medicine in this category.

Use the links below to read individual medicine pages, then consult our editorial policy and content review process to understand how information is prepared.`;
  }

  return `${name} conditions affect many people in India. This section groups ${count} disease guides covering symptoms, causes, diagnosis, treatment options, and prevention — written for patients and caregivers, not as a substitute for clinical care.

Seek urgent care if you have severe or sudden symptoms. For chronic conditions, regular follow-up with a qualified doctor is essential. Guides here link to related medicines and lab tests where helpful.

Browse individual condition pages below, or return to the full diseases directory for search and filters.`;
}
