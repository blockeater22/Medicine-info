import path from "path";
import { DATA_DIRS, MEDICAL_DISCLAIMER, SOURCES } from "../shared/constants.js";
import { ArticleSchema, type ArticleRecord } from "../shared/schemas.js";
import { loadSeedFile, logResults, saveRecord, type SaveResult } from "../shared/io.js";
import { buildFaqs, makeSource, synthesizeOverview, titleCase } from "../shared/summarize.js";
import { fetchWikipediaSummary, mergeSources } from "../shared/sources.js";
import { isoNow, slugify, splitIntoBullets } from "../shared/utils.js";

const SEED_PATH = path.join("scripts", "seeds", "articles.txt");

export async function runArticlePipeline(options: { limit: number; force: boolean; dryRun: boolean }) {
  const seeds = loadSeedFile(SEED_PATH);
  const results: SaveResult[] = [];

  for (const line of seeds.slice(0, options.limit)) {
    const [topic, category = "General Health"] = line.split("|").map((s) => s.trim());
    try {
      const record = await fetchArticle(topic, category);
      results.push(saveRecord(DATA_DIRS.articles, record, ArticleSchema, options));
      console.log(`[articles] ${record.slug} ✓`);
    } catch (err) {
      console.error(`[articles] failed: ${topic}`, err instanceof Error ? err.message : err);
    }
  }

  logResults("articles", results);
  return results;
}

async function fetchArticle(topic: string, category: string): Promise<ArticleRecord> {
  const wiki = await fetchWikipediaSummary(topic);
  const slug = slugify(topic);
  const title = titleCase(topic.replace(/-/g, " "));
  const facts = wiki ? splitIntoBullets(wiki.extract, 8) : [];

  const summary = synthesizeOverview(title, facts);
  const content = buildArticleContent(title, category, facts);

  return {
    slug,
    title,
    summary,
    content,
    category,
    tags: [category.toLowerCase(), ...topic.split("-").slice(0, 3)],
    author: "Doctors Hub Editorial",
    readTimeMinutes: Math.max(3, Math.ceil(content.split(/\s+/).length / 200)),
    faq: buildFaqs(title, "general"),
    medicalDisclaimer: MEDICAL_DISCLAIMER,
    lastUpdated: isoNow(),
    sources: mergeSources(
      ...(wiki ? [{ name: "Wikipedia", url: wiki.url }] : []),
      { name: "MedlinePlus", url: SOURCES.medlinePlus }
    ),
  };
}

function buildArticleContent(title: string, category: string, facts: string[]): string {
  const sections = [
    `# ${title}`,
    "",
    synthesizeOverview(title, facts),
    "",
    "## Why This Matters",
    `Understanding ${title.toLowerCase()} helps readers in the ${category.toLowerCase()} space make practical daily decisions with their healthcare team.`,
    "",
    "## Key Takeaways",
    ...facts.slice(0, 6).map((f, i) => `${i + 1}. ${f.charAt(0).toUpperCase()}${f.slice(1)}`),
    "",
    "## Practical Steps",
    "1. Schedule preventive checkups appropriate for your age and risk profile.",
    "2. Maintain balanced nutrition, regular activity, and adequate sleep.",
    "3. Track symptoms and share accurate information with your clinician.",
    "4. Follow evidence-based screening and vaccination guidance in India.",
    "",
    "## When to Seek Medical Advice",
    "Consult a qualified professional if symptoms persist, worsen, or interfere with daily function.",
    "",
    "## Conclusion",
    "Reliable health education supports better conversations with doctors but never replaces individualized medical care.",
  ];
  return sections.join("\n");
}
