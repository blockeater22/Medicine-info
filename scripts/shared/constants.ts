export const MEDICAL_DISCLAIMER =
  "This information is for educational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.";

export const SOURCES = {
  openFda: "https://open.fda.gov/apis/",
  rxNorm: "https://rxnav.nlm.nih.gov/",
  medlinePlus: "https://medlineplus.gov/",
  nihSearch: "https://wsearch.nlm.nih.gov/ws/query",
  wikipedia: "https://en.wikipedia.org/api/rest_v1/",
  loinc: "https://loinc.org/",
  cdc: "https://www.cdc.gov/",
  who: "https://www.who.int/",
} as const;

export const DATA_DIRS = {
  medicines: "data/medicines",
  diseases: "data/diseases",
  symptoms: "data/symptoms",
  tests: "data/tests",
  firstAid: "data/first-aid",
  articles: "data/articles",
  calculators: "data/calculators",
} as const;

export const EMERGENCY_NUMBERS_IN = [
  { label: "National Emergency", number: "112" },
  { label: "Ambulance", number: "102" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
] as const;
