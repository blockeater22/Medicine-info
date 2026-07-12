import type {
  PipelineArticle,
  PipelineCalculator,
  PipelineDisease,
  PipelineFirstAid,
  PipelineLabTest,
  PipelineMedicine,
  PipelineSymptom,
} from "./pipeline-types";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Website records include `seo`; pipeline records include `lastUpdated` + `sources` */
function isWebsiteFormat(data: Record<string, unknown>): boolean {
  return "seo" in data && "updatedAt" in data;
}

export function isPipelineMedicine(data: unknown): data is PipelineMedicine {
  return isObject(data) && "drugClass" in data && "lastUpdated" in data && !isWebsiteFormat(data);
}

export function isPipelineDisease(data: unknown): data is PipelineDisease {
  return isObject(data) && "overview" in data && "name" in data && "lastUpdated" in data && !("description" in data && "seo" in data);
}

export function isPipelineSymptom(data: unknown): data is PipelineSymptom {
  return isObject(data) && "possibleCauses" in data && "redFlags" in data && "lastUpdated" in data && !isWebsiteFormat(data);
}

export function isPipelineLabTest(data: unknown): data is PipelineLabTest {
  return isObject(data) && "highMeaning" in data && "purpose" in data && "lastUpdated" in data && !isWebsiteFormat(data);
}

export function isPipelineFirstAid(data: unknown): data is PipelineFirstAid {
  return isObject(data) && "steps" in data && "overview" in data && "lastUpdated" in data && !isWebsiteFormat(data);
}

export function isPipelineArticle(data: unknown): data is PipelineArticle {
  return isObject(data) && "title" in data && "summary" in data && "readTimeMinutes" in data && !isWebsiteFormat(data);
}

export function isPipelineCalculator(data: unknown): data is PipelineCalculator {
  return isObject(data) && "formulaReference" in data && "lastUpdated" in data && !isWebsiteFormat(data);
}

export function isPipelineSymptomLegacy(data: unknown): data is PipelineSymptom {
  // Pipeline symptom without redFlags (older runs)
  return isObject(data) && "possibleCauses" in data && "lastUpdated" in data && !("seo" in data) && !("description" in data);
}

export function isPipelineDiseaseLegacy(data: unknown): data is PipelineDisease {
  return isObject(data) && "overview" in data && "emergencySigns" in data && "lastUpdated" in data && !("seo" in data);
}

export function isPipelineLabTestLegacy(data: unknown): data is PipelineLabTest {
  return isObject(data) && "normalRange" in data && "lastUpdated" in data && !("highMeans" in data) && !("seo" in data);
}
