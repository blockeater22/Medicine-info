import Link from "next/link";
import { linkContextualText } from "@/lib/contextual-links";

interface ContextualTextProps {
  text: string;
  excludeHref?: string;
  maxLinks?: number;
  className?: string;
}

export function ContextualText({ text, excludeHref, maxLinks = 4, className }: ContextualTextProps) {
  const segments = linkContextualText(text, { excludeHref, maxLinks });

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.type === "link" ? (
          <Link key={index} href={segment.href} className="text-primary hover:underline">
            {segment.value}
          </Link>
        ) : (
          <span key={index}>{segment.value}</span>
        )
      )}
    </span>
  );
}
