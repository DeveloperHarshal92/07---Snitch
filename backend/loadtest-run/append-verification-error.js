import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const resultsPath = path.resolve(currentDirectory, "../../load-test-results.md");
const marker =
  "Per the safety rule, the workflow stopped at this point. The existing local user";
const detail =
  "Post-restoration verification request failed. Exact error: `The request was canceled due to the configured HttpClient.Timeout of 10 seconds elapsing.` Port 3000 was still listening; the earlier restoration request had returned HTTP 200 and is the basis of the final state confirmation above.\n\n";

const results = await fs.readFile(resultsPath, "utf8");
await fs.writeFile(resultsPath, results.replace(marker, detail + marker), "utf8");
