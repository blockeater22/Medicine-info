import fs from "fs";
import path from "path";
import { DATA_DIRS } from "./constants.js";

const MIN_MED_DISEASE_LINKS = 3;
const MIN_DISEASE_MED_LINKS = 3;
const MIN_DISEASE_TEST_LINKS = 2;
const MIN_SYMPTOM_DISEASE_LINKS = 3;
const MIN_TEST_DISEASE_LINKS = 3;

const STOPWORDS = new Set([
  "with", "from", "that", "this", "have", "been", "were", "when", "your", "may",
  "also", "more", "other", "some", "such", "than", "then", "into", "over", "after",
  "before", "during", "under", "between", "through", "about", "against", "common",
  "often", "used", "use", "uses", "patient", "patients", "treatment", "condition",
  "conditions", "associated", "involving", "management", "clinical", "healthcare",
  "medicine", "medicines", "agent", "drug", "drugs", "tablet", "tablets", "dose",
]);

const POPULAR_TEST_SLUGS = [
  "complete-blood-count",
  "liver-function-tests",
  "lipid-profile",
  "blood-sugar-fasting",
  "hba1c",
  "thyroid-function-tests",
  "urine-routine",
  "kidney-function-test",
  "ecg",
  "chest-xray",
];

const DIAGNOSIS_TEST_HINTS: Record<string, string[]> = {
  glucose: ["blood-sugar-fasting", "hba1c", "glucose-tolerance-test"],
  diabetes: ["blood-sugar-fasting", "hba1c", "glycated-hemoglobin"],
  blood: ["complete-blood-count", "cbc"],
  liver: ["liver-function-tests", "liver-function-test", "bilirubin"],
  kidney: ["kidney-function-test", "creatinine", "blood-urea-nitrogen"],
  thyroid: ["thyroid-function-tests", "thyroid-profile", "thyroid-stimulating-hormone"],
  cholesterol: ["lipid-profile"],
  lipid: ["lipid-profile"],
  cardiac: ["ecg", "electrocardiography", "troponin"],
  heart: ["ecg", "echocardiography", "troponin"],
  chest: ["chest-xray", "chest-radiograph"],
  lung: ["chest-xray", "pulmonary-function-testing"],
  urine: ["urine-routine"],
  vitamin: ["vitamin-d", "vitamin-b12", "folate"],
  iron: ["serum-iron", "ferritin"],
  anemia: ["complete-blood-count", "serum-iron", "ferritin"],
  hiv: ["diagnosis-of-hivaids"],
  covid: ["covid-rtpcr"],
  infection: ["blood-culture", "crp", "c-reactive-protein"],
  inflammation: ["esr", "crp", "c-reactive-protein"],
  arthritis: ["rheumatoid-factor", "esr"],
  cancer: ["pap-test", "mammography", "fecal-occult-blood"],
  pregnancy: ["semen-analysis"],
  clot: ["d-dimer", "prothrombin-time"],
};

/** High-traffic diseases used only when semantic match cannot fill minimums. */
const POPULAR_DISEASE_SLUGS = [
  "diabetes",
  "hypertension",
  "fever",
  "headache",
  "common-cold",
  "asthma",
  "anemia",
  "arthritis",
  "depression",
  "anxiety",
  "gerd",
  "migraine",
  "pneumonia",
  "uti",
  "obesity",
];

const USE_KEYWORD_HINTS: Record<string, string[]> = {
  diabetes: ["diabetes", "diabetic", "glucose", "insulin", "glycemic", "hba1c", "hyperglycemia"],
  hypertension: ["hypertension", "blood pressure", "antihypertensive", "bp control"],
  fever: ["fever", "antipyretic", "pyrexia", "temperature"],
  headache: ["headache", "migraine", "cephalgia"],
  pain: ["pain", "analgesic", "ache", "analgesia"],
  asthma: ["asthma", "bronchospasm", "wheezing", "inhaler", "copd", "bronchitis"],
  gout: ["gout", "uric", "hyperuricemia", "xanthine oxidase"],
  infection: ["infection", "bacterial", "antibiotic", "antimicrobial", "sepsis"],
  depression: ["depression", "depressive", "antidepressant", "ssri", "snri"],
  anxiety: ["anxiety", "anxiolytic", "panic"],
  epilepsy: ["seizure", "epilepsy", "anticonvulsant"],
  allergy: ["allergy", "allergic", "antihistamine", "rhinitis", "urticaria"],
  heart: ["cardiac", "heart", "coronary", "angina", "arrhythmia", "anticoagulant", "antiplatelet"],
  stroke: ["stroke", "thromboembolism", "anticoagulation"],
  clot: ["thrombosis", "embolism", "anticoagulant", "dvt", "pulmonary embolism"],
  thyroid: ["thyroid", "hypothyroid", "hyperthyroid", "levothyroxine"],
  kidney: ["renal", "kidney", "nephro"],
  liver: ["hepat", "liver", "cirrhosis"],
  eye: ["glaucoma", "ocular", "intraocular", "retina"],
  skin: ["dermat", "skin", "eczema", "psoriasis", "acne"],
  stomach: ["gastric", "gerd", "ulcer", "acid reflux", "ppi", "proton pump"],
  cholesterol: ["cholesterol", "statin", "lipid", "hyperlipidemia"],
  hiv: ["hiv", "antiretroviral", "aids"],
  tb: ["tuberculosis", "tb "],
  malaria: ["malaria", "antimalarial"],
  pcos: ["pcos", "polycystic ovary"],
  sleep: ["insomnia", "sleep"],
  prostate: ["prostate", "bph", "benign prostatic"],
  erectile: ["erectile", "impotence"],
};

const CATEGORY_HINTS: Record<string, string[]> = {
  antidiabetic: ["diabetes", "obesity"],
  analgesic: ["fever", "headache", "arthritis"],
  antipyretic: ["fever", "headache"],
  antibiotic: ["pneumonia", "uti", "sinusitis", "bronchitis"],
  antihypertensive: ["hypertension", "heart-disease", "stroke"],
  anticoagulant: ["deep-vein-thrombosis", "stroke", "pulmonary-embolism"],
  antidepressant: ["depression", "anxiety"],
  antihistamine: ["allergy", "common-cold", "sinusitis"],
  bronchodilator: ["asthma", "chronic-obstructive-pulmonary-disease"],
  statin: ["heart-disease", "hypertension", "diabetes"],
  ppi: ["gerd", "peptic-ulcer-disease", "gastritis"],
  antacid: ["gerd", "gastritis"],
  antiviral: ["influenza", "covid-19", "hepatitis"],
  antifungal: ["dermatophytosis", "dermatitis"],
  antiepileptic: ["epilepsy"],
  antipsychotic: ["depression", "anxiety"],
  diuretic: ["hypertension", "heart-disease", "kidney-disease"],
  immunosuppressant: ["rheumatoid-arthritis", "lupus"],
  hormone: ["hypothyroidism", "diabetes"],
  contraceptive: ["endometriosis"],
};

/** Cross-link related slugs by keyword overlap after pipeline runs. */
export function linkRelatedRecords() {
  const diseases = readDir(DATA_DIRS.diseases);
  const meds = readDir(DATA_DIRS.medicines);
  const tests = readDir(DATA_DIRS.tests);
  const symptoms = readDir(DATA_DIRS.symptoms);

  const validDiseaseSlugs = new Set(diseases.map((d) => d.slug));
  const validMedSlugs = new Set(meds.map((m) => m.slug));
  const validTestSlugs = new Set(tests.map((t) => t.slug));

  linkMedicinesToDiseases(meds, diseases, validDiseaseSlugs);
  linkDiseasesToMedicines(diseases, meds, validMedSlugs);
  backfillDiseaseMedicinesFromMeds(diseases, meds, validMedSlugs, validDiseaseSlugs);
  linkDiseasesToLabTests(diseases, tests, validTestSlugs);
  linkLabTestsToDiseases(tests, diseases, validDiseaseSlugs);
  linkSymptomsToDiseases(symptoms, diseases, validDiseaseSlugs);

  for (const med of meds) writeRecord(DATA_DIRS.medicines, med);
  for (const disease of diseases) writeRecord(DATA_DIRS.diseases, disease);
  for (const test of tests) writeRecord(DATA_DIRS.tests, test);
  for (const symptom of symptoms) writeRecord(DATA_DIRS.symptoms, symptom);

  console.log("[linker] related record linking complete");
}

type JsonRecord = Record<string, unknown> & { slug: string };

function readDir(dir: string): JsonRecord[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as JsonRecord);
}

function writeRecord(dir: string, record: JsonRecord) {
  fs.writeFileSync(path.join(dir, `${record.slug}.json`), JSON.stringify(record, null, 2));
}

function slugTokens(slug: string): string[] {
  return slug.split("-").filter((t) => t.length > 1);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function uniqueTokens(...parts: (string | undefined)[]): Set<string> {
  const out = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const t of tokenize(part)) out.add(t);
    for (const t of slugTokens(part.toLowerCase())) out.add(t);
  }
  return out;
}

function joinField(value: unknown): string {
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "string") return value;
  return "";
}

function medicineBlob(med: JsonRecord): string {
  return [
    med.name,
    med.genericName,
    med.slug,
    med.category,
    med.drugClass,
    joinField(med.uses),
    joinField(med.sideEffects),
    joinField(med.description),
    joinField(med.warnings),
    joinField((med.warnings as Record<string, string>)?.pregnancy),
  ]
    .filter(Boolean)
    .join(" ");
}

function diseaseBlob(disease: JsonRecord): string {
  return [
    disease.name,
    disease.slug,
    disease.overview,
    disease.description,
    joinField(disease.symptoms),
    joinField(disease.treatment),
    joinField(disease.diagnosis),
    joinField(disease.causes),
    disease.category,
  ]
    .filter(Boolean)
    .join(" ");
}

function testBlob(test: JsonRecord): string {
  return [test.name, test.slug, test.description, joinField(test.uses)].filter(Boolean).join(" ");
}

function symptomBlob(symptom: JsonRecord): string {
  return [symptom.name, symptom.slug, symptom.description].filter(Boolean).join(" ");
}

function scoreOverlap(sourceText: string, targetText: string, targetSlug: string): number {
  const sourceTokens = uniqueTokens(sourceText);
  let score = 0;
  for (const t of tokenize(targetText)) {
    if (sourceTokens.has(t)) score += 1;
  }
  for (const t of slugTokens(targetSlug)) {
    if (sourceText.toLowerCase().includes(t)) score += 2;
  }
  const slugPhrase = targetSlug.replace(/-/g, " ");
  if (sourceText.toLowerCase().includes(slugPhrase)) score += 4;
  return score;
}

function hintSlugs(blob: string, category?: string, drugClass?: string): string[] {
  const lower = blob.toLowerCase();
  const hints = new Set<string>();

  for (const [key, diseases] of Object.entries(USE_KEYWORD_HINTS)) {
    if (lower.includes(key)) diseases.forEach((d) => hints.add(d));
  }

  const catKey = (category ?? drugClass ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  for (const [pattern, diseases] of Object.entries(CATEGORY_HINTS)) {
    if (catKey.includes(pattern)) diseases.forEach((d) => hints.add(d));
  }

  return [...hints];
}

function ensureMinimumSlugs(
  scored: { slug: string; score: number }[],
  fallbackSlugs: string[],
  validSlugs: Set<string>,
  minimum: number,
  limit: number
): string[] {
  const picked: string[] = [];
  const seen = new Set<string>();

  const add = (slug: string) => {
    if (!validSlugs.has(slug) || seen.has(slug)) return;
    seen.add(slug);
    picked.push(slug);
  };

  for (const { slug, score } of scored.sort((a, b) => b.score - a.score)) {
    if (score <= 0) continue;
    add(slug);
    if (picked.length >= limit) return picked.slice(0, limit);
  }

  for (const slug of fallbackSlugs) {
    add(slug);
    if (picked.length >= limit) break;
  }

  for (const slug of POPULAR_DISEASE_SLUGS) {
    add(slug);
    if (picked.length >= limit) break;
  }

  while (picked.length < minimum) {
    for (const slug of validSlugs) {
      add(slug);
      if (picked.length >= minimum) break;
    }
    break;
  }

  return picked.slice(0, limit);
}

function linkMedicinesToDiseases(meds: JsonRecord[], diseases: JsonRecord[], validDiseaseSlugs: Set<string>) {
  for (const med of meds) {
    const blob = medicineBlob(med);
    const hints = hintSlugs(blob, med.category as string | undefined, med.drugClass as string | undefined);

    const scored = diseases.map((d) => ({
      slug: d.slug,
      score:
        scoreOverlap(blob, diseaseBlob(d), d.slug) +
        (hints.includes(d.slug) ? 6 : 0),
    }));

    const related = ensureMinimumSlugs(
      scored,
      hints,
      validDiseaseSlugs,
      MIN_MED_DISEASE_LINKS,
      MIN_MED_DISEASE_LINKS
    );

    med.relatedDiseases = related;
  }
}

function linkDiseasesToMedicines(
  diseases: JsonRecord[],
  meds: JsonRecord[],
  validMedSlugs: Set<string>
) {
  for (const disease of diseases) {
    const blob = diseaseBlob(disease);
    const treatment = joinField(disease.treatment).toLowerCase();

    const scored = meds.map((m) => {
      let score = scoreOverlap(blob, medicineBlob(m), m.slug);
      const generic = String(m.genericName ?? m.name ?? "").toLowerCase();
      const medName = String(m.name ?? "").toLowerCase();
      if (generic && treatment.includes(generic)) score += 8;
      if (medName && treatment.includes(medName)) score += 8;
      if (treatment.includes(m.slug.replace(/-/g, " "))) score += 6;
      return { slug: m.slug, score };
    });

    const hintMeds = meds
      .filter((m) => ((m.relatedDiseases as string[] | undefined) ?? []).includes(disease.slug))
      .map((m) => m.slug);

    const related = ensureMinimumSlugs(
      scored,
      hintMeds,
      validMedSlugs,
      MIN_DISEASE_MED_LINKS,
      MIN_DISEASE_MED_LINKS
    );

    disease.relatedMedicines = related;
  }
}

/** Reverse edges: if med links to disease, ensure disease lists med when under minimum. */
function backfillDiseaseMedicinesFromMeds(
  diseases: JsonRecord[],
  meds: JsonRecord[],
  validMedSlugs: Set<string>,
  validDiseaseSlugs: Set<string>
) {
  const diseaseMap = new Map(diseases.map((d) => [d.slug, d]));

  for (const med of meds) {
    for (const ds of (med.relatedDiseases as string[] | undefined) ?? []) {
      if (!validDiseaseSlugs.has(ds)) continue;
      const disease = diseaseMap.get(ds);
      if (!disease) continue;
      const existing = (disease.relatedMedicines as string[] | undefined) ?? [];
      if (!existing.includes(med.slug) && validMedSlugs.has(med.slug)) {
        disease.relatedMedicines = [med.slug, ...existing].slice(0, MIN_DISEASE_MED_LINKS);
      }
    }
  }

  for (const disease of diseases) {
    const current = (disease.relatedMedicines as string[] | undefined) ?? [];
    if (current.length >= MIN_DISEASE_MED_LINKS) continue;

    const blob = diseaseBlob(disease);
    const scored = meds.map((m) => ({
      slug: m.slug,
      score: scoreOverlap(blob, medicineBlob(m), m.slug),
    }));

    disease.relatedMedicines = ensureMinimumSlugs(
      scored,
      current,
      validMedSlugs,
      MIN_DISEASE_MED_LINKS,
      MIN_DISEASE_MED_LINKS
    );
  }
}

function diagnosisTestHints(blob: string): string[] {
  const lower = blob.toLowerCase();
  const hints = new Set<string>();
  for (const [key, tests] of Object.entries(DIAGNOSIS_TEST_HINTS)) {
    if (lower.includes(key)) tests.forEach((t) => hints.add(t));
  }
  return [...hints];
}

function linkDiseasesToLabTests(diseases: JsonRecord[], tests: JsonRecord[], validTestSlugs: Set<string>) {
  for (const disease of diseases) {
    const blob = diseaseBlob(disease);
    const diagnosis = joinField(disease.diagnosis).toLowerCase();
    const hints = diagnosisTestHints(`${blob} ${diagnosis}`);

    const scored = tests.map((t) => {
      let score = scoreOverlap(blob, testBlob(t), t.slug);
      const testName = String(t.name ?? "").toLowerCase();
      if (testName && diagnosis.includes(testName)) score += 6;
      if (hints.includes(t.slug)) score += 8;
      return { slug: t.slug, score };
    });

    const related = ensureMinimumSlugs(
      scored,
      hints.length ? hints : POPULAR_TEST_SLUGS,
      validTestSlugs,
      MIN_DISEASE_TEST_LINKS,
      MIN_DISEASE_TEST_LINKS
    );

    disease.relatedSlugs = related;
  }
}

function linkLabTestsToDiseases(tests: JsonRecord[], diseases: JsonRecord[], validDiseaseSlugs: Set<string>) {
  const reverse = new Map<string, string[]>();
  for (const disease of diseases) {
    for (const ts of (disease.relatedSlugs as string[] | undefined) ?? []) {
      if (!reverse.has(ts)) reverse.set(ts, []);
      reverse.get(ts)!.push(disease.slug);
    }
  }

  for (const test of tests) {
    const blob = testBlob(test);
    const hints = reverse.get(test.slug) ?? [];

    const scored = diseases.map((d) => ({
      slug: d.slug,
      score: scoreOverlap(blob, diseaseBlob(d), d.slug) + (hints.includes(d.slug) ? 10 : 0),
    }));

    test.relatedDiseases = ensureMinimumSlugs(
      scored,
      hints,
      validDiseaseSlugs,
      MIN_TEST_DISEASE_LINKS,
      MIN_TEST_DISEASE_LINKS
    );
  }
}

function linkSymptomsToDiseases(symptoms: JsonRecord[], diseases: JsonRecord[], validDiseaseSlugs: Set<string>) {
  for (const symptom of symptoms) {
    const blob = symptomBlob(symptom);
    const symptomName = String(symptom.name ?? "").toLowerCase();

    const scored = diseases.map((d) => {
      let score = scoreOverlap(blob, diseaseBlob(d), d.slug);
      const dSymptoms = joinField(d.symptoms).toLowerCase();
      if (symptomName && dSymptoms.includes(symptomName)) score += 8;
      return { slug: d.slug, score };
    });

    const related = ensureMinimumSlugs(
      scored,
      [],
      validDiseaseSlugs,
      MIN_SYMPTOM_DISEASE_LINKS,
      MIN_SYMPTOM_DISEASE_LINKS
    );

    symptom.relatedDiseases = related;
  }
}
