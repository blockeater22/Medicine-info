const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "..", "data");
const dirs = ["medicines", "diseases", "symptoms", "tests", "articles", "first-aid", "calculators"];
dirs.forEach((d) => fs.mkdirSync(path.join(DATA, d), { recursive: true }));

const write = (dir, slug, data) =>
  fs.writeFileSync(path.join(DATA, dir, `${slug}.json`), JSON.stringify(data, null, 2));

const seo = (title, desc, keywords = []) => ({ title, description: desc, keywords });
const faqs = (items) => items.map(([q, a]) => ({ question: q, answer: a }));
const updated = "2026-07-01";

const medicines = [
  ["paracetamol", "Paracetamol", "Acetaminophen", ["Crocin", "Dolo 650", "Calpol"], "Pain Relief", ["fever", "diabetes"]],
  ["dolo-650", "Dolo 650", "Paracetamol", ["Dolo"], "Pain Relief", ["fever", "common-cold"]],
  ["crocin-650", "Crocin 650", "Paracetamol", ["Crocin"], "Pain Relief", ["fever", "headache"]],
  ["ibuprofen", "Ibuprofen", "Ibuprofen", ["Brufen", "Ibugesic"], "NSAID", ["arthritis", "fever"]],
  ["aspirin", "Aspirin", "Acetylsalicylic Acid", ["Ecosprin"], "NSAID", ["heart-disease", "fever"]],
  ["amoxicillin", "Amoxicillin", "Amoxicillin", ["Mox", "Novamox"], "Antibiotic", ["pneumonia", "uti"]],
  ["azithromycin", "Azithromycin", "Azithromycin", ["Azithral", "Zithromax"], "Antibiotic", ["pneumonia", "typhoid"]],
  ["ciprofloxacin", "Ciprofloxacin", "Ciprofloxacin", ["Ciplox", "Cifran"], "Antibiotic", ["uti", "diarrhea"]],
  ["metformin", "Metformin", "Metformin HCl", ["Glycomet", "Obimet"], "Antidiabetic", ["diabetes"]],
  ["glimepiride", "Glimepiride", "Glimepiride", ["Amaryl", "Glimisave"], "Antidiabetic", ["diabetes"]],
  ["atorvastatin", "Atorvastatin", "Atorvastatin", ["Atorva", "Lipitor"], "Statin", ["heart-disease", "diabetes"]],
  ["amlodipine", "Amlodipine", "Amlodipine", ["Amlong", "Stamlo"], "Antihypertensive", ["hypertension", "heart-disease"]],
  ["losartan", "Losartan", "Losartan", ["Losar", "Repace"], "Antihypertensive", ["hypertension"]],
  ["omeprazole", "Omeprazole", "Omeprazole", ["Omez", "Prilosec"], "PPI", ["gerd", "gastritis"]],
  ["pantoprazole", "Pantoprazole", "Pantoprazole", ["Pan", "Pantocid"], "PPI", ["gerd", "gastritis"]],
  ["cetirizine", "Cetirizine", "Cetirizine", ["Zyrtec", "Alerid"], "Antihistamine", ["allergies", "common-cold"]],
  ["montelukast", "Montelukast", "Montelukast", ["Montair", "Singulair"], "Anti-asthma", ["asthma", "allergies"]],
  ["salbutamol", "Salbutamol", "Salbutamol", ["Asthalin", "Ventolin"], "Bronchodilator", ["asthma"]],
  ["levothyroxine", "Levothyroxine", "Levothyroxine", ["Thyronorm", "Eltroxin"], "Thyroid Hormone", ["thyroid"]],
  ["metronidazole", "Metronidazole", "Metronidazole", ["Flagyl", "Metrogyl"], "Antibiotic", ["diarrhea", "uti"]],
];

medicines.forEach(([slug, name, generic, brands, category, relatedDiseases], i) => {
  write("medicines", slug, {
    slug, name, genericName: generic, brandNames: brands, category,
    description: `${name} (${generic}) uses, dosage, side effects and safety information for patients in India.`,
    seo: seo(`${name}: Uses, Dosage, Side Effects | Doctors Hub`, `Complete guide to ${name} (${generic}). Learn uses, dosage, side effects, warnings, and drug interactions.`, [name, generic, ...brands, "medicine India"]),
    composition: `${generic} — consult product label for exact strength and excipients.`,
    uses: ["Pain and fever relief", "Inflammation reduction where applicable", "As prescribed by physician for indicated conditions"],
    howItWorks: `${generic} works through established pharmacological pathways to relieve symptoms or treat the underlying condition. Always follow your doctor's prescription.`,
    dosage: { adults: "As directed by physician. Typical adult dose varies by condition and formulation.", children: "Pediatric dosing must be weight-based. Consult pediatrician.", elderly: "May require dose adjustment in elderly patients.", notes: "Take with food if stomach upset occurs unless otherwise directed." },
    missedDose: "Take as soon as remembered unless near next dose. Do not double dose.",
    overdose: "Seek immediate medical attention. Contact nearest hospital or poison control.",
    sideEffects: ["Nausea", "Dizziness", "Skin rash (rare)", "Gastrointestinal discomfort"],
    warnings: ["Do not exceed prescribed dose", "Inform doctor of all medications", "Not for self-medication without consultation"],
    pregnancy: "Consult doctor before use during pregnancy. Risk-benefit assessment required.",
    breastfeeding: "Consult doctor. Some medicines pass into breast milk.",
    kidneyDisease: "Dose adjustment may be needed. Inform your nephrologist.",
    liverDisease: "Use with caution. Liver function monitoring may be required.",
    driving: "Avoid driving if dizziness or drowsiness occurs.",
    alcohol: "Avoid alcohol unless approved by doctor. May increase side effects.",
    foodInteraction: "Take as directed with or without food per physician advice.",
    drugInteractions: ["Other NSAIDs", "Blood thinners", "Certain antibiotics — inform your doctor of all medicines"],
    storage: "Store in cool, dry place below 25°C. Keep away from children.",
    alternatives: medicines.filter((m) => m[3] === category && m[0] !== slug).slice(0, 3).map((m) => m[0]),
    relatedDiseases,
    faqs: faqs([[`What is ${name} used for?`, `${name} is commonly used for conditions as prescribed by your doctor.`], [`Can I take ${name} without prescription?`, "Always consult a qualified doctor before starting any medication."]]),
    popular: i < 8, updatedAt: updated,
  });
});

const diseases = [
  ["diabetes", "Diabetes Mellitus", "Endocrine", ["metformin", "glimepiride"]],
  ["hypertension", "Hypertension (High Blood Pressure)", "Cardiovascular", ["amlodipine", "losartan"]],
  ["thyroid", "Thyroid Disorders", "Endocrine", ["levothyroxine"]],
  ["asthma", "Asthma", "Respiratory", ["salbutamol", "montelukast"]],
  ["gerd", "GERD (Acid Reflux)", "Gastrointestinal", ["omeprazole", "pantoprazole"]],
  ["arthritis", "Arthritis", "Musculoskeletal", ["ibuprofen"]],
  ["pneumonia", "Pneumonia", "Respiratory", ["amoxicillin", "azithromycin"]],
  ["uti", "Urinary Tract Infection", "Infectious", ["ciprofloxacin", "amoxicillin"]],
  ["anemia", "Anemia", "Hematology", []],
  ["migraine", "Migraine", "Neurological", ["paracetamol", "ibuprofen"]],
  ["depression", "Depression", "Mental Health", []],
  ["obesity", "Obesity", "Metabolic", ["metformin"]],
  ["heart-disease", "Heart Disease", "Cardiovascular", ["atorvastatin", "aspirin"]],
  ["gastritis", "Gastritis", "Gastrointestinal", ["pantoprazole", "omeprazole"]],
  ["allergies", "Allergies", "Immunology", ["cetirizine", "montelukast"]],
  ["fever", "Fever", "General", ["paracetamol", "dolo-650"]],
  ["common-cold", "Common Cold", "Respiratory", ["cetirizine", "paracetamol"]],
  ["diarrhea", "Diarrhea", "Gastrointestinal", ["metronidazole", "ciprofloxacin"]],
  ["typhoid", "Typhoid Fever", "Infectious", ["azithromycin", "ciprofloxacin"]],
  ["headache", "Headache Disorders", "Neurological", ["paracetamol", "ibuprofen"]],
];

diseases.forEach(([slug, name, category, relatedMedicines], i) => {
  write("diseases", slug, {
    slug, name, category,
    description: `Complete guide to ${name}: symptoms, causes, diagnosis, treatment, and prevention for patients in India.`,
    seo: seo(`${name}: Symptoms, Causes, Treatment | Doctors Hub`, `Learn about ${name} — symptoms, causes, risk factors, diagnosis, treatment options, and prevention tips.`, [name, category]),
    overview: `${name} is a common health condition affecting millions in India. Early diagnosis and proper management are essential for better outcomes.`,
    symptoms: ["Varies by individual and severity", "Persistent or worsening symptoms require medical evaluation", "Consult doctor for accurate diagnosis"],
    causes: ["Genetic predisposition", "Lifestyle factors", "Environmental triggers", "Underlying medical conditions"],
    riskFactors: ["Family history", "Age", "Sedentary lifestyle", "Poor diet", "Smoking and alcohol"],
    diagnosis: ["Medical history review", "Physical examination", "Blood tests and imaging as needed", "Specialist referral if required"],
    treatment: ["Lifestyle modifications", "Medications as prescribed", "Regular monitoring", "Specialist care for complex cases"],
    homeCare: ["Follow prescribed treatment plan", "Maintain healthy diet", "Adequate rest and hydration", "Monitor symptoms"],
    prevention: ["Regular health checkups", "Balanced diet and exercise", "Avoid known triggers", "Vaccination where applicable"],
    complications: ["Progression if untreated", "Organ damage in chronic cases", "Reduced quality of life"],
    emergencyWarningSigns: ["Severe chest pain", "Difficulty breathing", "Sudden confusion", "High fever with rigors"],
    relatedMedicines,
    faqs: faqs([[`What causes ${name}?`, "Multiple factors including genetics, lifestyle, and environment contribute."], [`Is ${name} curable?`, "Many conditions are manageable with proper treatment. Consult your doctor for prognosis."]]),
    popular: i < 8, updatedAt: updated,
  });
});

const symptoms = [
  ["headache", "Headache", "Neurological", ["migraine", "hypertension"]],
  ["fever", "Fever", "General", ["fever", "typhoid", "pneumonia"]],
  ["cough", "Cough", "Respiratory", ["asthma", "pneumonia", "common-cold"]],
  ["chest-pain", "Chest Pain", "Cardiovascular", ["heart-disease", "asthma"]],
  ["fatigue", "Fatigue", "General", ["anemia", "thyroid", "diabetes"]],
  ["nausea", "Nausea", "Gastrointestinal", ["gerd", "gastritis"]],
  ["shortness-of-breath", "Shortness of Breath", "Respiratory", ["asthma", "heart-disease", "pneumonia"]],
  ["abdominal-pain", "Abdominal Pain", "Gastrointestinal", ["gastritis", "gerd", "diarrhea"]],
  ["dizziness", "Dizziness", "Neurological", ["hypertension", "anemia"]],
  ["skin-rash", "Skin Rash", "Dermatology", ["allergies"]],
  ["joint-pain", "Joint Pain", "Musculoskeletal", ["arthritis"]],
  ["back-pain", "Back Pain", "Musculoskeletal", ["arthritis"]],
  ["weight-loss", "Unexplained Weight Loss", "General", ["diabetes", "thyroid"]],
  ["frequent-urination", "Frequent Urination", "Urological", ["diabetes", "uti"]],
  ["blurred-vision", "Blurred Vision", "Ophthalmology", ["diabetes", "hypertension"]],
];

symptoms.forEach(([slug, name, category, relatedDiseases], i) => {
  write("symptoms", slug, {
    slug, name, category,
    description: `${name} — possible causes, home remedies, and when to see a doctor.`,
    seo: seo(`${name}: Causes, Remedies, When to See Doctor | Doctors Hub`, `Understand ${name}: common causes, emergency signs, home remedies, and when to consult a doctor.`, [name]),
    possibleCauses: ["Infection", "Chronic disease", "Stress and lifestyle", "Medication side effects", "Injury or trauma"],
    emergencySymptoms: ["Sudden severe onset", "Associated chest pain or breathing difficulty", "Loss of consciousness", "High fever with confusion"],
    homeRemedies: ["Adequate rest", "Hydration", "Over-the-counter remedies only if previously advised by doctor", "Monitor and document symptoms"],
    whenToVisitDoctor: ["Symptoms persist beyond 3-5 days", "Worsening severity", "New associated symptoms", "High-risk individuals (elderly, pregnant, chronic illness)"],
    relatedDiseases,
    faqs: faqs([[`When should I worry about ${name.toLowerCase()}?`, "Seek immediate care for severe, sudden, or worsening symptoms."]]),
    popular: i < 6, updatedAt: updated,
  });
});

const tests = [
  ["cbc", "Complete Blood Count (CBC)", "Hematology"],
  ["blood-sugar-fasting", "Fasting Blood Sugar", "Diabetes"],
  ["hba1c", "HbA1c (Glycated Hemoglobin)", "Diabetes"],
  ["lipid-profile", "Lipid Profile", "Cardiology"],
  ["liver-function-test", "Liver Function Test (LFT)", "Hepatology"],
  ["kidney-function-test", "Kidney Function Test (KFT)", "Nephrology"],
  ["thyroid-profile", "Thyroid Profile (T3, T4, TSH)", "Endocrine"],
  ["urine-routine", "Urine Routine Examination", "Urology"],
  ["ecg", "Electrocardiogram (ECG)", "Cardiology"],
  ["chest-xray", "Chest X-Ray", "Radiology"],
  ["vitamin-d", "Vitamin D Test", "Nutrition"],
  ["vitamin-b12", "Vitamin B12 Test", "Nutrition"],
  ["crp", "C-Reactive Protein (CRP)", "Inflammation"],
  ["esr", "Erythrocyte Sedimentation Rate (ESR)", "Inflammation"],
  ["covid-rtpcr", "COVID-19 RT-PCR", "Infectious Disease"],
];

tests.forEach(([slug, name, category], i) => {
  write("tests", slug, {
    slug, name, category,
    description: `${name} — purpose, preparation, procedure, normal range, and result interpretation.`,
    seo: seo(`${name}: Purpose, Normal Range, Preparation | Doctors Hub`, `Complete guide to ${name} test in India. Learn preparation, procedure, normal values, and what results mean.`, [name, "lab test India"]),
    overview: `${name} is a commonly ordered diagnostic test used to evaluate specific aspects of your health.`,
    purpose: ["Screening for disease", "Monitoring existing conditions", "Evaluating treatment response", "Pre-operative assessment"],
    preparation: ["Follow fasting instructions if required (typically 8-12 hours)", "Inform lab about current medications", "Stay hydrated unless told otherwise", "Bring previous reports if available"],
    procedure: ["Blood/urine sample collection at certified lab", "Non-invasive for imaging tests", "Results typically available within 24-48 hours"],
    normalRange: "Reference ranges vary by lab, age, and gender. Always interpret with your doctor.",
    highMeans: ["Possible infection or inflammation", "Organ dysfunction", "Nutritional deficiency or excess", "Requires clinical correlation"],
    lowMeans: ["Possible deficiency state", "Bone marrow issues (for blood tests)", "Malabsorption", "Requires clinical correlation"],
    interpretation: ["Compare with previous results for trends", "Single abnormal value may not indicate disease", "Doctor will correlate with symptoms and examination"],
    faqs: faqs([[`Do I need to fast for ${name}?`, "Check specific test requirements. Fasting tests typically need 8-12 hours."], [`How long for ${name} results?`, "Most results available within 24-48 hours at standard labs."]]),
    popular: i < 8, updatedAt: updated,
  });
});

const firstAid = [
  ["burn", "Burns First Aid", "severe"],
  ["choking", "Choking First Aid", "severe"],
  ["cpr", "CPR (Cardiopulmonary Resuscitation)", "severe"],
  ["snake-bite", "Snake Bite First Aid", "severe"],
  ["bleeding", "Severe Bleeding Control", "severe"],
  ["fracture", "Fracture First Aid", "moderate"],
  ["heatstroke", "Heatstroke First Aid", "severe"],
  ["seizure", "Seizure First Aid", "moderate"],
  ["nosebleed", "Nosebleed First Aid", "minor"],
  ["poisoning", "Poisoning First Aid", "severe"],
];

firstAid.forEach(([slug, name, severity], i) => {
  write("first-aid", slug, {
    slug, name, severity,
    description: `Step-by-step ${name.toLowerCase()} guide with do's, don'ts, and emergency numbers for India.`,
    seo: seo(`${name} Guide | Doctors Hub`, `Learn ${name.toLowerCase()} steps, precautions, and when to call emergency services in India.`, [name, "first aid India"]),
    steps: [
      { title: "Assess the situation", description: "Ensure scene safety. Check responsiveness and breathing." },
      { title: "Call for help", description: "Dial 112 or 102 for ambulance. Provide clear location details." },
      { title: "Provide immediate care", description: "Follow specific first aid steps for this emergency while waiting for professionals." },
      { title: "Monitor continuously", description: "Keep monitoring vital signs until emergency services arrive." },
    ],
    dos: ["Stay calm", "Call emergency services immediately for severe cases", "Follow standard first aid protocols", "Keep victim comfortable and warm"],
    donts: ["Do not give food or water if unconscious", "Do not move victim if spinal injury suspected", "Do not apply home remedies on open wounds", "Do not delay calling ambulance"],
    emergencyNumbers: [
      { label: "National Emergency", number: "112" },
      { label: "Ambulance", number: "102" },
      { label: "Police", number: "100" },
    ],
    faqs: faqs([[`When should I call ambulance for ${name.toLowerCase()}?`, "Call immediately for severe cases, unconsciousness, or difficulty breathing."]]),
    popular: i < 6, updatedAt: updated,
  });
});

const articles = [
  ["healthy-diet-india", "Healthy Diet Guide for Indians", "Nutrition", ["diet", "nutrition", "wellness"]],
  ["diabetes-management", "Managing Diabetes: A Complete Guide", "Diabetes", ["diabetes", "blood sugar", "lifestyle"]],
  ["hypertension-lifestyle", "Lifestyle Changes for High Blood Pressure", "Heart Health", ["hypertension", "blood pressure"]],
  ["yoga-health-benefits", "Yoga and Its Health Benefits", "Wellness", ["yoga", "exercise", "mental health"]],
  ["monsoon-health-tips", "Monsoon Health Tips for India", "Seasonal", ["monsoon", "infections", "prevention"]],
  ["child-immunization", "Child Immunization Schedule in India", "Pediatrics", ["vaccination", "children", "IAP"]],
  ["mental-health-awareness", "Mental Health Awareness in India", "Mental Health", ["depression", "anxiety", "wellness"]],
  ["sleep-hygiene", "Sleep Hygiene: Tips for Better Sleep", "Wellness", ["sleep", "insomnia", "health"]],
  ["heart-healthy-foods", "Heart Healthy Foods for Indians", "Nutrition", ["heart", "diet", "cholesterol"]],
  ["thyroid-diet-guide", "Thyroid Diet: What to Eat and Avoid", "Endocrine", ["thyroid", "diet", "hypothyroidism"]],
  ["exercise-beginners", "Exercise Guide for Beginners", "Fitness", ["exercise", "fitness", "weight loss"]],
  ["stress-management", "Stress Management Techniques", "Mental Health", ["stress", "anxiety", "meditation"]],
  ["women-health-screening", "Essential Health Screenings for Women", "Women Health", ["screening", "women", "prevention"]],
  ["men-health-checkup", "Health Checkups Every Man Should Get", "Men Health", ["screening", "men", "prevention"]],
  ["ayurveda-modern-medicine", "Ayurveda and Modern Medicine: What You Should Know", "Alternative Medicine", ["ayurveda", "integrative", "wellness"]],
  ["covid-prevention", "COVID-19 Prevention and Precautions", "Infectious Disease", ["covid", "prevention", "vaccination"]],
  ["vitamin-d-deficiency", "Vitamin D Deficiency in India", "Nutrition", ["vitamin D", "deficiency", "sunlight"]],
  ["kidney-stone-prevention", "Kidney Stone Prevention Tips", "Urology", ["kidney", "stones", "hydration"]],
  ["pcos-guide", "PCOS: Symptoms, Diagnosis and Management", "Women Health", ["PCOS", "hormones", "fertility"]],
  ["senior-citizen-health", "Healthcare Guide for Senior Citizens", "Geriatrics", ["elderly", "care", "prevention"]],
];

articles.forEach(([slug, name, category, tags], i) => {
  const content = `# ${name}\n\nMaintaining good health requires awareness, preventive care, and informed decisions. This comprehensive guide covers essential information for Indian readers.\n\n## Key Points\n\n- Regular health checkups are essential\n- Balanced nutrition and physical activity form the foundation of wellness\n- Early detection of health issues leads to better outcomes\n- Always consult qualified healthcare professionals for personalized advice\n\n## Understanding the Topic\n\n${name} is increasingly relevant for India's diverse population. Urbanization, changing diets, and sedentary lifestyles have contributed to rising health concerns. Understanding the fundamentals helps you make better health decisions.\n\n## Practical Recommendations\n\n1. Schedule regular preventive health screenings\n2. Maintain a balanced diet rich in vegetables, whole grains, and lean protein\n3. Exercise at least 150 minutes per week\n4. Manage stress through mindfulness, yoga, or meditation\n5. Stay hydrated and get adequate sleep\n\n## When to See a Doctor\n\nConsult your healthcare provider if you experience persistent symptoms, sudden changes in health, or have risk factors for chronic disease. Do not rely solely on online information for diagnosis or treatment.\n\n## Conclusion\n\nYour health is your most valuable asset. Stay informed, stay proactive, and partner with qualified medical professionals for the best outcomes.`;
  write("articles", slug, {
    slug, name, category, tags,
    description: `${name} — expert-reviewed health information for Indian readers.`,
    seo: seo(`${name} | Doctors Hub`, `Read our comprehensive guide on ${name.toLowerCase()}. Evidence-based health information for India.`, tags),
    content,
    author: "Doctors Hub Medical Team",
    publishedAt: "2026-06-15",
    readTime: 5,
    faqs: faqs([["Is this information a substitute for medical advice?", "No. Always consult a qualified healthcare provider."]]),
    trending: i < 6, popular: i < 8, updatedAt: updated,
  });
});

const calculators = [
  ["bmi", "BMI Calculator", "Body Metrics", "Body Mass Index"],
  ["bmr", "BMR Calculator", "Body Metrics", "Basal Metabolic Rate"],
  ["calorie", "Calorie Calculator", "Nutrition", "Daily Calorie Needs"],
  ["water-intake", "Water Intake Calculator", "Nutrition", "Daily Water Requirement"],
  ["pregnancy-due-date", "Pregnancy Due Date Calculator", "Pregnancy", "Estimated Due Date"],
  ["ovulation", "Ovulation Calculator", "Pregnancy", "Fertile Window"],
  ["body-fat", "Body Fat Calculator", "Body Metrics", "Body Fat Percentage"],
  ["ideal-weight", "Ideal Weight Calculator", "Body Metrics", "Healthy Weight Range"],
  ["heart-rate", "Target Heart Rate Calculator", "Fitness", "Exercise Heart Rate Zones"],
  ["blood-pressure-guide", "Blood Pressure Guide", "Cardiovascular", "BP Category Reference"],
  ["diabetes-risk", "Diabetes Risk Calculator", "Diabetes", "Type 2 Diabetes Risk Score"],
  ["child-growth", "Child Growth Calculator", "Pediatrics", "Height/Weight Percentile"],
  ["drug-dose", "Drug Dose Calculator", "Clinical", "Weight-Based Dosing"],
  ["age", "Age Calculator", "General", "Exact Age Calculation"],
  ["pregnancy-week", "Pregnancy Week Calculator", "Pregnancy", "Current Gestation Week"],
];

calculators.forEach(([slug, name, category, type], i) => {
  write("calculators", slug, {
    slug, name, category, type,
    description: `Free online ${name.toLowerCase()} — instant results, medically referenced formulas.`,
    seo: seo(`${name} | Free Online Tool | Doctors Hub`, `Use our free ${name.toLowerCase()}. Instant, accurate, client-side calculation for health monitoring.`, [name, "calculator", "free"]),
    inputs: slug === "bmi"
      ? [
          { id: "weight", label: "Weight", type: "number", unit: "kg", min: 1, max: 500, required: true },
          { id: "height", label: "Height", type: "number", unit: "cm", min: 50, max: 300, required: true },
        ]
      : slug === "bmr"
      ? [
          { id: "weight", label: "Weight (kg)", type: "number", min: 1, required: true },
          { id: "height", label: "Height (cm)", type: "number", min: 50, required: true },
          { id: "age", label: "Age (years)", type: "number", min: 1, max: 120, required: true },
          { id: "gender", label: "Gender", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], required: true },
        ]
      : [{ id: "value", label: "Input Value", type: "number", required: true }],
    formula: "Standard medically referenced formula applied client-side.",
    interpretation: ["Results are estimates for educational purposes", "Consult healthcare provider for clinical decisions"],
    faqs: faqs([[`How accurate is the ${name}?`, "Uses standard formulas. Individual variation exists — consult doctor for clinical use."]]),
    popular: i < 8, updatedAt: updated,
  });
});

console.log("Generated all sample content successfully!");
