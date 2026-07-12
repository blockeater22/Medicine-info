import {
  getAllDiseases,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
} from "@/lib/data";

export type TextSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

type EntityPhrase = {
  label: string;
  href: string;
};

const MIN_PHRASE_LENGTH = 4;
let phraseIndex: EntityPhrase[] | null = null;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugPhrase(slug: string): string {
  return slug.replace(/-/g, " ");
}

function buildPhraseIndex(): EntityPhrase[] {
  const phrases = new Map<string, string>();

  const add = (label: string | undefined, href: string) => {
    const trimmed = label?.trim();
    if (!trimmed || trimmed.length < MIN_PHRASE_LENGTH) return;
    const key = trimmed.toLowerCase();
    if (!phrases.has(key)) phrases.set(key, href);
  };

  for (const med of getAllMedicines()) {
    const href = `/medicine/${med.slug}`;
    add(med.name, href);
    add(med.genericName, href);
    for (const brand of med.brandNames ?? []) add(brand, href);
    add(slugPhrase(med.slug), href);
  }

  for (const disease of getAllDiseases()) {
    const href = `/disease/${disease.slug}`;
    add(disease.name, href);
    add(slugPhrase(disease.slug), href);
  }

  for (const symptom of getAllSymptoms()) {
    const href = `/symptom/${symptom.slug}`;
    add(symptom.name, href);
    add(slugPhrase(symptom.slug), href);
  }

  for (const test of getAllLabTests()) {
    const href = `/lab-test/${test.slug}`;
    add(test.name, href);
    add(slugPhrase(test.slug), href);
  }

  return [...phrases.entries()]
    .map(([label, href]) => ({ label, href }))
    .sort((a, b) => b.label.length - a.label.length);
}

function getPhraseIndex(): EntityPhrase[] {
  if (!phraseIndex) phraseIndex = buildPhraseIndex();
  return phraseIndex;
}

/** First-mention entity links in body copy (blueprint §5.3 — max 4). */
export function linkContextualText(
  text: string,
  options: { excludeHref?: string; maxLinks?: number } = {}
): TextSegment[] {
  if (!text) return [{ type: "text", value: "" }];

  const maxLinks = options.maxLinks ?? 4;
  const excludeHref = options.excludeHref;
  const linkedHrefs = new Set<string>();
  let linkCount = 0;

  const segments: TextSegment[] = [];
  let cursor = 0;

  while (cursor < text.length && linkCount < maxLinks) {
    let best: { start: number; end: number; phrase: EntityPhrase } | null = null;

    for (const phrase of getPhraseIndex()) {
      if (linkedHrefs.has(phrase.href)) continue;
      if (excludeHref && phrase.href === excludeHref) continue;

      const pattern = new RegExp(`\\b${escapeRegex(phrase.label)}\\b`, "i");
      pattern.lastIndex = cursor;
      const match = pattern.exec(text);
      if (!match || match.index < cursor) continue;

      const start = match.index;
      const end = start + match[0].length;
      if (!best || start < best.start || (start === best.start && match[0].length > best.end - best.start)) {
        best = { start, end, phrase };
      }
    }

    if (!best) break;

    if (best.start > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, best.start) });
    }

    segments.push({
      type: "link",
      value: text.slice(best.start, best.end),
      href: best.phrase.href,
    });

    linkedHrefs.add(best.phrase.href);
    linkCount += 1;
    cursor = best.end;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }

  return segments.length ? segments : [{ type: "text", value: text }];
}

/** Outbound hrefs for audit graph (same rules as rendered contextual links). */
export function getContextualLinkHrefs(
  texts: string[],
  options: { excludeHref?: string; maxLinks?: number } = {}
): string[] {
  const maxLinks = options.maxLinks ?? 4;
  const joined = texts.filter(Boolean).join("\n");
  const segments = linkContextualText(joined, { ...options, maxLinks });
  return segments.filter((s): s is Extract<TextSegment, { type: "link" }> => s.type === "link").map((s) => s.href);
}
