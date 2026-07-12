#!/usr/bin/env tsx
import { parseCliArgs } from "./shared/utils.js";
import { linkRelatedRecords } from "./shared/linker.js";
import { runMedicinePipeline } from "./medicines/run.js";
import { runDiseasePipeline } from "./diseases/run.js";
import { runSymptomPipeline } from "./symptoms/run.js";
import { runLabTestPipeline } from "./tests/run.js";
import { runFirstAidPipeline } from "./first-aid/run.js";
import { runArticlePipeline } from "./articles/run.js";
import { runCalculatorPipeline } from "./calculators/run.js";

const target = process.argv[2] || "all";
const options = parseCliArgs(process.argv.slice(3));

const PIPELINES: Record<string, () => Promise<unknown>> = {
  medicines: () => runMedicinePipeline(options),
  diseases: () => runDiseasePipeline(options),
  symptoms: () => runSymptomPipeline(options),
  tests: () => runLabTestPipeline(options),
  "first-aid": () => runFirstAidPipeline(options),
  articles: () => runArticlePipeline(options),
  calculators: () => runCalculatorPipeline(options),
};

async function main() {
  console.log(`Doctors Hub Data Pipeline — target=${target} limit=${options.limit} force=${options.force} dryRun=${options.dryRun}`);

  if (target === "all") {
    for (const key of Object.keys(PIPELINES)) {
      await PIPELINES[key]();
    }
    linkRelatedRecords();
    console.log("\nRun `npm run pipeline:verify` to validate website adapters.");
    return;
  }

  const pipeline = PIPELINES[target];
  if (!pipeline) {
    console.error(`Unknown pipeline: ${target}`);
    console.error("Available: medicines, diseases, symptoms, tests, first-aid, articles, calculators, all");
    process.exit(1);
  }

  await pipeline();

  if (target === "medicines" || target === "diseases") {
    linkRelatedRecords();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
