import path from "path";
import { DATA_DIRS, MEDICAL_DISCLAIMER } from "../shared/constants.js";
import { SymptomSchema, type SymptomRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import { buildFaqs, rephraseList, synthesizeOverview, titleCase } from "../shared/summarize.js";
import { extractSectionItems, fetchMedlinePlusTopicDirect, fetchWikipediaSummary, mergeSources } from "../shared/sources.js";
import { isoNow, slugify, splitIntoBullets } from "../shared/utils.js";

const SEED_PATH = path.join("scripts", "seeds", "symptoms.txt");

export async function runSymptomPipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const term of seeds.slice(0, options.limit)) {
    try {
      const record = await fetchSymptom(term);
      if (!record) {
        console.warn(`[symptoms] no data: ${term}`);
        continue;
      }
      results.push(saveRecord(DATA_DIRS.symptoms, record, SymptomSchema, options));
      console.log(`[symptoms] ${record.slug} ✓`);
    } catch (err) {
      console.error(`[symptoms] failed: ${term}`, err instanceof Error ? err.message : err);
    }
  }

  logResults("symptoms", results);
  return results;
}

async function fetchSymptom(term: string): Promise<SymptomRecord | null> {
  const medline = await fetchMedlinePlusTopicDirect(term);
  const wiki = await fetchWikipediaSummary(term);
  if (!medline && !wiki) return null;

  const name = titleCase(medline?.title || wiki?.title || term);
  const slug = slugify(name);
  const sections = medline?.sections ?? {};

  const causesRaw = extractSectionItems(sections, ["cause", "why", "reason"]);
  const careRaw = extractSectionItems(sections, ["self", "home", "care", "relief"]);
  const whenRaw = extractSectionItems(sections, ["when", "see", "doctor", "call"]);

  const overviewFacts = [
    ...(medline ? splitIntoBullets(medline.summary, 4) : []),
    ...(wiki ? splitIntoBullets(wiki.description || wiki.extract, 3) : []),
  ];

  return {
    slug,
    name,
    overview: synthesizeOverview(name, overviewFacts),
    possibleCauses: rephraseList(
      causesRaw.length ? causesRaw : splitIntoBullets(wiki?.extract || "", 5),
      "general",
      8
    ),
    redFlags: rephraseList(
      ["Sudden severe onset", "Associated chest pain or breathing difficulty", "High fever with confusion", "Symptoms after head injury"],
      "warning",
      5
    ),
    homeCare: rephraseList(
      careRaw.length ? careRaw : ["Rest and hydration", "Monitor symptom changes", "Use only previously recommended OTC options"],
      "general",
      5
    ),
    whenToSeeDoctor: rephraseList(
      whenRaw.length ? whenRaw : ["Symptoms persist beyond several days", "Severity increases", "New neurological or cardiac features appear"],
      "general",
      5
    ),
    faq: buildFaqs(name, "symptom"),
    relatedDiseases: [],
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated: isoNow(),
    sources: mergeSources(
      ...(medline ? [{ name: "MedlinePlus", url: medline.sourceUrl }] : []),
      ...(wiki ? [{ name: "Wikipedia", url: wiki.url }] : [])
    ),
  };
}
