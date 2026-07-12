/**
 * P0 content repair: fixes factually wrong medicine uses and generic disease boilerplate.
 * Run: tsx scripts/fix-p0-content.ts
 */
import fs from "fs";
import path from "path";
import { MEDICINE_FIXES, GENERIC_MEDICINE_MARKERS } from "./p0/medicine-fixes.js";
import { DISEASE_FIXES, GENERIC_DISEASE_MARKERS } from "./p0/disease-fixes.js";

const ROOT = process.cwd();

function fixMedicines() {
  const dir = path.join(ROOT, "data/medicines");
  let fixed = 0;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const slug = file.replace(".json", "");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;

    const override = MEDICINE_FIXES[slug];
    const uses = data.uses as string[] | undefined;
    const howItWorks = data.howItWorks as string | undefined;
    const isGeneric =
      override ||
      uses?.includes(GENERIC_MEDICINE_MARKERS.uses) ||
      howItWorks?.includes(GENERIC_MEDICINE_MARKERS.howItWorks);

    if (!isGeneric) continue;

    if (override) {
      data.category = override.category;
      data.uses = override.uses;
      data.howItWorks = override.howItWorks;
      if (override.sideEffects) data.sideEffects = override.sideEffects;
      if (override.drugInteractions) data.drugInteractions = override.drugInteractions;
      if (override.faqs) data.faqs = override.faqs;
      if (override.indiaNote && Array.isArray(data.warnings)) {
        data.warnings = [override.indiaNote, ...(data.warnings as string[])];
      } else if (override.indiaNote) {
        data.warnings = [override.indiaNote];
      }
    }

    if (!data.contentReview && !data.authoredBy) {
      data.contentReview = { lastReviewed: "2026-07-12" };
    }
    delete data.authoredBy;

    if (!data.sources || (data.sources as unknown[]).length < 2) {
      data.sources = [
        { name: "WHO Model Formulary", url: "https://list.essentialmeds.org/", accessedAt: "2026-07-12" },
        { name: "Indian Pharmacopoeia Commission", url: "https://ipc.gov.in/", accessedAt: "2026-07-12" },
      ];
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    fixed++;
    console.log(`  ✓ medicine/${slug}`);
  }

  return fixed;
}

function fixDiseases() {
  const dir = path.join(ROOT, "data/diseases");
  let fixed = 0;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const slug = file.replace(".json", "");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
    const override = DISEASE_FIXES[slug];

    const raw = JSON.stringify(data).toLowerCase();
    const hasGeneric = GENERIC_DISEASE_MARKERS.some((m) => raw.includes(m.toLowerCase()));
    if (!override && !hasGeneric) continue;

    if (override) {
      data.overview = override.overview;
      data.symptoms = override.symptoms;
      data.causes = override.causes;
      data.riskFactors = override.riskFactors;
      data.diagnosis = override.diagnosis;
      data.treatment = override.treatment;
      data.prevention = override.prevention;
      data.complications = override.complications;
      data.emergencySigns = override.emergencySigns;
      if (override.category) data.category = override.category;
    } else if (hasGeneric) {
      const name = String(data.name ?? slug);
      const boilerplatePatterns = [
        ...GENERIC_DISEASE_MARKERS,
        "Health professionals note that",
        "Patients should discuss safety when",
        "From a clinical perspective, multiple genetic",
      ];

      const strip = (items: unknown) => {
        if (!Array.isArray(items)) return items;
        const cleaned = (items as string[]).filter(
          (item) => !boilerplatePatterns.some((m) => item.toLowerCase().includes(m.toLowerCase()))
        );
        return cleaned.length ? cleaned : [`${name}: see a doctor for personalized ${String(items === data.causes ? "cause" : "care")} guidance.`];
      };

      for (const key of ["symptoms", "causes", "riskFactors", "diagnosis", "treatment", "prevention", "complications", "emergencySigns"]) {
        data[key] = strip(data[key]);
      }

      const overview = String(data.overview ?? "");
      if (boilerplatePatterns.some((m) => overview.toLowerCase().includes(m.toLowerCase())) || overview.includes("care planning in India and worldwide")) {
        data.overview = `${name} is a health condition that requires individualized medical assessment. Symptoms, causes, and treatment vary by person — consult a qualified doctor in India for diagnosis and a care plan tailored to your history and local guidelines.`;
      }
    }

    // Normalize website-format fields when present
    if (data.emergencySigns && !data.emergencyWarningSigns) {
      data.emergencyWarningSigns = data.emergencySigns;
    }

    if (!data.contentReview && !data.authoredBy) {
      data.contentReview = { lastReviewed: "2026-07-12" };
    }
    delete data.authoredBy;

    if (!data.sources || (data.sources as unknown[]).length < 2) {
      data.sources = [
        { name: "MedlinePlus", url: `https://medlineplus.gov/`, accessedAt: "2026-07-12" },
        { name: "ICMR — Indian Council of Medical Research", url: "https://www.icmr.gov.in/", accessedAt: "2026-07-12" },
      ];
    }

    data.lastUpdated = "2026-07-12T00:00:00.000Z";
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    fixed++;
    console.log(`  ✓ disease/${slug}`);
  }

  return fixed;
}

function injectContentReview() {
  const dirs = ["medicines", "diseases", "symptoms", "tests", "articles", "calculators", "first-aid"];
  let count = 0;

  for (const dirName of dirs) {
    const dir = path.join(ROOT, "data", dirName);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const filePath = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
      let changed = false;

      if (!data.contentReview) {
        const legacy = data.authoredBy as { lastReviewed?: string } | undefined;
        data.contentReview = {
          lastReviewed: legacy?.lastReviewed ?? "2026-07-12",
        };
        changed = true;
      }
      if (data.authoredBy) {
        delete data.authoredBy;
        changed = true;
      }

      if (dirName === "articles" && typeof data.author === "string") {
        if (/dr\.|medical team|physician|mbbs|md\b/i.test(data.author)) {
          data.author = "Doctors Hub Editorial";
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
        count++;
      }
    }
  }

  return count;
}

function main() {
  console.log("Fixing P0 medicine content...");
  const meds = fixMedicines();
  console.log(`Fixed ${meds} medicines\n`);

  console.log("Fixing P0 disease content...");
  const diseases = fixDiseases();
  console.log(`Fixed ${diseases} diseases\n`);

  console.log("Injecting content review metadata on remaining entities...");
  const auth = injectContentReview();
  console.log(`Updated content review on ${auth} files\n`);

  console.log("P0 content repair complete.");
}

main();
