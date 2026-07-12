import {
  getAllDiseases,
  getAllFirstAid,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
} from "@/lib/data";

export type ListingItem = {
  slug: string;
  name: string;
  description: string;
  category?: string;
};

export type ListingConfig = {
  getItems: () => ListingItem[];
  title: string;
  description: string;
  basePath: string;
  itemBasePath: string;
  breadcrumbLabel: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
};

const sortByName = (a: ListingItem, b: ListingItem) => a.name.localeCompare(b.name);

export const medicinesListing: ListingConfig = {
  getItems: () => getAllMedicines().sort(sortByName),
  title: "Medicines",
  description: "Comprehensive drug information including uses, dosage, side effects, and safety warnings.",
  basePath: "/medicines",
  itemBasePath: "/medicine",
  breadcrumbLabel: "Medicines",
  meta: {
    title: "Medicines — Drug Information, Uses & Side Effects",
    description: "Browse comprehensive medicine information including uses, dosage, side effects, and drug interactions for Indian patients.",
    keywords: ["medicines", "drugs", "medicine guide India"],
  },
};

export const diseasesListing: ListingConfig = {
  getItems: () => getAllDiseases().sort(sortByName),
  title: "Diseases & Conditions",
  description: "Learn about common diseases — symptoms, causes, diagnosis, treatment, and prevention.",
  basePath: "/diseases",
  itemBasePath: "/disease",
  breadcrumbLabel: "Diseases",
  meta: {
    title: "Diseases — Symptoms, Causes & Treatment",
    description: "Browse disease information including symptoms, causes, diagnosis, treatment, and prevention guides.",
    keywords: ["diseases", "medical conditions", "health conditions India"],
  },
};

export const symptomsListing: ListingConfig = {
  getItems: () => getAllSymptoms().sort(sortByName),
  title: "Symptoms",
  description: "Understand symptoms, possible causes, and when to seek medical attention.",
  basePath: "/symptoms",
  itemBasePath: "/symptom",
  breadcrumbLabel: "Symptoms",
  meta: {
    title: "Symptoms — Causes, Remedies & When to See a Doctor",
    description: "Understand common symptoms, their possible causes, home remedies, and when to consult a doctor.",
    keywords: ["symptoms", "health symptoms", "medical symptoms"],
  },
};

export const labTestsListing: ListingConfig = {
  getItems: () => getAllLabTests().sort(sortByName),
  title: "Lab Tests",
  description: "Diagnostic test guides — preparation, procedure, normal ranges, and interpretation.",
  basePath: "/lab-tests",
  itemBasePath: "/lab-test",
  breadcrumbLabel: "Lab Tests",
  meta: {
    title: "Lab Tests — Purpose, Preparation & Normal Range",
    description: "Complete guide to medical lab tests in India — preparation, procedure, normal ranges, and result interpretation.",
    keywords: ["lab tests", "blood tests", "diagnostic tests India"],
  },
};

export const firstAidListing: ListingConfig = {
  getItems: () => getAllFirstAid().sort(sortByName),
  title: "First Aid Guides",
  description: "Step-by-step emergency first aid instructions with do's, don'ts, and emergency numbers.",
  basePath: "/first-aid",
  itemBasePath: "/first-aid",
  breadcrumbLabel: "First Aid",
  meta: {
    title: "First Aid Guides — Emergency Step-by-Step Instructions",
    description: "Emergency first aid guides for burns, choking, CPR, snake bites, and more with Indian emergency numbers.",
    keywords: ["first aid", "emergency guide", "CPR", "first aid India"],
  },
};
