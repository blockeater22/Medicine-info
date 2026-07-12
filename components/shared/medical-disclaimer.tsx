import { AlertTriangle } from "lucide-react";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";

export function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20"
      role="note"
      aria-label="Medical disclaimer"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Medical Disclaimer</p>
          <p className={compact ? "text-xs text-amber-700 dark:text-amber-300 mt-1" : "text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed"}>
            {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </aside>
  );
}
