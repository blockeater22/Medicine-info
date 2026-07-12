import fs from "fs";
import path from "path";
import type { ZodSchema } from "zod";

export interface SaveResult {
  action: "created" | "updated" | "skipped";
  slug: string;
  path: string;
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

export function listSlugs(dir: string): Set<string> {
  ensureDir(dir);
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".json")) slugs.add(file.replace(/\.json$/, ""));
  }
  return slugs;
}

export function shouldUpdate(existing: { lastUpdated?: string } | null, incomingDate: string, force: boolean): boolean {
  if (force || !existing?.lastUpdated) return true;
  return new Date(incomingDate).getTime() >= new Date(existing.lastUpdated).getTime();
}

export function saveRecord<T extends { slug: string; lastUpdated: string }>(
  dir: string,
  record: T,
  schema: ZodSchema<T>,
  options: { force?: boolean; dryRun?: boolean } = {}
): SaveResult {
  const parsed = schema.parse(record);
  const filePath = path.join(dir, `${parsed.slug}.json`);
  const existing = readJsonFile<T>(filePath);

  if (existing && !shouldUpdate(existing, parsed.lastUpdated, Boolean(options.force))) {
    return { action: "skipped", slug: parsed.slug, path: filePath };
  }

  if (options.dryRun) {
    return { action: existing ? "updated" : "created", slug: parsed.slug, path: filePath };
  }

  ensureDir(dir);
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
  return { action: existing ? "updated" : "created", slug: parsed.slug, path: filePath };
}

export function loadSeedFile(seedPath: string): string[] {
  const full = path.resolve(seedPath);
  if (!fs.existsSync(full)) return [];
  return fs
    .readFileSync(full, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

export function logResults(label: string, results: SaveResult[]): void {
  const created = results.filter((r) => r.action === "created").length;
  const updated = results.filter((r) => r.action === "updated").length;
  const skipped = results.filter((r) => r.action === "skipped").length;
  console.log(`\n[${label}] created=${created} updated=${updated} skipped=${skipped} total=${results.length}`);
}
