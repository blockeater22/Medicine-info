import {
  getAllArticles,
  getAllCalculators,
  getAllDiseases,
  getAllDrugClasses,
  getAllFirstAid,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
  getDisease,
  getDiseasesForLabTest,
  getLabTest,
  getMedicine,
} from "@/lib/data";
import type { ContentType } from "@/types";

export type RelatedEntity = {
  slug: string;
  name: string;
  href: string;
  type: ContentType;
  description?: string;
};

export function getRelatedEntities(input: {
  type: ContentType;
  slug: string;
  limit?: number;
}): RelatedEntity[] {
  const limit = input.limit ?? 6;
  const out: RelatedEntity[] = [];

  if (input.type === "medicine") {
    const med = getMedicine(input.slug);
    if (!med) return [];
    for (const ds of med.relatedDiseases ?? []) {
      const d = getDisease(ds);
      if (d) out.push({ slug: d.slug, name: d.name, href: `/disease/${d.slug}`, type: "disease", description: d.description });
    }
    for (const ms of med.alternatives ?? []) {
      const m = getMedicine(ms);
      if (m) out.push({ slug: m.slug, name: m.name, href: `/medicine/${m.slug}`, type: "medicine", description: m.description });
    }
  }

  if (input.type === "disease") {
    const disease = getDisease(input.slug);
    if (!disease) return [];
    for (const ms of disease.relatedMedicines ?? []) {
      const m = getMedicine(ms);
      if (m) out.push({ slug: m.slug, name: m.name, href: `/medicine/${m.slug}`, type: "medicine", description: m.description });
    }
    for (const ts of disease.relatedSlugs ?? []) {
      const t = getLabTest(ts);
      if (t) out.push({ slug: t.slug, name: t.name, href: `/lab-test/${t.slug}`, type: "lab-test", description: t.description });
    }
  }

  if (input.type === "symptom") {
    const symptom = getAllSymptoms().find((s) => s.slug === input.slug);
    if (!symptom) return [];
    for (const ds of symptom.relatedDiseases ?? []) {
      const d = getDisease(ds);
      if (d) out.push({ slug: d.slug, name: d.name, href: `/disease/${d.slug}`, type: "disease", description: d.description });
    }
  }

  if (input.type === "lab-test") {
    for (const d of getDiseasesForLabTest(input.slug)) {
      out.push({
        slug: d.slug,
        name: d.name,
        href: `/disease/${d.slug}`,
        type: "disease",
        description: d.description,
      });
    }
  }

  const seen = new Set<string>();
  return out.filter((e) => {
    const key = `${e.type}:${e.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

export function getAllEntityCounts() {
  return {
    medicines: getAllMedicines().length,
    diseases: getAllDiseases().length,
    symptoms: getAllSymptoms().length,
    labTests: getAllLabTests().length,
    articles: getAllArticles().length,
    calculators: getAllCalculators().length,
    firstAid: getAllFirstAid().length,
    drugClasses: getAllDrugClasses().length,
  };
}
