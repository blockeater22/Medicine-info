export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SourceItem {
  name: string;
  url: string;
  accessedAt?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BaseContent {
  slug: string;
  name: string;
  description: string;
  seo: SEOData;
  faqs?: FAQItem[];
  relatedSlugs?: string[];
  updatedAt: string;
  sources?: SourceItem[];
  popular?: boolean;
  trending?: boolean;
}

export interface Medicine extends BaseContent {
  genericName: string;
  brandNames: string[];
  composition: string;
  uses: string[];
  howItWorks: string;
  dosage: {
    adults: string;
    children?: string;
    elderly?: string;
    notes?: string;
  };
  missedDose: string;
  overdose: string;
  sideEffects: string[];
  warnings: string[];
  pregnancy: string;
  breastfeeding: string;
  kidneyDisease: string;
  liverDisease: string;
  driving: string;
  alcohol: string;
  foodInteraction: string;
  drugInteractions: string[];
  storage: string;
  alternatives: string[];
  relatedDiseases: string[];
  category: string;
}

export interface Disease extends BaseContent {
  overview: string;
  symptoms: string[];
  causes: string[];
  riskFactors: string[];
  diagnosis: string[];
  treatment: string[];
  homeCare: string[];
  prevention: string[];
  complications: string[];
  emergencyWarningSigns: string[];
  relatedMedicines: string[];
  category: string;
}

export interface Symptom extends BaseContent {
  description: string;
  possibleCauses: string[];
  emergencySymptoms: string[];
  homeRemedies: string[];
  whenToVisitDoctor: string[];
  relatedDiseases: string[];
  category: string;
}

export interface LabTest extends BaseContent {
  overview: string;
  purpose: string[];
  preparation: string[];
  procedure: string[];
  normalRange: string;
  highMeans: string[];
  lowMeans: string[];
  interpretation: string[];
  category: string;
}

export interface FirstAid extends BaseContent {
  steps: { title: string; description: string }[];
  dos: string[];
  donts: string[];
  emergencyNumbers: { label: string; number: string }[];
  severity: "minor" | "moderate" | "severe";
}

export interface Article extends BaseContent {
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  image?: string;
}

export interface CalculatorMeta extends BaseContent {
  type: string;
  category: string;
  inputs: CalculatorInput[];
  formula?: string;
  interpretation?: string[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: "number" | "select" | "date" | "radio";
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  unit?: string;
  required?: boolean;
}

export type ContentType =
  | "medicine"
  | "disease"
  | "symptom"
  | "lab-test"
  | "calculator"
  | "first-aid"
  | "article";

export interface SearchResult {
  slug: string;
  name: string;
  description: string;
  type: ContentType;
  href: string;
  category?: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  count?: number;
}

export interface SiteConfig {
  name: string;
  domain: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}
