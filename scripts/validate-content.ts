import fs from "fs";
import path from "path";
import {
  getAllMedicines,
  getAllDiseases,
  getAllSymptoms,
  getAllLabTests,
  getAllArticles,
  getAllCalculators,
  getAllFirstAid,
} from "../lib/data.js";

const errors: string[] = [];

function checkSlug(slug: string, file: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) errors.push(`${file}: invalid slug "${slug}"`);
}

function checkRequired(obj: Record<string, unknown>, fields: string[], file: string) {
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      errors.push(`${file}: missing required field "${field}"`);
    }
  }
}

function main() {
  const collections = [
    { name: "medicines", items: getAllMedicines(), fields: ["slug", "name", "description", "seo"] },
    { name: "diseases", items: getAllDiseases(), fields: ["slug", "name", "description", "seo"] },
    { name: "symptoms", items: getAllSymptoms(), fields: ["slug", "name", "description", "seo"] },
    { name: "tests", items: getAllLabTests(), fields: ["slug", "name", "description", "seo"] },
    { name: "articles", items: getAllArticles(), fields: ["slug", "name", "description", "seo"] },
    { name: "calculators", items: getAllCalculators(), fields: ["slug", "name", "description", "seo"] },
    { name: "first-aid", items: getAllFirstAid(), fields: ["slug", "name", "description", "seo"] },
  ];

  const slugsByType: Record<string, Set<string>> = {};

  for (const col of collections) {
    slugsByType[col.name] = new Set();
    for (const item of col.items) {
      const record = item as Record<string, unknown>;
      const file = `${col.name}/${record.slug}.json`;
      checkSlug(String(record.slug), file);
      checkRequired(record, col.fields, file);
      if (slugsByType[col.name].has(String(record.slug))) {
        errors.push(`${file}: duplicate slug`);
      }
      slugsByType[col.name].add(String(record.slug));
    }
    console.log(`✓ ${col.name}: ${col.items.length} records`);
  }

  // Check data dir exists
  for (const dir of ["medicines", "diseases", "symptoms", "tests", "articles", "calculators", "first-aid"]) {
    const p = path.join("data", dir);
    if (!fs.existsSync(p)) errors.push(`Missing data directory: ${p}`);
  }

  if (errors.length) {
    console.error("\nValidation failed:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log("\nAll content validation checks passed.");
}

main();
