import fs from "fs";
import path from "path";
import { buildSearchIndex } from "../lib/data.js";

const out = path.join(process.cwd(), "public", "search-index.json");
const index = buildSearchIndex();
fs.writeFileSync(out, JSON.stringify(index));
console.log(`Search index generated: ${index.length} items (with adapters)`);
