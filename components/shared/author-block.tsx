import Link from "next/link";
import { Calendar, UserCheck } from "lucide-react";
import { getTeamMember } from "@/lib/team";
import { resolveAuthorship } from "@/lib/content-authorship";
import { formatDate } from "@/utils/helpers";
import type { AuthorshipInfo } from "@/types";

interface AuthorBlockProps {
  authoredBy?: AuthorshipInfo;
  className?: string;
}

export function AuthorBlock({ authoredBy, className }: AuthorBlockProps) {
  const auth = resolveAuthorship(authoredBy);
  const author = getTeamMember(auth.authorId);
  const reviewer = getTeamMember(auth.reviewerId);

  if (!author || !reviewer) return null;

  return (
    <div
      className={`rounded-xl border bg-muted/30 p-4 text-sm space-y-2 ${className ?? ""}`}
      aria-label="Medical authorship"
    >
      <p className="flex items-start gap-2 text-muted-foreground">
        <UserCheck className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          <span className="font-medium text-foreground">Written by </span>
          <Link href={`/medical-team/${author.slug}`} className="text-primary hover:underline">
            {author.name}, {author.credentials}
          </Link>
          {" · "}
          <span className="font-medium text-foreground">Reviewed by </span>
          <Link href={`/medical-team/${reviewer.slug}`} className="text-primary hover:underline">
            {reviewer.name}, {reviewer.credentials}
          </Link>
        </span>
      </p>
      <p className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <span className="font-medium text-foreground">Last reviewed:</span> {formatDate(auth.lastReviewed)}
        </span>
      </p>
    </div>
  );
}
