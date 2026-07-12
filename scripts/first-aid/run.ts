import path from "path";
import { EMERGENCY_NUMBERS_IN, DATA_DIRS, MEDICAL_DISCLAIMER, SOURCES } from "../shared/constants.js";
import { FirstAidSchema, type FirstAidRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import { buildFaqs, makeSource, synthesizeOverview, titleCase } from "../shared/summarize.js";
import { isoNow, slugify } from "../shared/utils.js";

const SEED_PATH = path.join("scripts", "seeds", "first-aid.txt");

interface FirstAidTemplate {
  term: string;
  severity: "minor" | "moderate" | "severe";
  steps: Array<{ title: string; description: string }>;
  dos: string[];
  donts: string[];
}

const TEMPLATES: Record<string, Omit<FirstAidTemplate, "term">> = {
  burn: {
    severity: "severe",
    steps: [
      { title: "Stop the burning process", description: "Move away from heat source. Remove smoldering clothing unless stuck to skin." },
      { title: "Cool the area", description: "Run cool (not icy) water over the burn for 10–20 minutes." },
      { title: "Protect the wound", description: "Cover with clean, non-fluffy dressing. Do not apply toothpaste or oils." },
      { title: "Seek emergency care", description: "Call ambulance for large, deep, facial, or electrical burns." },
    ],
    dos: ["Remove jewelry near burn early", "Keep victim warm otherwise", "Monitor breathing"],
    donts: ["Do not burst blisters", "Do not use ice directly", "Do not delay care for major burns"],
  },
  choking: {
    severity: "severe",
    steps: [
      { title: "Assess responsiveness", description: "Ask if they can speak or cough. Severe choking needs immediate action." },
      { title: "Back blows", description: "For adults/children, give up to 5 firm back blows between shoulder blades." },
      { title: "Abdominal thrusts", description: "If ineffective, perform up to 5 abdominal thrusts (Heimlich maneuver)." },
      { title: "Call emergency services", description: "Dial 112/102 if obstruction is not cleared quickly." },
    ],
    dos: ["Encourage coughing if partial obstruction", "Start CPR if unconscious"],
    donts: ["Do not finger sweep blindly", "Do not give water to choking person"],
  },
  cpr: {
    severity: "severe",
    steps: [
      { title: "Check responsiveness and breathing", description: "Tap shoulders and look for normal breathing within 10 seconds." },
      { title: "Call for help", description: "Activate emergency services and request an AED if available." },
      { title: "Start chest compressions", description: "Push hard and fast in center of chest, 100–120/min, depth ~5 cm." },
      { title: "Provide rescue breaths if trained", description: "30 compressions followed by 2 breaths when trained and willing." },
    ],
    dos: ["Minimize pauses", "Allow full chest recoil", "Switch rescuers every 2 minutes if possible"],
    donts: ["Do not stop until help arrives or person responds", "Do not perform on normal breathing victims"],
  },
  "snake-bite": {
    severity: "severe",
    steps: [
      { title: "Move to safety", description: "Keep victim calm and still to slow venom spread." },
      { title: "Immobilize limb", description: "Keep bitten area at or below heart level with splint if possible." },
      { title: "Call emergency services", description: "Transport to hospital with antivenom capability immediately." },
      { title: "Monitor vital signs", description: "Watch for swelling, breathing difficulty, or altered consciousness." },
    ],
    dos: ["Remove tight clothing/jewelry", "Note snake appearance if safe", "Seek hospital care urgently"],
    donts: ["Do not cut wound or suck venom", "Do not apply tourniquet routinely", "Do not use unproven herbal remedies"],
  },
  bleeding: {
    severity: "severe",
    steps: [
      { title: "Apply direct pressure", description: "Use clean cloth and firm pressure on wound for several minutes." },
      { title: "Elevate if possible", description: "Raise injured limb above heart level when no fracture suspected." },
      { title: "Add layers if soaked", description: "Do not remove initial dressing; add more material on top." },
      { title: "Emergency care for severe bleeding", description: "Call ambulance if bleeding spurts or does not slow." },
    ],
    dos: ["Wear gloves if available", "Keep victim lying down", "Monitor for shock"],
    donts: ["Do not remove embedded objects", "Do not delay pressure"],
  },
};

export async function runFirstAidPipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const term of seeds.slice(0, options.limit)) {
    const record = buildFirstAid(term);
    results.push(saveRecord(DATA_DIRS.firstAid, record, FirstAidSchema, options));
    console.log(`[first-aid] ${record.slug} ✓`);
  }

  logResults("first-aid", results);
  return results;
}

function buildFirstAid(term: string): FirstAidRecord {
  const slug = slugify(term);
  const template = TEMPLATES[slug] || defaultTemplate(term);

  return {
    slug,
    name: `${titleCase(term.replace(/-/g, " "))} First Aid`,
    overview: synthesizeOverview(`${titleCase(term.replace(/-/g, " "))} emergency care`, [
      "Immediate action can prevent complications",
      "Call emergency services for severe presentations",
    ]),
    steps: template.steps,
    dos: template.dos,
    donts: template.donts,
    emergencyNumbers: [...EMERGENCY_NUMBERS_IN],
    faq: buildFaqs(term, "general"),
    severity: template.severity,
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated: isoNow(),
    sources: [
      makeSource("WHO Emergency Care Guidance", SOURCES.who),
      makeSource("CDC Injury Prevention", SOURCES.cdc),
    ],
  };
}

function defaultTemplate(term: string): Omit<FirstAidTemplate, "term"> {
  return {
    severity: "moderate",
    steps: [
      { title: "Ensure scene safety", description: "Protect yourself and the victim from further harm." },
      { title: "Assess responsiveness", description: "Check breathing and consciousness quickly." },
      { title: "Call emergency help", description: "Dial 112 or local ambulance if condition is serious." },
      { title: "Provide basic support", description: `Follow standard first aid principles for ${term.replace(/-/g, " ")} while awaiting professionals.` },
    ],
    dos: ["Stay calm", "Monitor continuously", "Keep airway clear"],
    donts: ["Do not give food/drink if drowsy", "Do not move victim if spinal injury suspected"],
  };
}
