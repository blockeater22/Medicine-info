import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import type { SourceItem } from "@/types";

interface ContentMetaProps {
  updatedAt?: string;
  sources?: SourceItem[];
  author?: string;
}

export function ContentMeta({ updatedAt, sources, author }: ContentMetaProps) {
  if (!updatedAt && !sources?.length && !author) return null;

  return (
    <aside className="rounded-xl border bg-muted/30 p-4 text-sm space-y-3" aria-label="Content metadata">
      {author && (
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Author:</span> {author}
        </p>
      )}
      {updatedAt && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-medium text-foreground">Last updated:</span> {formatDate(updatedAt)}
          </span>
        </p>
      )}
      {sources && sources.length > 0 && (
        <div>
          <p className="font-medium text-foreground mb-2">Sources</p>
          <ul className="space-y-1.5">
            {sources.map((source, i) => (
              <li key={i}>
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {source.name}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
