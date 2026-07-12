/** Accurate P0 overrides for website-format medicine JSON with generic/wrong content. */

export type MedicineFix = {
  category: string;
  uses: string[];
  howItWorks: string;
  sideEffects?: string[];
  drugInteractions?: string[];
  faqs?: { question: string; answer: string }[];
  indiaNote?: string;
};

export const MEDICINE_FIXES: Record<string, MedicineFix> = {
  amoxicillin: {
    category: "Antibiotic",
    uses: [
      "Bacterial infections such as respiratory tract infections, otitis media, and urinary tract infections",
      "Helicobacter pylori eradication regimens (combination therapy)",
      "Skin and soft tissue bacterial infections when prescribed by a doctor",
    ],
    howItWorks:
      "Amoxicillin is a penicillin-type antibiotic. It works by inhibiting bacterial cell wall synthesis, which stops bacteria from multiplying. It is effective against many gram-positive and some gram-negative organisms.",
    sideEffects: ["Nausea", "Diarrhoea", "Skin rash", "Abdominal discomfort"],
    drugInteractions: ["Methotrexate", "Warfarin", "Allopurinol", "Oral contraceptives (may reduce efficacy — use backup contraception)"],
    faqs: [
      { question: "Is amoxicillin used for fever or pain?", answer: "No. Amoxicillin treats bacterial infections. It does not reduce fever or pain like paracetamol." },
      { question: "Can I stop amoxicillin when I feel better?", answer: "Complete the full course as prescribed unless your doctor advises otherwise. Stopping early can cause relapse and antibiotic resistance." },
    ],
    indiaNote: "Common Indian brands include Mox and Novamox. Available only on prescription in India.",
  },
  paracetamol: {
    category: "Analgesic / Antipyretic",
    uses: ["Mild to moderate pain (headache, body ache, toothache)", "Fever reduction", "Post-vaccination fever in children as advised by a doctor"],
    howItWorks:
      "Paracetamol (acetaminophen) acts centrally to reduce pain and fever. It inhibits prostaglandin synthesis in the brain and is one of the safest OTC analgesics when used at recommended doses.",
    sideEffects: ["Rare nausea", "Rare skin rash", "Liver damage with overdose"],
    faqs: [
      { question: "What is the difference between paracetamol and ibuprofen?", answer: "Paracetamol mainly reduces pain and fever with less stomach irritation. Ibuprofen also reduces inflammation. Do not combine without medical advice." },
      { question: "What is the maximum daily dose for adults in India?", answer: "Do not exceed 4 g (4000 mg) per day for healthy adults unless directed by a doctor. Lower limits apply in liver disease." },
    ],
    indiaNote: "Widely sold OTC in India as Crocin, Dolo 650, and Calpol.",
  },
  "crocin-650": {
    category: "Analgesic / Antipyretic",
    uses: ["Fever", "Headache and body ache", "Mild to moderate pain"],
    howItWorks: "Crocin 650 contains paracetamol 650 mg. It reduces fever and relieves pain by acting on the brain's pain and temperature centres.",
    indiaNote: "Crocin is a leading paracetamol brand in India manufactured by GSK. This page is informational, not promotional.",
  },
  "dolo-650": {
    category: "Analgesic / Antipyretic",
    uses: ["Fever", "Headache", "Musculoskeletal pain"],
    howItWorks: "Dolo 650 contains paracetamol 650 mg per tablet. It is used for symptomatic relief of pain and fever.",
    indiaNote: "Dolo 650 by Micro Labs is among the most prescribed paracetamol brands in India.",
  },
  metformin: {
    category: "Antidiabetic",
    uses: ["Type 2 diabetes mellitus (first-line therapy in many patients)", "Polycystic ovary syndrome (PCOS) — off-label use under specialist care", "Prediabetes in selected patients per clinician guidance"],
    howItWorks:
      "Metformin reduces glucose production in the liver, improves insulin sensitivity in muscle tissue, and may reduce intestinal glucose absorption. It does not cause hypoglycaemia when used alone.",
    sideEffects: ["Nausea", "Diarrhoea", "Abdominal bloating", "Metallic taste (usually improves with time)"],
    faqs: [
      { question: "Should metformin be taken with food?", answer: "Yes. Taking it with meals reduces stomach upset. Extended-release forms may have different timing — follow your prescription." },
    ],
    indiaNote: "Common brands in India include Glycomet and Obimet.",
  },
  atorvastatin: {
    category: "Statin (Lipid-lowering)",
    uses: ["High LDL cholesterol and hyperlipidaemia", "Cardiovascular risk reduction in patients with coronary artery disease or diabetes", "Primary prevention in high-risk adults as prescribed"],
    howItWorks:
      "Atorvastatin inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis. This lowers LDL cholesterol and stabilises arterial plaques over time.",
    sideEffects: ["Muscle aches", "Elevated liver enzymes", "Headache", "Rare rhabdomyolysis — report severe muscle pain immediately"],
  },
  amlodipine: {
    category: "Calcium Channel Blocker",
    uses: ["Hypertension (high blood pressure)", "Chronic stable angina", "Coronary artery disease (symptom management)"],
    howItWorks:
      "Amlodipine blocks calcium entry into vascular smooth muscle and cardiac cells, causing vasodilation and reduced peripheral resistance, which lowers blood pressure.",
    sideEffects: ["Ankle swelling (oedema)", "Flushing", "Headache", "Dizziness"],
  },
  losartan: {
    category: "ARB (Antihypertensive)",
    uses: ["Hypertension", "Diabetic nephropathy with proteinuria", "Heart failure with reduced ejection fraction (selected patients)"],
    howItWorks:
      "Losartan blocks angiotensin II type 1 receptors, relaxing blood vessels and reducing aldosterone effects, which lowers blood pressure and protects kidneys.",
    sideEffects: ["Dizziness", "Hyperkalaemia (monitor potassium)", "Fatigue", "Cough (less common than with ACE inhibitors)"],
  },
  cetirizine: {
    category: "Antihistamine",
    uses: ["Allergic rhinitis (hay fever)", "Urticaria (hives) and allergic skin itching", "Seasonal and perennial allergies"],
    howItWorks:
      "Cetirizine is a second-generation H1-antihistamine. It blocks histamine receptors, reducing allergy symptoms with minimal sedative effect compared to first-generation antihistamines.",
    sideEffects: ["Drowsiness (mild in some patients)", "Dry mouth", "Headache", "Fatigue"],
  },
  levothyroxine: {
    category: "Thyroid Hormone",
    uses: ["Hypothyroidism (underactive thyroid)", "Thyroid hormone replacement after thyroidectomy", "TSH suppression in thyroid cancer (specialist-directed)"],
    howItWorks:
      "Levothyroxine is synthetic T4 (thyroxine). It replaces deficient thyroid hormone, normalising metabolism, energy levels, and TSH when dosed correctly.",
    sideEffects: ["Palpitations if overdosed", "Weight loss", "Insomnia", "Tremor — usually indicate dose adjustment needed"],
    faqs: [
      { question: "When should I take levothyroxine?", answer: "Take on an empty stomach, typically 30–60 minutes before breakfast, with water. Avoid calcium and iron supplements within 4 hours." },
    ],
  },
  montelukast: {
    category: "Leukotriene Receptor Antagonist",
    uses: ["Asthma maintenance therapy", "Exercise-induced bronchospasm prevention", "Allergic rhinitis (seasonal)"],
    howItWorks:
      "Montelukast blocks leukotriene receptors in the airways, reducing inflammation, bronchoconstriction, and mucus production triggered by allergens or exercise.",
    sideEffects: ["Headache", "Abdominal pain", "Mood or behaviour changes (report to doctor)", "Upper respiratory symptoms"],
  },
  pantoprazole: {
    category: "Proton Pump Inhibitor (PPI)",
    uses: ["Gastro-oesophageal reflux disease (GERD)", "Peptic ulcer disease", "Erosive oesophagitis and hyperacidity"],
    howItWorks:
      "Pantoprazole irreversibly inhibits the gastric proton pump (H+/K+-ATPase), reducing stomach acid secretion and allowing mucosal healing.",
    sideEffects: ["Headache", "Diarrhoea", "Abdominal pain", "Long-term use may affect B12 and magnesium — review with doctor"],
  },
  salbutamol: {
    category: "Short-Acting Beta-2 Agonist (Bronchodilator)",
    uses: ["Acute asthma symptoms and bronchospasm", "COPD rescue inhaler use", "Exercise-induced bronchospasm (pre-treatment)"],
    howItWorks:
      "Salbutamol stimulates beta-2 receptors in bronchial smooth muscle, causing rapid bronchodilation and relief of wheezing and shortness of breath within minutes.",
    sideEffects: ["Tremor", "Palpitations", "Headache", "Muscle cramps with frequent use"],
    faqs: [
      { question: "How often can I use my salbutamol inhaler?", answer: "Follow your action plan. Needing rescue inhaler more than twice a week may mean your asthma is uncontrolled — see your doctor." },
    ],
    indiaNote: "Available as inhalers and nebulisation solutions; common in asthma care across India.",
  },
};

export const GENERIC_MEDICINE_MARKERS = {
  uses: "Pain and fever relief",
  howItWorks: "established pharmacological pathways",
};
