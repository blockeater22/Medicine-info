import { z } from "zod";

export const SourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  accessedAt: z.string().datetime().optional(),
});

export const FAQSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
});

export const MedicineSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  genericName: z.string().min(1),
  brandNames: z.array(z.string()).default([]),
  composition: z.string().min(1),
  drugClass: z.string().min(1),
  uses: z.array(z.string()).min(1),
  howItWorks: z.string().min(20),
  dosage: z.object({
    adult: z.string().min(1),
    child: z.string().min(1),
    elderly: z.string().min(1),
  }),
  sideEffects: z.array(z.string()).default([]),
  seriousSideEffects: z.array(z.string()).default([]),
  warnings: z.object({
    pregnancy: z.string().min(1),
    breastfeeding: z.string().min(1),
    kidney: z.string().min(1),
    liver: z.string().min(1),
    alcohol: z.string().min(1),
    driving: z.string().min(1),
  }),
  interactions: z.object({
    food: z.array(z.string()).default([]),
    drugs: z.array(z.string()).default([]),
  }),
  storage: z.string().min(1),
  faqs: z.array(FAQSchema).default([]),
  relatedMedicines: z.array(z.string()).default([]),
  relatedDiseases: z.array(z.string()).default([]),
  medicalDisclaimer: z.string().min(20),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export const DiseaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  overview: z.string().min(50),
  symptoms: z.array(z.string()).min(1),
  causes: z.array(z.string()).min(1),
  riskFactors: z.array(z.string()).default([]),
  diagnosis: z.array(z.string()).default([]),
  treatment: z.array(z.string()).default([]),
  prevention: z.array(z.string()).default([]),
  complications: z.array(z.string()).default([]),
  emergencySigns: z.array(z.string()).default([]),
  faq: z.array(FAQSchema).default([]),
  relatedDiseases: z.array(z.string()).default([]),
  relatedMedicines: z.array(z.string()).default([]),
  medicalDisclaimer: z.string().min(20),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export const SymptomSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  overview: z.string().min(50),
  possibleCauses: z.array(z.string()).min(1),
  redFlags: z.array(z.string()).default([]),
  homeCare: z.array(z.string()).default([]),
  whenToSeeDoctor: z.array(z.string()).default([]),
  faq: z.array(FAQSchema).default([]),
  relatedDiseases: z.array(z.string()).default([]),
  medicalDisclaimer: z.string().min(20),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export const LabTestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  overview: z.string().min(50),
  purpose: z.array(z.string()).min(1),
  preparation: z.array(z.string()).default([]),
  procedure: z.array(z.string()).default([]),
  normalRange: z.string().min(1),
  highMeaning: z.array(z.string()).default([]),
  lowMeaning: z.array(z.string()).default([]),
  interpretation: z.array(z.string()).default([]),
  faq: z.array(FAQSchema).default([]),
  medicalDisclaimer: z.string().min(20),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export const FirstAidSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  overview: z.string().min(50),
  steps: z.array(z.object({ title: z.string(), description: z.string() })).min(1),
  dos: z.array(z.string()).default([]),
  donts: z.array(z.string()).default([]),
  emergencyNumbers: z.array(z.object({ label: z.string(), number: z.string() })).default([]),
  faq: z.array(FAQSchema).default([]),
  severity: z.enum(["minor", "moderate", "severe"]).default("moderate"),
  medicalDisclaimer: z.string().min(20),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(50),
  content: z.string().min(200),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().default("Doctors Hub Medical Team"),
  readTimeMinutes: z.number().int().positive(),
  faq: z.array(FAQSchema).default([]),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export const CalculatorSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(20),
  category: z.string().min(1),
  formulaReference: z.string().min(1),
  inputs: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["number", "select", "date"]),
      unit: z.string().optional(),
      required: z.boolean().default(true),
    })
  ),
  interpretationNotes: z.array(z.string()).default([]),
  faq: z.array(FAQSchema).default([]),
  lastUpdated: z.string().datetime(),
  sources: z.array(SourceSchema).min(1),
});

export type MedicineRecord = z.infer<typeof MedicineSchema>;
export type DiseaseRecord = z.infer<typeof DiseaseSchema>;
export type SymptomRecord = z.infer<typeof SymptomSchema>;
export type LabTestRecord = z.infer<typeof LabTestSchema>;
export type FirstAidRecord = z.infer<typeof FirstAidSchema>;
export type ArticleRecord = z.infer<typeof ArticleSchema>;
export type CalculatorRecord = z.infer<typeof CalculatorSchema>;
export type SourceRecord = z.infer<typeof SourceSchema>;
