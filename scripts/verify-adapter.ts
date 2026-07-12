/**
 * Verify pipeline JSON adapts correctly to website types.
 * Usage: npm run pipeline:verify
 */
import { getAllMedicines, getAllDiseases, getAllCalculators, getAllFirstAid } from "../lib/data.js";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

function main() {
  const medicines = getAllMedicines();
  const diseases = getAllDiseases();
  const calculators = getAllCalculators();
  const firstAid = getAllFirstAid();

  console.log(`Loaded: ${medicines.length} medicines, ${diseases.length} diseases, ${calculators.length} calculators, ${firstAid.length} first-aid`);

  for (const m of medicines) {
    assert(Boolean(m.slug), "medicine missing slug");
    assert(Boolean(m.name), `medicine ${m.slug} missing name`);
    assert(Boolean(m.seo?.title), `medicine ${m.slug} missing seo`);
    assert(Boolean(m.dosage.adults), `medicine ${m.slug} missing adult dosage`);
    assert(Boolean(m.updatedAt), `medicine ${m.slug} missing updatedAt`);
  }

  for (const d of diseases) {
    assert(Boolean(d.seo?.title), `disease ${d.slug} missing seo`);
    assert(Boolean(d.overview), `disease ${d.slug} missing overview`);
    assert(Array.isArray(d.emergencyWarningSigns), `disease ${d.slug} missing emergencyWarningSigns`);
  }

  for (const c of calculators) {
    assert(Boolean(c.seo?.title), `calculator ${c.slug} missing seo`);
    assert(c.inputs.length > 0, `calculator ${c.slug} missing inputs`);
  }

  for (const f of firstAid) {
    assert(Boolean(f.description), `first-aid ${f.slug} missing description`);
    assert(f.steps.length > 0, `first-aid ${f.slug} missing steps`);
  }

  // Spot-check pipeline-adapted record
  const acetaminophen = medicines.find((m) => m.slug === "acetaminophen");
  if (acetaminophen) {
    assert(acetaminophen.category === "General therapeutic agent" || Boolean(acetaminophen.category), "acetaminophen category");
    assert(acetaminophen.name === "Acetaminophen", "acetaminophen name casing");
    console.log("✓ acetaminophen pipeline record adapted");
  }

  const diabetes = diseases.find((d) => d.slug === "diabetes");
  if (diabetes) {
    assert(diabetes.emergencyWarningSigns.length > 0, "diabetes emergency signs");
    console.log("✓ diabetes pipeline record adapted");
  }

  console.log("\nAll adapter checks passed.");
}

main();
