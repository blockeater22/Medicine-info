import * as cheerio from "cheerio";
import { getText } from "./http.js";
import { SOURCES } from "./constants.js";
import { makeSource } from "./summarize.js";
import { splitIntoBullets, uniqueStrings } from "./utils.js";

export interface HealthTopicData {
  title: string;
  summary: string;
  sections: Record<string, string[]>;
  sourceUrl: string;
}

export async function fetchMedlinePlusTopicDirect(term: string): Promise<HealthTopicData | null> {
  const queryUrl = `${SOURCES.nihSearch}?db=healthTopics&term=${encodeURIComponent(term)}&retmax=1&rettype=MergedXML`;
  const data = await getText(queryUrl).catch(() => null);
  if (!data) return null;
  return parseMedlineXml(data, term, queryUrl);
}

function parseMedlineXml(xml: string, term: string, queryUrl: string): HealthTopicData | null {
  const $ = cheerio.load(xml, { xmlMode: true });
  const doc = $("document").first();
  if (!doc.length) return null;

  const title = doc.find("content[name=title]").text().trim() || term;
  const summary = doc.find("content[name=FullSummary], content[name=snippet]").first().text().trim();

  const sections: Record<string, string[]> = {};
  doc.find("section").each((_, el) => {
    const sectionName = $(el).attr("name") || "general";
    const items: string[] = [];
    $(el)
      .find("li")
      .each((__, li) => {
        const text = $(li).text().trim();
        if (text) items.push(text);
      });
    if (!items.length) {
      const text = $(el).text().trim();
      if (text) items.push(...splitIntoBullets(text, 8));
    }
    if (items.length) sections[sectionName.toLowerCase()] = uniqueStrings(items, 12);
  });

  const pageUrl = doc.find("content[name=url]").text().trim() || `${SOURCES.medlinePlus}${slugFromTerm(term)}.html`;

  return {
    title,
    summary: summary || synthesizeFallbackSummary(title, sections),
    sections,
    sourceUrl: pageUrl || queryUrl,
  };
}

export interface WikiSummary {
  title: string;
  extract: string;
  description: string;
  url: string;
}

export async function fetchWikipediaSummary(title: string): Promise<WikiSummary | null> {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  const url = `${SOURCES.wikipedia}page/summary/${encoded}`;
  try {
    const data = await import("./http.js").then(({ getJson }) =>
      getJson<{ title: string; extract: string; description?: string; content_urls?: { desktop?: { page?: string } } }>(url)
    );
    return {
      title: data.title,
      extract: data.extract,
      description: data.description || "",
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encoded}`,
    };
  } catch {
    return null;
  }
}

export function extractSectionItems(sections: Record<string, string[]>, keys: string[]): string[] {
  for (const key of keys) {
    const match = Object.entries(sections).find(([k]) => k.includes(key));
    if (match?.[1]?.length) return match[1];
  }
  return [];
}

function slugFromTerm(term: string): string {
  return term.toLowerCase().replace(/\s+/g, "");
}

function synthesizeFallbackSummary(title: string, sections: Record<string, string[]>): string {
  const first = Object.values(sections).flat()[0];
  return first ? `${title} is discussed in trusted medical references with focus on ${first.toLowerCase()}.` : `${title} overview from public health references.`;
}

export function mergeSources(...urls: Array<{ name: string; url: string }>) {
  return urls.map((s) => makeSource(s.name, s.url));
}
