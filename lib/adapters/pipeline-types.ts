/** Raw JSON shape emitted by the data pipeline (scripts/shared/schemas.ts) */

export interface PipelineSource {
  name: string;
  url: string;
  accessedAt?: string;
}

export interface PipelineFAQ {
  question: string;
  answer: string;
}

export interface PipelineMedicine {
  slug: string;
  genericName: string;
  brandNames?: string[];
  composition: string;
  drugClass: string;
  uses: string[];
  howItWorks: string;
  dosage: { adult: string; child: string; elderly: string };
  sideEffects?: string[];
  seriousSideEffects?: string[];
  warnings: {
    pregnancy: string;
    breastfeeding: string;
    kidney: string;
    liver: string;
    alcohol: string;
    driving: string;
  };
  interactions: { food?: string[]; drugs?: string[] };
  storage: string;
  faqs?: PipelineFAQ[];
  relatedMedicines?: string[];
  relatedDiseases?: string[];
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export interface PipelineDisease {
  slug: string;
  name: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  riskFactors?: string[];
  diagnosis?: string[];
  treatment?: string[];
  prevention?: string[];
  complications?: string[];
  emergencySigns?: string[];
  faq?: PipelineFAQ[];
  relatedDiseases?: string[];
  relatedSlugs?: string[];
  relatedMedicines?: string[];
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export interface PipelineSymptom {
  slug: string;
  name: string;
  overview: string;
  possibleCauses: string[];
  redFlags?: string[];
  homeCare?: string[];
  whenToSeeDoctor?: string[];
  faq?: PipelineFAQ[];
  relatedDiseases?: string[];
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export interface PipelineLabTest {
  slug: string;
  name: string;
  overview: string;
  purpose: string[];
  preparation?: string[];
  procedure?: string[];
  normalRange: string;
  highMeaning?: string[];
  lowMeaning?: string[];
  interpretation?: string[];
  faq?: PipelineFAQ[];
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export interface PipelineFirstAid {
  slug: string;
  name: string;
  overview: string;
  steps: { title: string; description: string }[];
  dos?: string[];
  donts?: string[];
  emergencyNumbers?: { label: string; number: string }[];
  faq?: PipelineFAQ[];
  severity?: "minor" | "moderate" | "severe";
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export interface PipelineArticle {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags?: string[];
  author?: string;
  readTimeMinutes: number;
  faq?: PipelineFAQ[];
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export interface PipelineCalculator {
  slug: string;
  name: string;
  description: string;
  category: string;
  formulaReference: string;
  inputs: Array<{
    id: string;
    label: string;
    type: "number" | "select" | "date";
    unit?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
  }>;
  interpretationNotes?: string[];
  faq?: PipelineFAQ[];
  medicalDisclaimer?: string;
  lastUpdated: string;
  sources?: PipelineSource[];
}

export type PipelineRecord =
  | PipelineMedicine
  | PipelineDisease
  | PipelineSymptom
  | PipelineLabTest
  | PipelineFirstAid
  | PipelineArticle
  | PipelineCalculator;
