/**
 * Production compliance: remove fake doctor/reviewer identities from all entity JSON.
 * Run: tsx scripts/compliance-strip-doctors.ts
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_DIRS = ["medicines", "diseases", "symptoms", "tests", "articles", "calculators", "first-aid", "drug-classes"];

function stripFile(filePath: string): boolean {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
  let changed = false;

  if (raw.authoredBy && typeof raw.authoredBy === "object") {
    const ab = raw.authoredBy as Record<string, unknown>;
    const lastReviewed =
      (typeof ab.lastReviewed === "string" && ab.lastReviewed) ||
      (typeof raw.updatedAt === "string" && raw.updatedAt.slice(0, 10)) ||
      (typeof raw.lastUpdated === "string" && raw.lastUpdated.slice(0, 10)) ||
      "2026-07-12";
    raw.contentReview = { lastReviewed };
    delete raw.authoredBy;
    changed = true;
  }

  if (typeof raw.author === "string") {
    const author = raw.author as string;
    if (/dr\.|medical team|physician|reviewer|mbbs|md\b/i.test(author)) {
      raw.author = "Doctors Hub Editorial";
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n");
  }
  return changed;
}

function main() {
  let count = 0;
  for (const dir of DATA_DIRS) {
    const full = path.join(ROOT, "data", dir);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full).filter((f) => f.endsWith(".json"))) {
      if (stripFile(path.join(full, file))) count++;
    }
  }
  console.log(`Stripped doctor identities from ${count} files`);
}

main();
