import fs from "fs";
import path from "path";
import { DATA_DIRS } from "./constants.js";

/** Cross-link related slugs by keyword overlap after pipeline runs. */
export function linkRelatedRecords() {
  linkMedicinesToDiseases();
  console.log("[linker] related record linking complete");
}

function linkMedicinesToDiseases() {
  const medDir = DATA_DIRS.medicines;
  const disDir = DATA_DIRS.diseases;
  if (!fs.existsSync(medDir) || !fs.existsSync(disDir)) return;

  const diseases = fs
    .readdirSync(disDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(disDir, f), "utf-8")) as { slug: string; name: string });

  for (const file of fs.readdirSync(medDir)) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(medDir, file);
    const med = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
      slug: string;
      genericName: string;
      uses: string[];
      relatedDiseases: string[];
    };

    const related = diseases
      .filter((d) => med.uses.some((u) => u.toLowerCase().includes(d.slug.replace(/-/g, " ")) || u.toLowerCase().includes(d.name.toLowerCase().slice(0, 6))))
      .slice(0, 5)
      .map((d) => d.slug);

    if (related.length) {
      med.relatedDiseases = [...new Set([...(med.relatedDiseases || []), ...related])];
      fs.writeFileSync(filePath, JSON.stringify(med, null, 2));
    }
  }
}
