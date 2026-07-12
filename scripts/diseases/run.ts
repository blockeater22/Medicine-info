import path from "path";
import { DATA_DIRS, MEDICAL_DISCLAIMER } from "../shared/constants.js";
import { DiseaseSchema, type DiseaseRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import {
  buildFaqs,
  rephraseList,
  synthesizeOverview,
  titleCase,
} from "../shared/summarize.js";
import { extractSectionItems, fetchMedlinePlusTopicDirect, fetchWikipediaSummary, mergeSources } from "../shared/sources.js";
import { isoNow, slugify, splitIntoBullets, uniqueStrings } from "../shared/utils.js";

const SEED_PATH = path.join("scripts", "seeds", "diseases.txt");

export async function runDiseasePipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const term of seeds.slice(0, options.limit)) {
    try {
      const record = await fetchDisease(term);
      if (!record) {
        console.warn(`[diseases] no data: ${term}`);
        continue;
      }
      results.push(saveRecord(DATA_DIRS.diseases, record, DiseaseSchema, options));
      console.log(`[diseases] ${record.slug} ✓`);
    } catch (err) {
      console.error(`[diseases] failed: ${term}`, err instanceof Error ? err.message : err);
    }
  }

  logResults("diseases", results);
  return results;
}

async function fetchDisease(term: string): Promise<DiseaseRecord | null> {
  const medline = await fetchMedlinePlusTopicDirect(term);
  const wiki = await fetchWikipediaSummary(term);

  if (!medline && !wiki) return null;

  const name = titleCase(medline?.title || wiki?.title || term);
  const slug = slugify(name);
  const rawFacts = [
    ...(medline ? splitIntoBullets(medline.summary, 6) : []),
    ...(wiki ? splitIntoBullets(wiki.extract, 4) : []),
  ];

  const sections = medline?.sections ?? {};
  const symptomsRaw = extractSectionItems(sections, ["symptom", "sign"]);
  const causesRaw = extractSectionItems(sections, ["cause", "risk"]);
  const treatmentRaw = extractSectionItems(sections, ["treatment", "therapy", "management"]);
  const diagnosisRaw = extractSectionItems(sections, ["diagnosis", "test", "screen"]);
  const preventionRaw = extractSectionItems(sections, ["prevention", "prevent", "stay"]);
  const complicationsRaw = extractSectionItems(sections, ["complication", "outcome"]);

  const symptoms = rephraseList(symptomsRaw.length ? symptomsRaw : splitIntoBullets(wiki?.extract || "", 5), "general", 8);
  const causes = rephraseList(causesRaw.length ? causesRaw : ["Multiple genetic, lifestyle, and environmental factors may contribute."], "general", 6);
  const treatment = rephraseList(treatmentRaw.length ? treatmentRaw : ["Treatment plans are individualized based on severity and patient profile."], "general", 6);

  return {
    slug,
    name,
    overview: synthesizeOverview(name, rawFacts),
    symptoms,
    causes,
    riskFactors: rephraseList(causesRaw.slice(0, 5), "general", 5),
    diagnosis: rephraseList(diagnosisRaw.length ? diagnosisRaw : ["Clinical evaluation", "Relevant laboratory or imaging tests as indicated"], "general", 6),
    treatment,
    prevention: rephraseList(preventionRaw.length ? preventionRaw : ["Regular checkups", "Healthy lifestyle habits", "Vaccination when applicable"], "general", 5),
    complications: rephraseList(complicationsRaw.length ? complicationsRaw : ["Progression if untreated", "Reduced quality of life without proper follow-up"], "warning", 5),
    emergencySigns: rephraseList(
      ["Sudden severe symptoms", "Difficulty breathing", "Chest pain", "Confusion or loss of consciousness"],
      "warning",
      4
    ),
    faq: buildFaqs(name, "disease"),
    relatedDiseases: [],
    relatedMedicines: [],
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated: isoNow(),
    sources: mergeSources(
      ...(medline ? [{ name: "MedlinePlus", url: medline.sourceUrl }] : []),
      ...(wiki ? [{ name: "Wikipedia", url: wiki.url }] : [])
    ),
  };
}
