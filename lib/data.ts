import fs from "fs";
import path from "path";
import type {
  Article,
  CalculatorMeta,
  Disease,
  FirstAid,
  LabTest,
  Medicine,
  Symptom,
} from "@/types";
import {
  coerceArticle,
  coerceCalculator,
  coerceDisease,
  coerceFirstAid,
  coerceLabTest,
  coerceMedicine,
  coerceSymptom,
} from "@/lib/adapters";

const DATA_DIR = path.join(process.cwd(), "data");

function readJsonDir<T>(dir: string, coerce: (raw: unknown) => T): T[] {
  const fullPath = path.join(DATA_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".json"))
    .map((f) => coerce(JSON.parse(fs.readFileSync(path.join(fullPath, f), "utf-8"))));
}

function readJsonFile<T>(dir: string, slug: string, coerce: (raw: unknown) => T): T | null {
  const filePath = path.join(DATA_DIR, dir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return coerce(JSON.parse(fs.readFileSync(filePath, "utf-8")));
}

export function getAllMedicines(): Medicine[] {
  return readJsonDir("medicines", coerceMedicine);
}

export function getMedicine(slug: string): Medicine | null {
  return readJsonFile("medicines", slug, coerceMedicine);
}

export function getAllDiseases(): Disease[] {
  return readJsonDir("diseases", coerceDisease);
}

export function getDisease(slug: string): Disease | null {
  return readJsonFile("diseases", slug, coerceDisease);
}

export function getAllSymptoms(): Symptom[] {
  return readJsonDir("symptoms", coerceSymptom);
}

export function getSymptom(slug: string): Symptom | null {
  return readJsonFile("symptoms", slug, coerceSymptom);
}

export function getAllLabTests(): LabTest[] {
  return readJsonDir("tests", coerceLabTest);
}

export function getLabTest(slug: string): LabTest | null {
  return readJsonFile("tests", slug, coerceLabTest);
}

export function getAllFirstAid(): FirstAid[] {
  return readJsonDir("first-aid", coerceFirstAid);
}

export function getFirstAid(slug: string): FirstAid | null {
  return readJsonFile("first-aid", slug, coerceFirstAid);
}

export function getAllArticles(): Article[] {
  return readJsonDir("articles", coerceArticle);
}

export function getArticle(slug: string): Article | null {
  return readJsonFile("articles", slug, coerceArticle);
}

export function getAllCalculators(): CalculatorMeta[] {
  return readJsonDir("calculators", coerceCalculator);
}

export function getCalculator(slug: string): CalculatorMeta | null {
  return readJsonFile("calculators", slug, coerceCalculator);
}

export function getPopularMedicines(limit = 8): Medicine[] {
  return getAllMedicines()
    .filter((m) => m.popular)
    .slice(0, limit);
}

export function getPopularDiseases(limit = 8): Disease[] {
  return getAllDiseases()
    .filter((d) => d.popular)
    .slice(0, limit);
}

export function getPopularLabTests(limit = 8): LabTest[] {
  return getAllLabTests()
    .filter((t) => t.popular)
    .slice(0, limit);
}

export function getPopularCalculators(limit = 6): CalculatorMeta[] {
  const all = getAllCalculators();
  const popular = all.filter((c) => c.popular);
  const source = popular.length > 0 ? popular : all;
  return source.slice(0, limit);
}

export function getPopularFirstAid(limit = 4): FirstAid[] {
  const all = getAllFirstAid();
  const popular = all.filter((f) => f.popular);
  const source = popular.length > 0 ? popular : all;
  return source.slice(0, limit);
}

export function getTrendingArticles(limit = 6): Article[] {
  return getAllArticles()
    .filter((a) => a.trending)
    .slice(0, limit);
}

export function getRelatedMedicines(slugs: string[]): Medicine[] {
  return slugs.map((s) => getMedicine(s)).filter(Boolean) as Medicine[];
}

export function getRelatedDiseases(slugs: string[]): Disease[] {
  return slugs.map((s) => getDisease(s)).filter(Boolean) as Disease[];
}

export function getAllSlugs(type: string): string[] {
  const map: Record<string, () => { slug: string }[]> = {
    medicines: getAllMedicines,
    diseases: getAllDiseases,
    symptoms: getAllSymptoms,
    tests: getAllLabTests,
    "first-aid": getAllFirstAid,
    articles: getAllArticles,
    calculators: getAllCalculators,
  };
  return (map[type]?.() ?? []).map((item) => item.slug);
}

export function getCategories(type: string): { name: string; count: number }[] {
  const map: Record<string, () => { category: string }[]> = {
    medicines: getAllMedicines,
    diseases: getAllDiseases,
    symptoms: getAllSymptoms,
    tests: getAllLabTests,
    articles: getAllArticles,
  };
  const items = map[type]?.() ?? [];
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildSearchIndex() {
  const index: {
    slug: string;
    name: string;
    description: string;
    type: string;
    href: string;
    category?: string;
    keywords?: string;
  }[] = [];

  getAllMedicines().forEach((m) =>
    index.push({
      slug: m.slug,
      name: m.name,
      description: m.description,
      type: "medicine",
      href: `/medicine/${m.slug}`,
      category: m.category,
      keywords: [m.genericName, ...m.brandNames, ...m.uses].join(" "),
    })
  );

  getAllDiseases().forEach((d) =>
    index.push({
      slug: d.slug,
      name: d.name,
      description: d.description,
      type: "disease",
      href: `/disease/${d.slug}`,
      category: d.category,
      keywords: d.symptoms.join(" "),
    })
  );

  getAllSymptoms().forEach((s) =>
    index.push({
      slug: s.slug,
      name: s.name,
      description: s.description,
      type: "symptom",
      href: `/symptom/${s.slug}`,
      category: s.category,
    })
  );

  getAllLabTests().forEach((t) =>
    index.push({
      slug: t.slug,
      name: t.name,
      description: t.description,
      type: "lab-test",
      href: `/lab-test/${t.slug}`,
      category: t.category,
    })
  );

  getAllArticles().forEach((a) =>
    index.push({
      slug: a.slug,
      name: a.name,
      description: a.description,
      type: "article",
      href: `/article/${a.slug}`,
      category: a.category,
      keywords: a.tags.join(" "),
    })
  );

  getAllFirstAid().forEach((f) =>
    index.push({
      slug: f.slug,
      name: f.name,
      description: f.description,
      type: "first-aid",
      href: `/first-aid/${f.slug}`,
    })
  );

  getAllCalculators().forEach((c) =>
    index.push({
      slug: c.slug,
      name: c.name,
      description: c.description,
      type: "calculator",
      href: `/calculator/${c.slug}`,
    })
  );

  return index;
}
