import { getJson } from "./http.js";
import fs from "fs";
import path from "path";

/**
 * Expand medicines seed file from RxNorm IN (Ingredient) concepts.
 * Usage: tsx scripts/shared/expand-seeds.ts medicines 500
 */
const SEED_DIR = path.join("scripts", "seeds");

interface RxNormConcept {
  rxnormId: string;
  name: string;
  tty: string;
}

interface RxNormResponse {
  minConceptGroup?: {
    minConcept?: RxNormConcept[];
  };
}

async function fetchRxNormIngredients(limit: number): Promise<string[]> {
  const url = "https://rxnav.nlm.nih.gov/REST/allconcepts.json";
  const data = await getJson<RxNormResponse>(url, { tty: "IN", format: "json" });
  const names = (data.minConceptGroup?.minConcept ?? [])
    .map((c) => c.name.trim())
    .filter(Boolean);
  return [...new Set(names)].slice(0, limit);
}

async function main() {
  const type = process.argv[2] || "medicines";
  const limit = parseInt(process.argv[3] || "200", 10);

  if (type !== "medicines") {
    console.error("Only medicines expansion supported currently");
    process.exit(1);
  }

  const names = await fetchRxNormIngredients(limit);
  const file = path.join(SEED_DIR, "medicines.txt");
  const existing = fs.existsSync(file)
    ? fs.readFileSync(file, "utf-8").split("\n").filter((l) => l.trim() && !l.startsWith("#"))
    : [];

  const merged = [...new Set([...existing, ...names.map((n) => n.toLowerCase())])];
  fs.writeFileSync(file, "# Auto-expanded from RxNorm IN concepts\n" + merged.join("\n") + "\n");
  console.log(`Expanded ${file} → ${merged.length} entries`);
}

main().catch(console.error);
