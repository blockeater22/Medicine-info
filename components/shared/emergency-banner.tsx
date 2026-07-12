import { Phone } from "lucide-react";
import { EMERGENCY_NUMBERS } from "@/lib/constants";

export function EmergencyBanner() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20" role="alert">
      <div className="flex items-start gap-3">
        <Phone className="h-5 w-5 text-red-600 shrink-0 mt-0.5 animate-pulse" aria-hidden="true" />
        <div>
          <p className="font-semibold text-red-800 dark:text-red-200">Emergency? Call Now</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {EMERGENCY_NUMBERS.slice(0, 4).map((num) => (
              <a
                key={num.number}
                href={`tel:${num.number}`}
                className="text-sm font-medium text-red-700 dark:text-red-300 hover:underline"
              >
                {num.label}: {num.number}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
