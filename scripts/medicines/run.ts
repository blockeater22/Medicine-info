import path from "path";
import { getJson } from "../shared/http.js";
import { DATA_DIRS, MEDICAL_DISCLAIMER, SOURCES } from "../shared/constants.js";
import { MedicineSchema, type MedicineRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import { buildFaqs, makeSource, rephraseFact, rephraseList, synthesizeHowItWorks } from "../shared/summarize.js";
import { isoNow, slugify, splitIntoBullets, uniqueStrings } from "../shared/utils.js";

interface OpenFdaLabel {
  openfda?: {
    generic_name?: string[];
    brand_name?: string[];
    substance_name?: string[];
    pharm_class_epc?: string[];
  };
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  adverse_reactions?: string[];
  warnings?: string[];
  warnings_and_cautions?: string[];
  drug_interactions?: string[];
  pregnancy?: string[];
  nursing_mothers?: string[];
  geriatric_use?: string[];
  pediatric_use?: string[];
  storage_and_handling?: string[];
  description?: string[];
  effective_time?: string;
}

interface OpenFdaResponse {
  results?: OpenFdaLabel[];
}

const SEED_PATH = path.join("scripts", "seeds", "medicines.txt");

export async function runMedicinePipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const genericName of seeds.slice(0, options.limit)) {
    try {
      const record = await fetchMedicine(genericName);
      if (!record) {
        console.warn(`[medicines] no data: ${genericName}`);
        continue;
      }
      results.push(saveRecord(DATA_DIRS.medicines, record, MedicineSchema, options));
      console.log(`[medicines] ${record.slug} ✓`);
    } catch (err) {
      console.error(`[medicines] failed: ${genericName}`, err instanceof Error ? err.message : err);
    }
  }

  logResults("medicines", results);
  return results;
}

async function fetchMedicine(genericName: string): Promise<MedicineRecord | null> {
  const search = encodeURIComponent(`openfda.generic_name:"${genericName}"`);
  const url = `https://api.fda.gov/drug/label.json?search=${search}&limit=1`;
  const data = await getJson<OpenFdaResponse>(url).catch(() => null);
  const label = data?.results?.[0];
  if (!label) return null;

  const generic = (label.openfda?.generic_name?.[0] || genericName).toLowerCase();
  const displayGeneric = generic.charAt(0).toUpperCase() + generic.slice(1);
  const slug = slugify(generic);
  const brandNames = uniqueStrings(label.openfda?.brand_name ?? [], 8);
  const drugClass = label.openfda?.pharm_class_epc?.[0] || "General therapeutic agent";
  const composition = label.openfda?.substance_name?.[0] || generic;

  const usesRaw = splitIntoBullets((label.indications_and_usage ?? []).join(" "), 8);
  const sideRaw = splitIntoBullets((label.adverse_reactions ?? []).join(" "), 10);
  const seriousRaw = sideRaw.filter((s) => /serious|severe|life-threatening|fatal|hospital/i.test(s));
  const warningsRaw = splitIntoBullets([...(label.warnings ?? []), ...(label.warnings_and_cautions ?? [])].join(" "), 8);
  const interactionsRaw = splitIntoBullets((label.drug_interactions ?? []).join(" "), 8);

  const dosageRaw = (label.dosage_and_administration ?? []).join(" ");
  const pregnancyRaw = (label.pregnancy ?? []).join(" ") || "Discuss risks and benefits with your obstetric care team before use.";
  const nursingRaw = (label.nursing_mothers ?? []).join(" ") || "Ask your clinician about safety during breastfeeding.";
  const geriatricRaw = (label.geriatric_use ?? []).join(" ") || "Older adults may need slower titration and closer monitoring.";
  const pediatricRaw = (label.pediatric_use ?? []).join(" ") || "Pediatric dosing should be weight-based and clinician-directed.";

  const lastUpdated = label.effective_time
    ? new Date(label.effective_time.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")).toISOString()
    : isoNow();

  return {
    slug,
    genericName: displayGeneric,
    brandNames,
    composition: `${composition} — active ingredient details may vary by marketed formulation.`,
    drugClass,
    uses: rephraseList(usesRaw.length ? usesRaw : [`management of conditions associated with ${generic}`], "use", 6),
    howItWorks: synthesizeHowItWorks(displayGeneric, drugClass),
    dosage: {
      adult: rephraseDosage(dosageRaw, "adult") || "Follow the prescribed adult schedule; do not change dose without medical advice.",
      child: rephraseDosage(pediatricRaw, "child") || "Use pediatric dosing only under qualified medical supervision.",
      elderly: rephraseDosage(geriatricRaw, "elderly") || "Elderly patients may require individualized dose adjustment.",
    },
    sideEffects: rephraseList(sideRaw.slice(0, 8), "effect", 8),
    seriousSideEffects: rephraseList(seriousRaw.length ? seriousRaw : warningsRaw.slice(0, 3), "warning", 5),
    warnings: {
      pregnancy: rephraseFactSafe(pregnancyRaw, "warning"),
      breastfeeding: rephraseFactSafe(nursingRaw, "warning"),
      kidney: "Kidney function can influence clearance; nephrology input may be required for advanced renal impairment.",
      liver: "Hepatic impairment may require dose changes and periodic liver function monitoring.",
      alcohol: "Alcohol may amplify sedation or liver stress; avoid unless your clinician approves.",
      driving: "Avoid driving if dizziness, drowsiness, or blurred vision occurs after dosing.",
    },
    interactions: {
      food: ["Take exactly as directed with respect to meals unless your prescriber advises otherwise."],
      drugs: rephraseList(interactionsRaw.length ? interactionsRaw : ["Review all prescription, OTC, and herbal products with your doctor."], "warning", 6),
    },
    storage: rephraseFactSafe((label.storage_and_handling ?? []).join(" ") || "Store at room temperature in a dry place away from children.", "general"),
    faqs: buildFaqs(displayGeneric, "medicine"),
    relatedMedicines: [],
    relatedDiseases: [],
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated,
    sources: [
      makeSource("OpenFDA Drug Labels", url),
      makeSource("RxNorm", `${SOURCES.rxNorm}REST/rxcui?name=${encodeURIComponent(generic)}`),
    ],
  };
}

function rephraseDosage(text: string, group: "adult" | "child" | "elderly"): string {
  if (!text || text.length < 20) {
    return group === "adult"
      ? "Adult dosing depends on indication, formulation, and kidney/liver function. Follow the prescription label and clinician guidance."
      : group === "child"
        ? "Pediatric dosing is weight-based and must be confirmed by a qualified prescriber."
        : "Older adults may need lower starting doses and closer follow-up for side effects.";
  }

  const snippet = text
    .replace(/directions?/gi, "")
    .replace(/do not take more than directed/gi, "")
    .split(/[.\n]/)
    .map((s) => s.trim())
    .find((s) => s.length > 15 && s.length < 120);

  const core = snippet || "individualized schedule based on indication";
  const prefix = group === "adult" ? "For adults," : group === "child" ? "For children," : "For older adults,";
  return `${prefix} clinicians typically recommend an ${core.toLowerCase()}. Always confirm exact dose with your prescriber.`;
}

function rephraseFactSafe(text: string, context: "warning" | "general"): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 20) return cleaned;
  if (cleaned.length > 120) return rephraseFact(cleaned.slice(0, 400), context === "warning" ? "warning" : "general");
  return rephraseFact(cleaned, context === "warning" ? "warning" : "general");
}
