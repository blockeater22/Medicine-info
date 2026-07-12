import fs from "fs";
import path from "path";
import { DATA_DIRS } from "./constants.js";

const MIN_MED_DISEASE_LINKS = 3;
const MIN_DISEASE_MED_LINKS = 3;
const MIN_DISEASE_TEST_LINKS = 2;
const MIN_SYMPTOM_DISEASE_LINKS = 3;

/** Cross-link related slugs by keyword overlap after pipeline runs. */
export function linkRelatedRecords() {
  linkMedicinesToDiseases();
  linkDiseasesToMedicines();
  linkDiseasesToLabTests();
  linkSymptomsToDiseases();
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

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 3);
}

function scoreOverlap(a: string, b: string): number {
  const ta = new Set(tokenize(a));
  const tb = tokenize(b);
  return tb.filter((t) => ta.has(t)).length;
}

function mergeSlugs(existing: string[] | undefined, next: string[], limit: number): string[] {
  return [...new Set([...(existing ?? []), ...next])].slice(0, limit);
}

function linkMedicinesToDiseases() {
  const diseases = readDir(DATA_DIRS.diseases);
  const meds = readDir(DATA_DIRS.medicines);

  for (const med of meds) {
    const uses = ((med.uses as string[]) ?? []).join(" ");
    const blob = `${med.genericName ?? ""} ${uses}`;
    const related = diseases
      .map((d) => ({
        slug: d.slug,
        score: scoreOverlap(blob, `${d.name} ${(d.description as string) ?? ""}`),
      }))
      .filter((x) => x.score > 0 || uses.toLowerCase().includes(x.slug.replace(/-/g, " ")))
      .sort((a, b) => b.score - a.score)
      .slice(0, MIN_MED_DISEASE_LINKS)
      .map((x) => x.slug);

    if (related.length) {
      med.relatedDiseases = mergeSlugs(med.relatedDiseases as string[] | undefined, related, MIN_MED_DISEASE_LINKS);
      writeRecord(DATA_DIRS.medicines, med);
    }
  }
}

function linkDiseasesToMedicines() {
  const diseases = readDir(DATA_DIRS.diseases);
  const meds = readDir(DATA_DIRS.medicines);

  for (const disease of diseases) {
    const blob = `${disease.name} ${disease.description ?? ""} ${((disease.treatment as string[]) ?? []).join(" ")}`;
    const related = meds
      .map((m) => ({
        slug: m.slug,
        score: scoreOverlap(blob, `${m.name} ${m.genericName ?? ""} ${((m.uses as string[]) ?? []).join(" ")}`),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MIN_DISEASE_MED_LINKS)
      .map((x) => x.slug);

    if (related.length) {
      disease.relatedMedicines = mergeSlugs(disease.relatedMedicines as string[] | undefined, related, MIN_DISEASE_MED_LINKS);
      writeRecord(DATA_DIRS.diseases, disease);
    }
  }
}

function linkDiseasesToLabTests() {
  const diseases = readDir(DATA_DIRS.diseases);
  const tests = readDir(DATA_DIRS.tests);

  for (const disease of diseases) {
    const blob = `${disease.name} ${((disease.diagnosis as string[]) ?? []).join(" ")}`;
    const related = tests
      .map((t) => ({
        slug: t.slug,
        score: scoreOverlap(blob, `${t.name} ${t.description ?? ""}`),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MIN_DISEASE_TEST_LINKS)
      .map((x) => x.slug);

    if (related.length) {
      disease.relatedSlugs = mergeSlugs(disease.relatedSlugs as string[] | undefined, related, MIN_DISEASE_TEST_LINKS);
      writeRecord(DATA_DIRS.diseases, disease);
    }
  }
}

function linkSymptomsToDiseases() {
  const symptoms = readDir(DATA_DIRS.symptoms);
  const diseases = readDir(DATA_DIRS.diseases);

  for (const symptom of symptoms) {
    const blob = `${symptom.name} ${symptom.description ?? ""}`;
    const related = diseases
      .map((d) => ({
        slug: d.slug,
        score: scoreOverlap(blob, `${d.name} ${((d.symptoms as string[]) ?? []).join(" ")}`),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MIN_SYMPTOM_DISEASE_LINKS)
      .map((x) => x.slug);

    if (related.length) {
      symptom.relatedDiseases = mergeSlugs(symptom.relatedDiseases as string[] | undefined, related, MIN_SYMPTOM_DISEASE_LINKS);
      writeRecord(DATA_DIRS.symptoms, symptom);
    }
  }
}
