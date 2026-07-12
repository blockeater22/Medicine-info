# Doctors Hub — Medical Data Pipeline

Automated ETL pipeline that generates validated JSON for the Doctors Hub static website.

## Stack

Node.js · TypeScript · Axios · Cheerio · Zod · tsx

## Structure

```
scripts/
  shared/          # schemas, HTTP, IO, summarization, sources
  medicines/       # OpenFDA + RxNorm
  diseases/        # MedlinePlus + Wikipedia
  symptoms/        # MedlinePlus + Wikipedia
  tests/           # MedlinePlus + Wikipedia
  first-aid/       # curated emergency templates
  articles/        # topic synthesis
  calculators/     # metadata generation
  seeds/           # input term lists (expandable to thousands)
  run-pipeline.ts  # CLI entry
data/              # output JSON consumed by website
```

## Commands

```bash
npm install

# Run individual pipelines
npm run pipeline:medicines -- --limit 20
npm run pipeline:diseases -- --limit 30
npm run pipeline:symptoms -- --limit 25
npm run pipeline:tests -- --limit 20
npm run pipeline:first-aid
npm run pipeline:articles -- --limit 15
npm run pipeline:calculators

# Run everything
npm run pipeline:all -- --limit 50

# Force overwrite existing records
npm run pipeline:medicines -- --limit 10 --force

# Validate without writing
npm run pipeline:diseases -- --limit 5 --dry-run

# Expand medicine seeds from RxNorm (thousands of IN names)
npx tsx scripts/shared/expand-seeds.ts medicines 1000
```

## Pipeline Flow

1. Read seed term from `scripts/seeds/*.txt`
2. Fetch structured facts from public APIs (OpenFDA, NIH MedlinePlus, Wikipedia, RxNorm)
3. Extract bullet facts — **never store raw copyrighted text**
4. Rephrase into original summaries via `shared/summarize.ts`
5. Validate with Zod schemas in `shared/schemas.ts`
6. Save to `data/<type>/<slug>.json`
7. Skip duplicates unless `--force` or newer `lastUpdated`

## Output Schemas

All records include:

- `slug` (URL-safe)
- `lastUpdated` (ISO-8601)
- `sources[]` with traceable URLs
- `medicalDisclaimer`

See `scripts/shared/schemas.ts` for full field definitions.

## Scaling to Thousands

1. Expand seeds: `npx tsx scripts/shared/expand-seeds.ts medicines 5000`
2. Run with high limit: `npm run pipeline:medicines -- --limit 5000`
3. Pipelines rate-limit requests (~350ms) to respect public APIs

## Data Sources

| Type | Primary Source | Fallback |
|------|---------------|----------|
| Medicines | OpenFDA Drug Labels | RxNorm |
| Diseases | NIH MedlinePlus | Wikipedia REST |
| Symptoms | NIH MedlinePlus | Wikipedia REST |
| Lab Tests | NIH MedlinePlus | Wikipedia REST |
| First Aid | WHO/CDC-aligned templates | — |
| Articles | Wikipedia facts + original synthesis | — |
| Calculators | Clinical formula metadata | — |

## Quality Rules

- Zod validation on every write
- Duplicate slug detection
- Original wording only (rephrase engine)
- Source URLs stored for auditability
- ISO dates throughout

## Website Adapter

Pipeline JSON (with `lastUpdated`, `sources`) is **automatically adapted** at read time via `lib/adapters/`.

The website consumes normalized types through `lib/data.ts` — no manual conversion needed.

Verify after pipeline runs:

```bash
npm run pipeline:verify
```

Both formats can coexist in `data/`:
- **Pipeline format** — `drugClass`, `lastUpdated`, `sources`
- **Website format** — `seo`, `updatedAt`, `name`

Adapters detect format and normalize on load.
