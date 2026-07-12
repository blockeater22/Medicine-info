export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function uniqueStrings(items: string[], limit = 20): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const item = raw.trim().replace(/\s+/g, " ");
    if (!item || item.length < 3) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3).trim() + "...";
}

export function splitIntoBullets(text: string, max = 12): string[] {
  if (!text) return [];
  const cleaned = text
    .replace(/\r/g, "")
    .replace(/\*\*/g, "")
    .replace(/\[\d+\]/g, "");

  const parts = cleaned
    .split(/\n+|(?:\.\s+(?=[A-Z]))|(?:;\s+)/)
    .map((p) => p.replace(/^[-•*]\s*/, "").trim())
    .filter((p) => p.length > 10 && p.length < 400);

  return uniqueStrings(parts, max);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseCliArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return {
    limit: parseInt(String(args.limit ?? "50"), 10),
    force: Boolean(args.force),
    dryRun: Boolean(args["dry-run"]),
  };
}
