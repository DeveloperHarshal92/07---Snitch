import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const resultsPath = path.resolve(currentDirectory, "../../load-test-results.md");

const results = `# MongoDB Atlas vs Local Load-Test Results

## Setup Confirmed

- \`backend/.env.local\` exists: **Yes**
- Exact local override \`MONGO_URI=mongodb://localhost:27017/snitch-test\` exists: **Yes**
- \`backend/package.json\` contains \`dev:local\`: **Yes**
- \`dev:local\` command: \`node scripts/dev-local.js\`
- Local MongoDB executable exists at \`C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe\`: **Yes**
- Local MongoDB listening on \`127.0.0.1:27017\`: **Yes**
- k6 executable verified: **Yes**
- k6 version: \`k6.exe v2.1.0 (commit/83a87a41e2, go1.26.4, windows/amd64)\`
- k6 note: The initial shell did not have k6 on \`PATH\`. \`winget install k6 --source winget\` reported that k6 was already installed and no newer version was available. After adding \`C:\\Program Files\\k6\` to the process \`PATH\`, \`k6 version\` succeeded.
- Atlas backend connection before backup: **Confirmed**
- Atlas product backup: **6 products**, saved to \`backend/loadtest-run/atlas-products-backup.json\`
- Local seed: **6 products inserted** into \`mongodb://localhost:27017/snitch-test\`
- Local backend mode: **Confirmed** from the \`.env.local\` load, successful MongoDB connection log, and an established connection from the backend process to \`127.0.0.1:27017\`
- Local buyer registration: **Failed**; see \`## Errors\`

## k6 Summary (avg, p95, failure rate, checks passed/failed)

Not run. The workflow stopped before k6 because the required local buyer registration failed.

## Failures

No k6 request failures are available because the load test was not run.

## Final State Confirmation (confirms backend is back on Atlas)

- Backend relaunched with \`npm run dev\`: **Yes**
- \`.env\` targets a non-local MongoDB deployment: **Yes**
- Successful MongoDB connection message: **Yes**
- Backend has established remote MongoDB connections on port 27017: **Yes**
- \`GET http://localhost:3000/api/products\` after restoration: **HTTP 200**
- Final mode: **Atlas**

## Errors

Local buyer registration failed. HTTP 400. Body: \`{"message":"User with same email or contact already exists","success":false}\`

Per the safety rule, the workflow stopped at this point. The existing local user was not deleted or modified, no k6 load test was run, and no destructive fix was attempted.
`;

await fs.writeFile(resultsPath, results, "utf8");
console.log(`Results written to ${resultsPath}`);
