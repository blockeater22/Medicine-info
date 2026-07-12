import type { Medicine } from "@/types";

const RX_PATTERNS = /antibiotic|antiviral|antifungal|antidepressant|antihypertensive|statin|insulin|warfarin|heparin|opioid|benzodiazepine|antipsychotic|chemotherapy|prescription/i;
const OTC_PATTERNS = /paracetamol|acetaminophen|ibuprofen|cetirizine|loratadine|antacid|otc|pain relief|analgesic|antipyretic|crocin|dolo|calpol/i;

function inferRxStatus(medicine: Medicine): "Prescription" | "OTC" | "Ask your doctor" {
  const blob = [medicine.category, medicine.genericName, ...medicine.uses, ...medicine.warnings].join(" ");
  if (RX_PATTERNS.test(blob)) return "Prescription";
  if (OTC_PATTERNS.test(blob)) return "OTC";
  return "Ask your doctor";
}

interface QuickReferenceBoxProps {
  medicine: Medicine;
  className?: string;
}

export function QuickReferenceBox({ medicine, className }: QuickReferenceBoxProps) {
  const rxStatus = inferRxStatus(medicine);

  return (
    <aside
      className={`rounded-xl border bg-muted/40 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm ${className ?? ""}`}
      aria-label="Quick reference"
    >
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">Drug class</p>
        <p className="font-medium mt-0.5">{medicine.category || "See composition"}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">Rx / OTC</p>
        <p className="font-medium mt-0.5">{rxStatus}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">Generic</p>
        <p className="font-medium mt-0.5">{medicine.genericName}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">Brands (India)</p>
        <p className="font-medium mt-0.5 line-clamp-2">{medicine.brandNames.join(", ") || "—"}</p>
      </div>
      {medicine.pregnancy && (
        <div className="col-span-2 sm:col-span-4 border-t pt-3 text-muted-foreground">
          <span className="font-medium text-foreground">Pregnancy:</span> {medicine.pregnancy}
        </div>
      )}
    </aside>
  );
}
