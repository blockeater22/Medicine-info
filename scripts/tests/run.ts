import path from "path";
import { DATA_DIRS, MEDICAL_DISCLAIMER, SOURCES } from "../shared/constants.js";
import { LabTestSchema, type LabTestRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import { buildFaqs, rephraseList, synthesizeOverview, titleCase } from "../shared/summarize.js";
import { extractSectionItems, fetchMedlinePlusTopicDirect, fetchWikipediaSummary, mergeSources } from "../shared/sources.js";
import { isoNow, slugify, splitIntoBullets } from "../shared/utils.js";

const SEED_PATH = path.join("scripts", "seeds", "tests.txt");

export async function runLabTestPipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const term of seeds.slice(0, options.limit)) {
    try {
      const record = await fetchLabTest(term);
      if (!record) {
        console.warn(`[tests] no data: ${term}`);
        continue;
      }
      results.push(saveRecord(DATA_DIRS.tests, record, LabTestSchema, options));
      console.log(`[tests] ${record.slug} ✓`);
    } catch (err) {
      console.error(`[tests] failed: ${term}`, err instanceof Error ? err.message : err);
    }
  }

  logResults("tests", results);
  return results;
}

async function fetchLabTest(term: string): Promise<LabTestRecord | null> {
  const searchTerm = `${term} lab test`;
  const medline = await fetchMedlinePlusTopicDirect(searchTerm);
  const wiki = await fetchWikipediaSummary(term);
  if (!medline && !wiki) return null;

  const name = titleCase(medline?.title || wiki?.title || term);
  const slug = slugify(name);
  const sections = medline?.sections ?? {};

  const prepRaw = extractSectionItems(sections, ["prepare", "before", "fast"]);
  const procRaw = extractSectionItems(sections, ["procedure", "how", "process", "sample"]);
  const resultRaw = extractSectionItems(sections, ["result", "meaning", "normal", "high", "low"]);

  const overviewFacts = [
    ...(medline ? splitIntoBullets(medline.summary, 4) : []),
    ...(wiki ? splitIntoBullets(wiki.extract, 3) : []),
  ];

  return {
    slug,
    name,
    overview: synthesizeOverview(name, overviewFacts),
    purpose: rephraseList(
      splitIntoBullets(medline?.summary || wiki?.extract || "", 5).length
        ? splitIntoBullets(medline?.summary || wiki?.extract || "", 5)
        : ["Screening and diagnosis support", "Monitoring treatment response"],
      "general",
      5
    ),
    preparation: rephraseList(
      prepRaw.length ? prepRaw : ["Confirm fasting requirements with your lab", "Bring prior reports and medication list"],
      "general",
      5
    ),
    procedure: rephraseList(
      procRaw.length ? procRaw : ["Sample collection at a certified laboratory", "Results reviewed by qualified personnel"],
      "general",
      4
    ),
    normalRange: "Reference intervals vary by laboratory method, age, sex, and clinical context. Interpret results with your doctor.",
    highMeaning: rephraseList(
      resultRaw.filter((r) => /high|elevated|increase/i.test(r)).length
        ? resultRaw.filter((r) => /high|elevated|increase/i.test(r))
        : ["May indicate active disease, inflammation, or organ stress depending on the analyte"],
      "general",
      4
    ),
    lowMeaning: rephraseList(
      resultRaw.filter((r) => /low|decrease|deficiency/i.test(r)).length
        ? resultRaw.filter((r) => /low|decrease|deficiency/i.test(r))
        : ["May suggest deficiency, suppression, or reduced production depending on the analyte"],
      "general",
      4
    ),
    interpretation: rephraseList(
      ["Compare with previous results for trends", "Correlate with symptoms and examination", "Single abnormal values may require repeat testing"],
      "general",
      4
    ),
    faq: buildFaqs(name, "test"),
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated: isoNow(),
    sources: mergeSources(
      ...(medline ? [{ name: "MedlinePlus", url: medline.sourceUrl }] : []),
      ...(wiki ? [{ name: "Wikipedia", url: wiki.url }] : []),
      { name: "LOINC", url: SOURCES.loinc }
    ),
  };
}
