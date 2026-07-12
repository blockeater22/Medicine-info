import { ContextualText } from "@/components/shared/contextual-text";

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

export function ContentSection({ title, children, id }: ContentSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
      <div className="prose-medical">{children}</div>
    </section>
  );
}

export function ContentList({
  items,
  contextual,
  excludeHref,
  maxLinks = 4,
}: {
  items: string[];
  contextual?: boolean;
  excludeHref?: string;
  maxLinks?: number;
}) {
  if (!items.length) return null;
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item, i) => (
        <li key={i}>
          {contextual ? (
            <ContextualText text={item} excludeHref={excludeHref} maxLinks={maxLinks} />
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ sections }: { sections: { id: string; title: string }[] }) {
  if (!sections.length) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-xl border p-4 bg-muted/30 sticky top-24">
      <h3 className="font-semibold text-sm mb-3">On this page</h3>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
