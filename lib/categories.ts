import {
  getAllDiseases,
  getAllDrugClasses,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
} from "@/lib/data";

function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "general";
}

function normalizeCategory(raw: string | undefined, fallback = "General"): string {
  if (!raw || raw === "undefined") return fallback;
  return raw.replace(/\s+\[.*?\]\s*$/i, "").trim() || fallback;
}

export type CategoryHub = {
  slug: string;
  name: string;
  count: number;
  latestUpdate?: string;
};

export function getMedicineCategories(): CategoryHub[] {
  const counts = new Map<string, { name: string; count: number; latest?: string }>();

  for (const med of getAllMedicines()) {
    const name = normalizeCategory(med.category, "General Medicine");
    const slug = slugifyCategory(name);
    const existing = counts.get(slug) ?? { name, count: 0, latest: undefined };
    existing.count += 1;
    if (med.updatedAt && (!existing.latest || med.updatedAt > existing.latest)) {
      existing.latest = med.updatedAt;
    }
    counts.set(slug, existing);
  }

  return [...counts.entries()]
    .map(([slug, data]) => ({
      slug,
      name: data.name,
      count: data.count,
      latestUpdate: data.latest,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getMedicinesByCategory(categorySlug: string) {
  return getAllMedicines().filter(
    (m) => slugifyCategory(normalizeCategory(m.category, "General Medicine")) === categorySlug
  );
}

export function getDiseaseSystems(): CategoryHub[] {
  const counts = new Map<string, { name: string; count: number; latest?: string }>();

  for (const disease of getAllDiseases()) {
    const name = normalizeCategory(disease.category, "General Health");
    const slug = slugifyCategory(name);
    const existing = counts.get(slug) ?? { name, count: 0, latest: undefined };
    existing.count += 1;
    if (disease.updatedAt && (!existing.latest || disease.updatedAt > existing.latest)) {
      existing.latest = disease.updatedAt;
    }
    counts.set(slug, existing);
  }

  return [...counts.entries()]
    .map(([slug, data]) => ({
      slug,
      name: data.name,
      count: data.count,
      latestUpdate: data.latest,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getDiseasesBySystem(systemSlug: string) {
  return getAllDiseases().filter(
    (d) => slugifyCategory(normalizeCategory(d.category, "General Health")) === systemSlug
  );
}

export function getDrugClassCategories(): CategoryHub[] {
  return getAllDrugClasses()
    .map((dc) => ({
      slug: dc.slug,
      name: dc.name,
      count: dc.medicineSlugs.length,
      latestUpdate: dc.updatedAt,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getHealthAzEntries(letter: string) {
  const l = letter.toLowerCase();
  const items: { name: string; href: string; type: string }[] = [];

  for (const m of getAllMedicines()) {
    if (m.name.toLowerCase().startsWith(l)) {
      items.push({ name: m.name, href: `/medicine/${m.slug}`, type: "Medicine" });
    }
  }
  for (const d of getAllDiseases()) {
    if (d.name.toLowerCase().startsWith(l)) {
      items.push({ name: d.name, href: `/disease/${d.slug}`, type: "Disease" });
    }
  }
  for (const t of getAllLabTests()) {
    if (t.name.toLowerCase().startsWith(l)) {
      items.push({ name: t.name, href: `/lab-test/${t.slug}`, type: "Lab Test" });
    }
  }
  for (const s of getAllSymptoms()) {
    if (s.name.toLowerCase().startsWith(l)) {
      items.push({ name: s.name, href: `/symptom/${s.slug}`, type: "Symptom" });
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export { slugifyCategory, normalizeCategory };
