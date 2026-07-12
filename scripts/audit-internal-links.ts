#!/usr/bin/env tsx
/**
 * Internal linking audit — orphans, broken targets, related-entity coverage.
 * Run: npm run audit:links
 */
import {
  getAllArticles,
  getAllCalculators,
  getAllDiseases,
  getAllDrugClasses,
  getAllFirstAid,
  getAllLabTests,
  getAllMedicines,
  getAllSymptoms,
  getDrugClassForMedicine,
  getDiseasesForLabTest,
} from "../lib/data.js";
import { getDiseaseSystems, getHealthAzEntries, getMedicineCategories, getMedicinesByCategory, getDiseasesBySystem } from "../lib/categories.js";
import { FOOTER_LINKS, NAV_LINKS, ITEMS_PER_PAGE } from "../lib/constants.js";
import { getContextualLinkHrefs } from "../lib/contextual-links.js";
import { listingPageHref } from "../lib/listings.js";
import { getListingStaticPageParams } from "../lib/listings.js";
import { getSitemapEntries } from "../lib/sitemap-urls.js";
import { getMedicineCategoryHref, getDiseaseSystemHref } from "../lib/entity-hubs.js";
import { TRUST_HUB_LINKS } from "../lib/trust-pages.js";

const MIN_MED_DISEASES = 3;
const MIN_DISEASE_MEDS = 3;
const MIN_DISEASE_TESTS = 2;
const MIN_SYMPTOM_DISEASES = 3;
const MIN_CONTENT_INBOUND = 3;
const TARGET_OUTBOUND_MIN = 6;
const TARGET_OUTBOUND_MAX = 12;

/** Paths reachable on site but excluded from sitemap (noindex). */
const EXTRA_VALID_PATHS = new Set(["/search", "/disclaimer"]);

/** Kinds excluded from content outbound density (blueprint §5.3). */
const SHELL_KINDS = new Set(["global-shell", "editorial-attribution"]);

type Edge = { from: string; kind: string };


const inbound = new Map<string, Edge[]>();
const outbound = new Map<string, string[]>();
const outboundContent = new Map<string, Set<string>>();
const broken: string[] = [];
const coverage: string[] = [];

function addEdge(from: string, to: string, kind: string) {
  if (!inbound.has(to)) inbound.set(to, []);
  inbound.get(to)!.push({ from, kind });
  if (!outbound.has(from)) outbound.set(from, []);
  outbound.get(from)!.push(to);
  if (!SHELL_KINDS.has(kind)) {
    if (!outboundContent.has(from)) outboundContent.set(from, new Set());
    outboundContent.get(from)!.add(to);
  }
}

function normalize(path: string): string {
  if (!path || path === "#") return "";
  const p = path.split("?")[0].split("#")[0];
  return p.startsWith("/") ? p : `/${p}`;
}

function main() {
  const sitemapPaths = new Set(getSitemapEntries().map((e) => e.path));
  const allPaths = sitemapPaths;

  function isValidTarget(target: string): boolean {
    return allPaths.has(target) || EXTRA_VALID_PATHS.has(target);
  }

  const medicineSlugs = new Set(getAllMedicines().map((m) => m.slug));
  const diseaseSlugs = new Set(getAllDiseases().map((d) => d.slug));
  const symptomSlugs = new Set(getAllSymptoms().map((s) => s.slug));
  const testSlugs = new Set(getAllLabTests().map((t) => t.slug));

  function link(from: string, to: string, kind: string) {
    const target = normalize(to);
    if (!target) return;
    if (!isValidTarget(target) && !target.startsWith("mailto:")) {
      broken.push(`${from} → ${target} (${kind}) — target not in sitemap`);
      return;
    }
    addEdge(from, target, kind);
  }

  function linkSlug(from: string, prefix: string, slug: string, kind: string, slugSet: Set<string>) {
    if (!slugSet.has(slug)) {
      broken.push(`${from} → ${prefix}/${slug} (${kind}) — slug missing from data`);
      return;
    }
    link(from, `${prefix}/${slug}`, kind);
  }

  function addHealthAzLink(from: string, name: string) {
    const letter = name.trim().charAt(0).toLowerCase();
    if (letter >= "a" && letter <= "z") link(from, `/health-az/${letter}`, "health-az");
  }

  // Global shell (nav + footer on every page)
  const globalTargets = [
    ...NAV_LINKS.map((l) => l.href),
    ...FOOTER_LINKS.resources.map((l) => l.href),
    ...FOOTER_LINKS.company.map((l) => l.href),
    ...FOOTER_LINKS.legal.map((l) => l.href),
    "/",
  ];
  for (const path of allPaths) {
    for (const g of globalTargets) link(path, g, "global-shell");
    link(path, "/content-review-process", "editorial-attribution");
    link(path, "/medical-disclaimer", "editorial-attribution");
  }

  // Homepage category cards + trust hub
  for (const href of ["/medicines", "/diseases", "/lab-tests", "/symptoms", "/calculators", "/first-aid", "/articles"]) {
    link("/", href, "homepage");
  }
  for (const t of TRUST_HUB_LINKS) link("/", t.href, "trust-hub");

  // Trust pages cross-link grid
  for (const page of TRUST_HUB_LINKS) {
    for (const t of TRUST_HUB_LINKS) {
      if (t.href !== page.href) link(page.href, t.href, "trust-hub");
    }
  }

  // Listing hubs → entity pages
  const addListingLinks = (
    basePath: string,
    items: { slug: string }[],
    itemPrefix: string
  ) => {
    const pages = getListingStaticPageParams(items.length);
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    for (const { page } of pages) {
      const from = page === 1 ? basePath : `${basePath}/list/${page}`;
      const start = (page - 1) * ITEMS_PER_PAGE;
      const slice = items.slice(start, start + ITEMS_PER_PAGE);
      for (const item of slice) link(from, `${itemPrefix}/${item.slug}`, "listing");
    }

    // Pagination prev/next + visible page numbers
    for (let page = 1; page <= totalPages; page++) {
      const from = listingPageHref(basePath, page);
      if (page > 1) link(from, listingPageHref(basePath, page - 1), "pagination");
      if (page < totalPages) link(from, listingPageHref(basePath, page + 1), "pagination");
      for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
          link(from, listingPageHref(basePath, p), "pagination");
        }
      }
    }
  };

  addListingLinks("/medicines", getAllMedicines(), "/medicine");
  addListingLinks("/diseases", getAllDiseases(), "/disease");
  addListingLinks("/symptoms", getAllSymptoms(), "/symptom");
  addListingLinks("/lab-tests", getAllLabTests(), "/lab-test");

  // Category / system hubs
  for (const cat of getMedicineCategories()) {
    const hub = `/medicines/${cat.slug}`;
    for (const m of getMedicinesByCategory(cat.slug)) link(hub, `/medicine/${m.slug}`, "category-hub");
    link("/medicines", hub, "category-index");
  }
  for (const sys of getDiseaseSystems()) {
    const hub = `/diseases/${sys.slug}`;
    for (const d of getDiseasesBySystem(sys.slug)) link(hub, `/disease/${d.slug}`, "system-hub");
    link("/diseases", hub, "system-index");
  }

  // Drug classes
  link("/", "/drug-classes", "homepage");
  for (const dc of getAllDrugClasses()) {
    const hub = `/drug-class/${dc.slug}`;
    link("/drug-classes", hub, "drug-class-index");
    for (const ms of dc.medicineSlugs) linkSlug(hub, "/medicine", ms, "drug-class", medicineSlugs);
  }

  // Health A–Z
  link("/", "/health-az", "homepage");
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    const hub = `/health-az/${letter}`;
    link("/health-az", hub, "health-az");
    for (const entry of getHealthAzEntries(letter)) link(hub, entry.href, "health-az");
  }

  // Calculators, articles, first aid index
  for (const c of getAllCalculators()) link("/calculators", `/calculator/${c.slug}`, "listing");
  for (const a of getAllArticles()) link("/articles", `/article/${a.slug}`, "listing");
  for (const f of getAllFirstAid()) link("/first-aid", `/first-aid/${f.slug}`, "listing");

  // Entity related links + coverage + contextual body links
  for (const med of getAllMedicines()) {
    const from = `/medicine/${med.slug}`;
    const diseases = med.relatedDiseases ?? [];
    const alts = med.alternatives ?? [];
    if (diseases.length < MIN_MED_DISEASES) {
      coverage.push(`medicine/${med.slug}: ${diseases.length}/${MIN_MED_DISEASES} related diseases`);
    }
    for (const ds of diseases) linkSlug(from, "/disease", ds, "related", diseaseSlugs);
    for (const ms of alts) linkSlug(from, "/medicine", ms, "alternative", medicineSlugs);

    const drugClass = getDrugClassForMedicine(med.slug);
    if (drugClass) link(from, `/drug-class/${drugClass.slug}`, "drug-class");

    link(from, "/medicines", "breadcrumb");
    link(from, getMedicineCategoryHref(med.category), "category-hub");
    link(from, "/drug-classes", "drug-class-index");
    addHealthAzLink(from, med.name);
    for (const href of getContextualLinkHrefs(
      [med.description, med.howItWorks, ...(med.uses ?? [])],
      { excludeHref: from, maxLinks: 4 }
    )) {
      link(from, href, "contextual");
    }
  }

  for (const disease of getAllDiseases()) {
    const from = `/disease/${disease.slug}`;
    const meds = disease.relatedMedicines ?? [];
    const tests = disease.relatedSlugs ?? [];
    if (meds.length < MIN_DISEASE_MEDS) {
      coverage.push(`disease/${disease.slug}: ${meds.length}/${MIN_DISEASE_MEDS} related medicines`);
    }
    if (tests.length < MIN_DISEASE_TESTS) {
      coverage.push(`disease/${disease.slug}: ${tests.length}/${MIN_DISEASE_TESTS} related lab tests`);
    }
    for (const ms of meds) linkSlug(from, "/medicine", ms, "related", medicineSlugs);
    for (const ts of tests) linkSlug(from, "/lab-test", ts, "related", testSlugs);
    link(from, "/diseases", "breadcrumb");
    link(from, getDiseaseSystemHref(disease.category), "system-hub");
    addHealthAzLink(from, disease.name);
    for (const href of getContextualLinkHrefs(
      [disease.description, disease.overview, ...(disease.treatment ?? [])],
      { excludeHref: from, maxLinks: 4 }
    )) {
      link(from, href, "contextual");
    }
  }

  for (const symptom of getAllSymptoms()) {
    const from = `/symptom/${symptom.slug}`;
    const diseases = symptom.relatedDiseases ?? [];
    if (diseases.length < MIN_SYMPTOM_DISEASES) {
      coverage.push(`symptom/${symptom.slug}: ${diseases.length}/${MIN_SYMPTOM_DISEASES} related diseases`);
    }
    for (const ds of diseases) linkSlug(from, "/disease", ds, "related", diseaseSlugs);
    link(from, "/symptoms", "breadcrumb");
    link(from, "/diseases", "topic-hub");
    addHealthAzLink(from, symptom.name);
    for (const href of getContextualLinkHrefs(
      [symptom.description, ...(symptom.possibleCauses ?? [])],
      { excludeHref: from, maxLinks: 4 }
    )) {
      link(from, href, "contextual");
    }
  }

  for (const test of getAllLabTests()) {
    const from = `/lab-test/${test.slug}`;
    const diseaseLinks = test.relatedDiseases?.length
      ? test.relatedDiseases
      : getDiseasesForLabTest(test.slug).map((d) => d.slug);
    for (const ds of diseaseLinks) linkSlug(from, "/disease", ds, "related", diseaseSlugs);
    link(from, "/lab-tests", "breadcrumb");
    link(from, "/diseases", "topic-hub");
    addHealthAzLink(from, test.name);
    for (const href of getContextualLinkHrefs(
      [test.description, test.overview, ...(test.purpose ?? [])],
      { excludeHref: from, maxLinks: 2 }
    )) {
      link(from, href, "contextual");
    }
  }

  // Orphans: content inbound only (exclude global-shell)
  const orphans: string[] = [];
  const weak: string[] = [];
  for (const path of allPaths) {
    if (path === "/" || path === "/search" || path === "/disclaimer") continue;
    const edges = inbound.get(path) ?? [];
    const contentInbound = edges.filter((e) => !SHELL_KINDS.has(e.kind));
    if (contentInbound.length === 0) orphans.push(path);
    else if (contentInbound.length < MIN_CONTENT_INBOUND) weak.push(`${path} (${contentInbound.length} content inbound)`);
  }

  // Content outbound density on entity pages (excludes nav/footer shell)
  const outboundIssues: string[] = [];
  const entityPrefixes = ["/medicine/", "/disease/", "/symptom/", "/lab-test/"];
  for (const path of allPaths) {
    if (!entityPrefixes.some((p) => path.startsWith(p))) continue;
    const n = outboundContent.get(path)?.size ?? 0;
    if (n < TARGET_OUTBOUND_MIN || n > TARGET_OUTBOUND_MAX) {
      outboundIssues.push(`${path}: ${n} content outbound (target ${TARGET_OUTBOUND_MIN}–${TARGET_OUTBOUND_MAX})`);
    }
  }

  // Report
  console.log("=== Internal link audit ===\n");
  console.log(`Sitemap URLs:     ${allPaths.size}`);
  console.log(`Broken targets:   ${broken.length}`);
  console.log(`Orphan pages:     ${orphans.length} (zero content inbound)`);
  console.log(`Weak pages:       ${weak.length} (<${MIN_CONTENT_INBOUND} content inbound)`);
  console.log(`Coverage gaps:    ${coverage.length}`);
  console.log(`Outbound issues:  ${outboundIssues.length} (entity content links outside ${TARGET_OUTBOUND_MIN}–${TARGET_OUTBOUND_MAX})`);

  if (broken.length) {
    console.log("\n--- Broken links (first 20) ---");
    broken.slice(0, 20).forEach((b) => console.log(`  ✗ ${b}`));
    if (broken.length > 20) console.log(`  … and ${broken.length - 20} more`);
  }

  if (orphans.length) {
    console.log("\n--- Orphan pages (first 15) ---");
    orphans.slice(0, 15).forEach((o) => console.log(`  ○ ${o}`));
    if (orphans.length > 15) console.log(`  … and ${orphans.length - 15} more`);
  }

  if (coverage.length) {
    console.log("\n--- Related-entity coverage gaps (first 15) ---");
    coverage.slice(0, 15).forEach((c) => console.log(`  ~ ${c}`));
    if (coverage.length > 15) console.log(`  … and ${coverage.length - 15} more`);
  }

  const fail = broken.length > 0;
  if (fail) {
    console.error("\nAudit FAILED: fix broken internal links.");
    process.exit(1);
  }

  console.log("\nAudit passed (no broken links). Review orphans/coverage manually.");
  if (orphans.length > 10 || outboundIssues.length > 50) {
    console.log("Note: review orphan/outbound counts — run npm run link if coverage gaps appear.");
  }
}

main();
