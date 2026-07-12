import Link from "next/link";
import { Calendar, FileText } from "lucide-react";
import { resolveContentReview } from "@/lib/content-authorship";
import { formatDate } from "@/utils/helpers";
import type { ContentReviewInfo } from "@/types";

interface EditorialAttributionProps {
  contentReview?: ContentReviewInfo;
  updatedAt?: string;
  className?: string;
}

export function EditorialAttribution({ contentReview, updatedAt, className }: EditorialAttributionProps) {
  const review = resolveContentReview(contentReview, updatedAt);
  const displayDate = review.lastReviewed || updatedAt;

  return (
    <aside
      className={`rounded-xl border bg-muted/30 p-4 text-sm space-y-2 ${className ?? ""}`}
      aria-label="Editorial information"
    >
      {displayDate && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">Last updated:</span> {formatDate(displayDate)}
          </span>
        </p>
      )}
      <p className="flex items-start gap-2 text-muted-foreground">
        <FileText className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Educational content prepared using our{" "}
          <Link href="/content-review-process" className="text-primary hover:underline">
            research and review process
          </Link>
          . Not medical advice — see our{" "}
          <Link href="/medical-disclaimer" className="text-primary hover:underline">
            medical disclaimer
          </Link>
          .
        </span>
      </p>
    </aside>
  );
}
