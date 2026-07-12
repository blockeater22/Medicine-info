import fs from "fs";
import path from "path";
import {
  getAllArticles,
  getAllCalculators,
  getAllDiseases,
  getAllFirstAid,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
} from "../lib/data.js";

const OUT = path.join(process.cwd(), "public/og");

function svg(title: string, subtitle: string) {
  const safeTitle = title.replace(/[<>&'"]/g, "");
  const safeSub = subtitle.replace(/[<>&'"]/g, "").slice(0, 80);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b5ba8"/>
      <stop offset="100%" stop-color="#1e3a5f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="80" y="280" fill="#ffffff" font-family="system-ui,sans-serif" font-size="56" font-weight="700">${safeTitle}</text>
  <text x="80" y="360" fill="#dbeafe" font-family="system-ui,sans-serif" font-size="28">${safeSub}</text>
  <text x="80" y="540" fill="#93c5fd" font-family="system-ui,sans-serif" font-size="24">Doctors Hub · doctors-hub.in</text>
</svg>`;
}

function writeOg(relativePath: string, title: string, subtitle: string) {
  const filePath = path.join(OUT, `${relativePath}.svg`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, svg(title, subtitle));
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const m of getAllMedicines()) {
    writeOg(`/medicine/${m.slug}`, m.name, "Medicine guide for India");
  }
  for (const d of getAllDiseases()) {
    writeOg(`/disease/${d.slug}`, d.name, "Disease information");
  }
  for (const s of getAllSymptoms()) {
    writeOg(`/symptom/${s.slug}`, s.name, "Symptom guide");
  }
  for (const t of getAllLabTests()) {
    writeOg(`/lab-test/${t.slug}`, t.name, "Lab test guide");
  }
  for (const a of getAllArticles()) {
    writeOg(`/article/${a.slug}`, a.name, a.category);
  }
  for (const c of getAllCalculators()) {
    writeOg(`/calculator/${c.slug}`, c.name, "Health calculator");
  }
  for (const f of getAllFirstAid()) {
    writeOg(`/first-aid/${f.slug}`, f.name, "First aid guide");
  }

  console.log("Generated per-page OG SVG images in public/og/");
}

main();
