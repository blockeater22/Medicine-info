import type { DrugClass } from "@/types";
import { resolveContentReview } from "@/lib/content-authorship";

export function coerceDrugClass(data: unknown): DrugClass {
  const d = data as DrugClass & { authoredBy?: { lastReviewed?: string } };
  const legacy = d.authoredBy?.lastReviewed;
  return {
    ...d,
    contentReview: resolveContentReview(d.contentReview ?? (legacy ? { lastReviewed: legacy } : undefined), d.updatedAt),
    authoredBy: undefined,
  };
}
