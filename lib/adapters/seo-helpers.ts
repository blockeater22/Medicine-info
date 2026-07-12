import type { SEOData } from "@/types";
import { SITE } from "@/lib/constants";

const SITE_NAME = SITE.name;

export function buildMedicineSeo(name: string, genericName: string, brandNames: string[] = []): SEOData {
  return {
    title: `${name}: Uses, Dosage, Side Effects | ${SITE_NAME}`,
    description: `Complete guide to ${name} (${genericName}). Learn uses, dosage, side effects, warnings, and drug interactions for patients in India.`,
    keywords: [name, genericName, ...brandNames.slice(0, 3), "medicine India", "Doctors Hub"],
  };
}

export function buildDiseaseSeo(name: string): SEOData {
  return {
    title: `${name}: Symptoms, Causes, Treatment | ${SITE_NAME}`,
    description: `Learn about ${name} — symptoms, causes, risk factors, diagnosis, treatment options, and prevention tips.`,
    keywords: [name, "disease", "symptoms", "treatment", "India"],
  };
}

export function buildSymptomSeo(name: string): SEOData {
  return {
    title: `${name}: Causes, Remedies, When to See Doctor | ${SITE_NAME}`,
    description: `Understand ${name}: common causes, emergency signs, home remedies, and when to consult a doctor.`,
    keywords: [name, "symptom", "causes", "home remedies"],
  };
}

export function buildLabTestSeo(name: string): SEOData {
  return {
    title: `${name}: Purpose, Normal Range, Preparation | ${SITE_NAME}`,
    description: `Complete guide to ${name} in India. Learn preparation, procedure, normal values, and what results mean.`,
    keywords: [name, "lab test", "normal range", "India"],
  };
}

export function buildFirstAidSeo(name: string): SEOData {
  return {
    title: `${name} Guide | ${SITE_NAME}`,
    description: `Step-by-step ${name.toLowerCase()} instructions with do's, don'ts, and emergency numbers for India.`,
    keywords: [name, "first aid", "emergency", "India"],
  };
}

export function buildArticleSeo(title: string, category: string, tags: string[] = []): SEOData {
  return {
    title: `${title} | ${SITE_NAME}`,
    description: `Read our comprehensive guide on ${title.toLowerCase()}. Evidence-based ${category.toLowerCase()} information for India.`,
    keywords: [title, category, ...tags.slice(0, 4)],
  };
}

export function buildCalculatorSeo(name: string): SEOData {
  return {
    title: `${name} | Free Online Tool | ${SITE_NAME}`,
    description: `Use our free ${name.toLowerCase()}. Instant, accurate, client-side calculation for health monitoring.`,
    keywords: [name, "calculator", "free", "health tool"],
  };
}

export function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 3).trim() + "...";
}

export function inferCategoryFromSlug(slug: string, fallback = "General Health"): string {
  const map: Record<string, string> = {
    diabetes: "Endocrine",
    hypertension: "Cardiovascular",
    asthma: "Respiratory",
    thyroid: "Endocrine",
    arthritis: "Musculoskeletal",
    pneumonia: "Respiratory",
    anemia: "Hematology",
    migraine: "Neurological",
    depression: "Mental Health",
    obesity: "Metabolic",
    cbc: "Hematology",
    hba1c: "Diabetes",
    ecg: "Cardiology",
    headache: "Neurological",
    fever: "General",
    cough: "Respiratory",
  };
  return map[slug] || fallback;
}
