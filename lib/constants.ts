import type { SiteConfig } from "@/types";
import { getSiteUrl } from "@/lib/site-url";

export const SITE: SiteConfig = {
  name: "Doctors Hub",
  domain: getSiteUrl(),
  tagline: "India's Trusted Free Medical Information Platform",
  description:
    "Search medicines, diseases, symptoms, lab tests, medical calculators, first aid guides and health articles. Free, reliable medical information for India.",
  email: "contact@doctors-hub.in",
  address: "India",
  social: {
    facebook: "https://facebook.com/doctorshub",
    twitter: "https://twitter.com/doctorshub",
    instagram: "https://instagram.com/doctorshub",
    youtube: "https://youtube.com/doctorshub",
  },
};

export const NAV_LINKS = [
  { label: "Medicines", href: "/medicines" },
  { label: "Diseases", href: "/diseases" },
  { label: "Symptoms", href: "/symptoms" },
  { label: "Lab Tests", href: "/lab-tests" },
  { label: "Calculators", href: "/calculators" },
  { label: "First Aid", href: "/first-aid" },
  { label: "Articles", href: "/articles" },
] as const;

export const FOOTER_LINKS = {
  resources: [
    { label: "Medicines", href: "/medicines" },
    { label: "Diseases", href: "/diseases" },
    { label: "Symptoms", href: "/symptoms" },
    { label: "Lab Tests", href: "/lab-tests" },
    { label: "Calculators", href: "/calculators" },
    { label: "First Aid", href: "/first-aid" },
    { label: "Articles", href: "/articles" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Medical Team", href: "/medical-team" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Corrections", href: "/corrections" },
    { label: "Contact", href: "/contact" },
    { label: "Search", href: "/search" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
} as const;

export const POPULAR_SEARCHES = [
  "Paracetamol",
  "Diabetes",
  "Headache",
  "BMI Calculator",
  "Blood Pressure",
  "Thyroid",
  "CBC Test",
  "Fever",
] as const;

export const EMERGENCY_NUMBERS = [
  { label: "National Emergency", number: "112" },
  { label: "Ambulance", number: "102" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Women Helpline", number: "1091" },
  { label: "Child Helpline", number: "1098" },
] as const;

export const MEDICAL_DISCLAIMER =
  "The information provided on Doctors Hub is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before making any health-related decisions.";

export const ITEMS_PER_PAGE = 12;

export const CONTENT_PATHS = {
  medicines: "data/medicines",
  diseases: "data/diseases",
  symptoms: "data/symptoms",
  tests: "data/tests",
  calculators: "data/calculators",
  articles: "data/articles",
  firstAid: "data/first-aid",
} as const;
