import path from "path";
import { DATA_DIRS, MEDICAL_DISCLAIMER, SOURCES } from "../shared/constants.js";
import { CalculatorSchema, type CalculatorRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import { buildFaqs, makeSource, titleCase } from "../shared/summarize.js";
import { isoNow, slugify } from "../shared/utils.js";

const SEED_PATH = path.join("scripts", "seeds", "calculators.txt");

const CALCULATOR_DEFS: Record<string, Omit<CalculatorRecord, "slug" | "lastUpdated" | "sources" | "medicalDisclaimer">> = {
  bmi: {
    name: "BMI Calculator",
    description: "Estimate body mass index from height and weight to screen weight status categories.",
    category: "Body Metrics",
    formulaReference: "BMI = weight(kg) / height(m)^2 (WHO classification)",
    inputs: [
      { id: "weight", label: "Weight", type: "number", unit: "kg", required: true },
      { id: "height", label: "Height", type: "number", unit: "cm", required: true },
    ],
    interpretationNotes: ["BMI is a screening tool, not a diagnostic test.", "Athletes and elderly may need alternate assessments."],
    faq: buildFaqs("BMI", "general"),
  },
  bmr: {
    name: "BMR Calculator",
    description: "Estimate basal metabolic rate using the Mifflin-St Jeor equation.",
    category: "Body Metrics",
    formulaReference: "Mifflin-St Jeor BMR equation",
    inputs: [
      { id: "weight", label: "Weight", type: "number", unit: "kg", required: true },
      { id: "height", label: "Height", type: "number", unit: "cm", required: true },
      { id: "age", label: "Age", type: "number", unit: "years", required: true },
      { id: "gender", label: "Gender", type: "select", required: true },
    ],
    interpretationNotes: ["Multiply BMR by activity factor for daily calorie needs."],
    faq: buildFaqs("BMR", "general"),
  },
  "pregnancy-due-date": {
    name: "Pregnancy Due Date Calculator",
    description: "Estimate delivery date from last menstrual period using Naegele's rule.",
    category: "Pregnancy",
    formulaReference: "EDD = LMP + 280 days",
    inputs: [{ id: "lmp", label: "Last Menstrual Period", type: "date", required: true }],
    interpretationNotes: ["Ultrasound dating may adjust estimated due date."],
    faq: buildFaqs("pregnancy due date", "general"),
  },
};

export async function runCalculatorPipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const term of seeds.slice(0, options.limit)) {
    const record = buildCalculator(term);
    results.push(saveRecord(DATA_DIRS.calculators, record, CalculatorSchema, options));
    console.log(`[calculators] ${record.slug} ✓`);
  }

  logResults("calculators", results);
  return results;
}

function buildCalculator(term: string): CalculatorRecord {
  const slug = slugify(term);
  const def = CALCULATOR_DEFS[slug] || {
    name: `${titleCase(term.replace(/-/g, " "))} Calculator`,
    description: `Client-side ${term.replace(/-/g, " ")} calculator for educational monitoring.`,
    category: "General",
    formulaReference: "Clinically referenced standard formula",
    inputs: [{ id: "value", label: "Input", type: "number" as const, required: true }],
    interpretationNotes: ["Results are estimates; confirm with healthcare professionals."],
    faq: buildFaqs(term, "general"),
  };

  return {
    slug,
    ...def,
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated: isoNow(),
    sources: [
      makeSource("WHO BMI Classification", SOURCES.who),
      makeSource("CDC Clinical Calculators", SOURCES.cdc),
    ],
  };
}
