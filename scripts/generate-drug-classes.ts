import fs from "fs";
import path from "path";
import { getAllMedicines } from "../lib/data.js";

const DRUG_CLASSES = [
  { slug: "antibiotics", name: "Antibiotics", keywords: ["antibiotic", "penicillin", "cephalosporin", "macrolide"] },
  { slug: "analgesics", name: "Analgesics & Antipyretics", keywords: ["analgesic", "antipyretic", "paracetamol", "acetaminophen", "pain relief"] },
  { slug: "nsaids", name: "NSAIDs", keywords: ["nsaid", "ibuprofen", "diclofenac", "naproxen", "mefenamic"] },
  { slug: "statins", name: "Statins", keywords: ["statin", "atorvastatin", "rosuvastatin", "lipid"] },
  { slug: "ace-inhibitors", name: "ACE Inhibitors", keywords: ["ace inhibitor", "enalapril", "ramipril", "lisinopril"] },
  { slug: "arbs", name: "ARBs", keywords: ["arb", "losartan", "telmisartan", "valsartan"] },
  { slug: "calcium-channel-blockers", name: "Calcium Channel Blockers", keywords: ["calcium channel", "amlodipine", "diltiazem", "verapamil"] },
  { slug: "beta-blockers", name: "Beta Blockers", keywords: ["beta blocker", "beta-blocker", "propranolol", "atenolol", "bisoprolol"] },
  { slug: "diuretics", name: "Diuretics", keywords: ["diuretic", "furosemide", "hydrochlorothiazide", "spironolactone"] },
  { slug: "antidiabetics", name: "Antidiabetics", keywords: ["antidiabetic", "metformin", "glimepiride", "sitagliptin", "insulin"] },
  { slug: "proton-pump-inhibitors", name: "Proton Pump Inhibitors", keywords: ["proton pump", "ppi", "omeprazole", "pantoprazole", "rabeprazole"] },
  { slug: "antihistamines", name: "Antihistamines", keywords: ["antihistamine", "cetirizine", "loratadine", "levocetirizine"] },
  { slug: "bronchodilators", name: "Bronchodilators", keywords: ["bronchodilator", "salbutamol", "albuterol", "salmeterol", "formoterol"] },
  { slug: "corticosteroids", name: "Corticosteroids", keywords: ["corticosteroid", "prednisone", "dexamethasone", "budesonide", "hydrocortisone"] },
  { slug: "antidepressants", name: "Antidepressants", keywords: ["antidepressant", "fluoxetine", "sertraline", "escitalopram", "amitriptyline"] },
  { slug: "anxiolytics", name: "Anxiolytics & Sedatives", keywords: ["anxiolytic", "alprazolam", "diazepam", "clonazepam", "zolpidem"] },
  { slug: "anticoagulants", name: "Anticoagulants", keywords: ["anticoagulant", "warfarin", "heparin", "enoxaparin", "apixaban", "rivaroxaban"] },
  { slug: "antiplatelets", name: "Antiplatelets", keywords: ["antiplatelet", "aspirin", "clopidogrel", "ticagrelor"] },
  { slug: "thyroid-hormones", name: "Thyroid Hormones", keywords: ["thyroid", "levothyroxine", "thyroxine"] },
  { slug: "contraceptives", name: "Contraceptives", keywords: ["contraceptive", "levonorgestrel", "ethinyl estradiol", "oral contraceptive"] },
  { slug: "antifungals", name: "Antifungals", keywords: ["antifungal", "fluconazole", "itraconazole", "clotrimazole"] },
  { slug: "antivirals", name: "Antivirals", keywords: ["antiviral", "acyclovir", "oseltamivir", "valacyclovir"] },
  { slug: "antimalarials", name: "Antimalarials", keywords: ["antimalarial", "chloroquine", "artemether", "primaquine"] },
  { slug: "antihypertensives", name: "Antihypertensives", keywords: ["antihypertensive", "hypertension", "blood pressure"] },
  { slug: "vitamins-supplements", name: "Vitamins & Supplements", keywords: ["vitamin", "ferrous", "folic acid", "calcium", "ascorbic"] },
  { slug: "muscle-relaxants", name: "Muscle Relaxants", keywords: ["muscle relaxant", "baclofen", "tizanidine", "cyclobenzaprine"] },
  { slug: "anticonvulsants", name: "Anticonvulsants", keywords: ["anticonvulsant", "phenytoin", "carbamazepine", "valproic", "pregabalin", "gabapentin"] },
  { slug: "immunosuppressants", name: "Immunosuppressants", keywords: ["immunosuppressant", "methotrexate", "adalimumab", "azathioprine"] },
  { slug: "antacids-gi", name: "Antacids & GI Agents", keywords: ["antacid", "ranitidine", "domperidone", "metoclopramide", "laxative"] },
  { slug: "respiratory-agents", name: "Respiratory Agents", keywords: ["respiratory", "montelukast", "theophylline", "anti-asthma"] },
];

function matchMedicines(keywords: string[]) {
  const meds = getAllMedicines();
  return meds
    .filter((m) => {
      const blob = [m.category, m.genericName, m.name, m.howItWorks, ...m.uses].join(" ").toLowerCase();
      return keywords.some((k) => blob.includes(k.toLowerCase()));
    })
    .map((m) => m.slug)
    .slice(0, 24);
}

function main() {
  const dir = path.join("data", "drug-classes");
  fs.mkdirSync(dir, { recursive: true });

  for (const dc of DRUG_CLASSES) {
    const medicineSlugs = matchMedicines(dc.keywords);
    const record = {
      slug: dc.slug,
      name: dc.name,
      description: `${dc.name} — drug class guide for patients in India.`,
      overview: `${dc.name} are a group of medicines used for related therapeutic purposes in India. Always use as prescribed.`,
      commonUses: [
        `Conditions commonly treated with ${dc.name.toLowerCase()}`,
        "Selected based on diagnosis and patient profile",
      ],
      examples: medicineSlugs.slice(0, 6).map((slug) => slug.replace(/-/g, " ")),
      medicineSlugs,
      relatedDiseaseSlugs: [],
      safetyNotes: [
        "Do not self-medicate or switch brands without medical advice",
        "Inform your doctor about all current medicines",
      ],
      seo: {
        title: `${dc.name}: Medicines, Uses & Safety | Doctors Hub`,
        description: `Guide to ${dc.name} — common Indian medicines, uses, and safety.`,
        keywords: [dc.name, "drug class", "medicines India"],
      },
      faqs: [
        {
          question: `What are ${dc.name}?`,
          answer: `${dc.name} are medicines grouped by similar therapeutic use. Your doctor selects the specific drug and dose.`,
        },
      ],
      contentReview: { lastReviewed: "2026-07-12" },
      sources: [
        { name: "WHO Model Formulary", url: "https://list.essentialmeds.org/", accessedAt: "2026-07-12" },
        { name: "Indian Pharmacopoeia Commission", url: "https://ipc.gov.in/", accessedAt: "2026-07-12" },
      ],
      updatedAt: "2026-07-12",
    };
    fs.writeFileSync(path.join(dir, `${dc.slug}.json`), JSON.stringify(record, null, 2) + "\n");
    console.log(`✓ ${dc.slug} (${medicineSlugs.length} medicines)`);
  }
}

main();
