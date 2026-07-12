import type {
  Article,
  CalculatorMeta,
  Disease,
  FAQItem,
  FirstAid,
  LabTest,
  Medicine,
  Symptom,
} from "@/types";
import type {
  PipelineArticle,
  PipelineCalculator,
  PipelineDisease,
  PipelineFirstAid,
  PipelineLabTest,
  PipelineMedicine,
  PipelineSymptom,
} from "./pipeline-types";
import {
  buildArticleSeo,
  buildCalculatorSeo,
  buildDiseaseSeo,
  buildFirstAidSeo,
  buildLabTestSeo,
  buildMedicineSeo,
  buildSymptomSeo,
  inferCategoryFromSlug,
  truncateDescription,
} from "./seo-helpers";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";

const DEFAULT_MISSED_DOSE =
  "Take the missed dose as soon as you remember unless it is near the time for your next dose. Do not double doses.";
const DEFAULT_OVERDOSE =
  "Seek emergency medical care immediately if overdose is suspected. Contact your local poison control center or hospital.";

function normalizeFaqs(faqs?: { question: string; answer: string }[]): FAQItem[] {
  return faqs ?? [];
}

function mapSources(sources?: { name: string; url: string; accessedAt?: string }[]) {
  return sources?.map((s) => ({ name: s.name, url: s.url, accessedAt: s.accessedAt }));
}

function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function adaptMedicine(raw: PipelineMedicine): Medicine {
  const name = titleCase(raw.genericName);
  const brandNames = raw.brandNames ?? [];
  const sideEffects = [...(raw.sideEffects ?? []), ...(raw.seriousSideEffects ?? [])].filter(Boolean);
  const warningsList = [
    ...(raw.seriousSideEffects ?? []).slice(0, 3),
    "Follow the prescribed dose and duration",
    "Inform your doctor about all current medications",
  ];

  return {
    slug: raw.slug,
    name,
    genericName: raw.genericName,
    brandNames,
    category: raw.drugClass,
    description: truncateDescription(
      `${name} (${raw.genericName}) — uses, dosage, side effects, and safety information for patients in India.`
    ),
    seo: buildMedicineSeo(name, raw.genericName, brandNames),
    composition: raw.composition,
    uses: raw.uses,
    howItWorks: raw.howItWorks,
    dosage: {
      adults: raw.dosage.adult,
      children: raw.dosage.child,
      elderly: raw.dosage.elderly,
    },
    missedDose: DEFAULT_MISSED_DOSE,
    overdose: DEFAULT_OVERDOSE,
    sideEffects: sideEffects.length ? sideEffects : ["Consult your doctor if unexpected symptoms occur"],
    warnings: warningsList,
    pregnancy: raw.warnings.pregnancy,
    breastfeeding: raw.warnings.breastfeeding,
    kidneyDisease: raw.warnings.kidney,
    liverDisease: raw.warnings.liver,
    driving: raw.warnings.driving,
    alcohol: raw.warnings.alcohol,
    foodInteraction: (raw.interactions.food ?? []).join(" ") || "Take as directed with respect to meals unless advised otherwise.",
    drugInteractions: raw.interactions.drugs ?? [],
    storage: raw.storage,
    alternatives: raw.relatedMedicines ?? [],
    relatedDiseases: raw.relatedDiseases ?? [],
    faqs: normalizeFaqs(raw.faqs),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    popular: false,
  };
}

export function adaptDisease(raw: PipelineDisease): Disease {
  const category = inferCategoryFromSlug(raw.slug, "General Health");

  return {
    slug: raw.slug,
    name: raw.name,
    category,
    description: truncateDescription(raw.overview),
    seo: buildDiseaseSeo(raw.name),
    overview: raw.overview,
    symptoms: raw.symptoms,
    causes: raw.causes,
    riskFactors: raw.riskFactors ?? [],
    diagnosis: raw.diagnosis ?? [],
    treatment: raw.treatment ?? [],
    homeCare: raw.prevention?.slice(0, 3) ?? ["Follow your treatment plan", "Monitor symptoms", "Maintain healthy lifestyle habits"],
    prevention: raw.prevention ?? [],
    complications: raw.complications ?? [],
    emergencyWarningSigns: raw.emergencySigns ?? [],
    relatedMedicines: raw.relatedMedicines ?? [],
    relatedSlugs: raw.relatedDiseases,
    faqs: normalizeFaqs(raw.faq),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    popular: false,
  };
}

export function adaptSymptom(raw: PipelineSymptom): Symptom {
  const category = inferCategoryFromSlug(raw.slug, "General");

  return {
    slug: raw.slug,
    name: raw.name,
    category,
    description: truncateDescription(raw.overview),
    seo: buildSymptomSeo(raw.name),
    possibleCauses: raw.possibleCauses,
    emergencySymptoms: raw.redFlags ?? [],
    homeRemedies: raw.homeCare ?? [],
    whenToVisitDoctor: raw.whenToSeeDoctor ?? [],
    relatedDiseases: raw.relatedDiseases ?? [],
    faqs: normalizeFaqs(raw.faq),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    popular: false,
  };
}

export function adaptLabTest(raw: PipelineLabTest): LabTest {
  const category = inferCategoryFromSlug(raw.slug, "Laboratory");

  return {
    slug: raw.slug,
    name: raw.name,
    category,
    description: truncateDescription(raw.overview),
    seo: buildLabTestSeo(raw.name),
    overview: raw.overview,
    purpose: raw.purpose,
    preparation: raw.preparation ?? [],
    procedure: raw.procedure ?? [],
    normalRange: raw.normalRange,
    highMeans: raw.highMeaning ?? [],
    lowMeans: raw.lowMeaning ?? [],
    interpretation: raw.interpretation ?? [],
    faqs: normalizeFaqs(raw.faq),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    popular: false,
  };
}

export function adaptFirstAid(raw: PipelineFirstAid): FirstAid {
  return {
    slug: raw.slug,
    name: raw.name,
    description: truncateDescription(raw.overview),
    seo: buildFirstAidSeo(raw.name),
    steps: raw.steps,
    dos: raw.dos ?? [],
    donts: raw.donts ?? [],
    emergencyNumbers: raw.emergencyNumbers ?? [],
    severity: raw.severity ?? "moderate",
    faqs: normalizeFaqs(raw.faq),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    popular: false,
  };
}

export function adaptArticle(raw: PipelineArticle): Article {
  const tags = raw.tags ?? [];

  return {
    slug: raw.slug,
    name: raw.title,
    description: truncateDescription(raw.summary),
    seo: buildArticleSeo(raw.title, raw.category, tags),
    content: raw.content,
    author: raw.author ?? "Doctors Hub Medical Team",
    publishedAt: raw.lastUpdated,
    category: raw.category,
    tags,
    readTime: raw.readTimeMinutes,
    faqs: normalizeFaqs(raw.faq),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    trending: false,
    popular: false,
  };
}

const POPULAR_CALCULATOR_SLUGS = new Set([
  "bmi",
  "bmr",
  "calorie",
  "water-intake",
  "pregnancy-due-date",
  "ovulation",
  "body-fat",
  "ideal-weight",
]);

export function adaptCalculator(raw: PipelineCalculator): CalculatorMeta {
  return {
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    seo: buildCalculatorSeo(raw.name),
    type: raw.formulaReference,
    category: raw.category,
    inputs: raw.inputs.map((input) => ({
      ...input,
      type: input.type === "date" ? "date" : input.type === "select" ? "select" : "number",
    })),
    formula: raw.formulaReference,
    interpretation: raw.interpretationNotes ?? [],
    faqs: normalizeFaqs(raw.faq),
    updatedAt: raw.lastUpdated,
    sources: mapSources(raw.sources),
    popular: POPULAR_CALCULATOR_SLUGS.has(raw.slug),
  };
}

/** Pass-through if already website format; otherwise adapt */
export function coerceMedicine(data: unknown): Medicine {
  if (isWebsiteMedicine(data)) return data;
  return adaptMedicine(data as PipelineMedicine);
}

export function coerceDisease(data: unknown): Disease {
  if (isWebsiteDisease(data)) return data;
  return adaptDisease(data as PipelineDisease);
}

export function coerceSymptom(data: unknown): Symptom {
  if (isWebsiteSymptom(data)) return data;
  // Legacy website symptom uses `description` as main field
  const d = data as Record<string, unknown>;
  if (d.description && d.possibleCauses && !d.overview) {
    return data as Symptom;
  }
  return adaptSymptom(data as PipelineSymptom);
}

export function coerceLabTest(data: unknown): LabTest {
  if (isWebsiteLabTest(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.highMeans !== undefined) return data as LabTest;
  return adaptLabTest(data as PipelineLabTest);
}

export function coerceFirstAid(data: unknown): FirstAid {
  if (isWebsiteFirstAid(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.description && d.steps && !d.overview) return data as FirstAid;
  return adaptFirstAid(data as PipelineFirstAid);
}

export function coerceArticle(data: unknown): Article {
  if (isWebsiteArticle(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.name && d.content && !d.title) return data as Article;
  return adaptArticle(data as PipelineArticle);
}

export function coerceCalculator(data: unknown): CalculatorMeta {
  if (isWebsiteCalculator(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.formula !== undefined || (d.type && !d.formulaReference)) {
    const calc = data as CalculatorMeta;
    return {
      ...calc,
      popular: calc.popular ?? POPULAR_CALCULATOR_SLUGS.has(calc.slug),
    };
  }
  return adaptCalculator(data as PipelineCalculator);
}

function isWebsiteMedicine(data: unknown): data is Medicine {
  return typeof data === "object" && data !== null && "seo" in data && "updatedAt" in data && "dosage" in data && "adults" in (data as Medicine).dosage;
}

function isWebsiteDisease(data: unknown): data is Disease {
  return typeof data === "object" && data !== null && "seo" in data && "emergencyWarningSigns" in data;
}

function isWebsiteSymptom(data: unknown): data is Symptom {
  return typeof data === "object" && data !== null && "seo" in data && "whenToVisitDoctor" in data;
}

function isWebsiteLabTest(data: unknown): data is LabTest {
  return typeof data === "object" && data !== null && "seo" in data && "highMeans" in data;
}

function isWebsiteFirstAid(data: unknown): data is FirstAid {
  return typeof data === "object" && data !== null && "seo" in data && "description" in data && !("overview" in data);
}

function isWebsiteArticle(data: unknown): data is Article {
  return typeof data === "object" && data !== null && "seo" in data && "name" in data && "readTime" in data;
}

function isWebsiteCalculator(data: unknown): data is CalculatorMeta {
  return typeof data === "object" && data !== null && "seo" in data && !("formulaReference" in data);
}

export { MEDICAL_DISCLAIMER };
