import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, "../..");
const k6OutputPath = path.join(currentDirectory, "k6-full-output.txt");
const resultsPath = path.join(projectRoot, "load-test-results.md");

const stripAnsi = (value) =>
  value.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d/#&.:=?%@~_]+)*)?\u0007)|(?:(?:\d{1,4}(?:[;:]\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g,
    "",
  );

const rawOutput = await fs.readFile(k6OutputPath, "utf8");
const cleanOutput = stripAnsi(rawOutput);
const outputLines = cleanOutput.split(/\r?\n/);

const failures = [];

for (const line of outputLines) {
  if (!line.includes("FAILED_REQUEST status=")) {
    continue;
  }

  const encodedMessage = line.match(
    /msg="((?:\\.|[^"\\])*)"\s+source=console/,
  )?.[1];

  if (!encodedMessage) {
    throw new Error(`Could not parse k6 failure line: ${line}`);
  }

  const decodedMessage = JSON.parse(`"${encodedMessage}"`);
  const failure = decodedMessage.match(
    /^FAILED_REQUEST status=(\d+) body=(.*)$/s,
  );

  if (!failure) {
    throw new Error(`Could not parse decoded k6 failure: ${decodedMessage}`);
  }

  failures.push({
    status: failure[1],
    body: failure[2],
  });
}

const summaryStart = cleanOutput.indexOf("█ TOTAL RESULTS");
if (summaryStart === -1) {
  throw new Error("Could not locate the k6 TOTAL RESULTS summary.");
}

const fullSummary = cleanOutput.slice(summaryStart).trim();
const durationMetrics = cleanOutput.match(
  /http_req_duration[^\n]*avg=([^\s]+)[^\n]*p\(95\)=([^\s]+)/,
);
const failureMetrics = cleanOutput.match(
  /http_req_failed[^\n]*:\s+([0-9.]+%)\s+(\d+) out of (\d+)/,
);
const checksSucceeded = cleanOutput.match(
  /checks_succeeded[^\n]*:\s+([0-9.]+%)\s+(\d+) out of (\d+)/,
);
const checksFailed = cleanOutput.match(
  /checks_failed[^\n]*:\s+([0-9.]+%)\s+(\d+) out of (\d+)/,
);
const iterations = cleanOutput.match(/iterations[^\n]*:\s+(\d+)/);

if (
  !durationMetrics ||
  !failureMetrics ||
  !checksSucceeded ||
  !checksFailed ||
  !iterations
) {
  throw new Error("Could not extract one or more required k6 summary metrics.");
}

if (failures.length !== Number(failureMetrics[2])) {
  throw new Error(
    `Failure extraction mismatch: extracted ${failures.length}, summary reports ${failureMetrics[2]}.`,
  );
}

const failureList = failures
  .map(
    ({ status, body }, index) =>
      `${index + 1}. Status: \`${status}\`; Body: \`${body}\``,
  )
  .join("\n");

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
- k6 installation note: The initial shell did not have k6 on \`PATH\`. \`winget install k6 --source winget\` confirmed that k6 was already installed with no newer version available. After adding \`C:\\Program Files\\k6\` to the process \`PATH\`, \`k6 version\` succeeded.
- Initial Atlas backend connection: **Confirmed**
- Atlas products backup: **6 products**, saved to \`backend/loadtest-run/atlas-products-backup.json\`
- Local seed result: **6 products inserted** into \`mongodb://localhost:27017/snitch-test\`
- Local products available after seeding: **12 IDs**, saved to \`backend/loadtest-run/seeded-product-ids.json\`
- Local backend mode: **Confirmed** by the \`.env.local\` load, successful MongoDB connection log, and an established backend connection to \`127.0.0.1:27017\`
- Requested registration response: **HTTP 400**, because the email or contact already existed locally
- Existing account login using \`test@example.com\` / \`test@123\`: **HTTP 200, success:true, token cookie received**
- Resume handling: Testing continued only after the user's explicit \`continue\` instruction; the existing local user was reused without deletion or modification
- k6 target: **Local backend / local MongoDB only**, as specified by the numbered test steps
- Razorpay/payment endpoints called: **No**

## k6 Summary (avg, p95, failure rate, checks passed/failed)

- Scenario: **20 VUs for 30 seconds**
- Completed iterations: **${iterations[1]}**
- HTTP request duration average: **${durationMetrics[1]}**
- HTTP request duration p95: **${durationMetrics[2]}**
- HTTP request failure rate: **${failureMetrics[1]} (${failureMetrics[2]} of ${failureMetrics[3]})**
- Checks passed: **${checksSucceeded[2]} of ${checksSucceeded[3]} (${checksSucceeded[1]})**
- Checks failed: **${checksFailed[2]} of ${checksFailed[3]} (${checksFailed[1]})**
- k6 process exit code: **0**

Full k6 summary output:

\`\`\`text
${fullSummary}
\`\`\`

## Failures

Every non-200 cart request is listed separately below. Total: **${failures.length}**.

${failureList}

## Final State Confirmation (confirms backend is back on Atlas)

- Local backend stopped after k6: **Yes**
- Backend relaunched with \`npm run dev\`: **Yes**
- \`backend/.env\` was not modified: **Confirmed**
- \`backend/.env.local\` was not deleted or modified: **Confirmed**
- \`.env\` targets a non-local MongoDB deployment: **Yes**
- \`.env.local\` loaded by final backend: **No**
- Successful MongoDB connection message in final Atlas startup log: **Yes**
- Final \`GET http://localhost:3000/api/products\`: **HTTP 200, success:true, 6 Atlas products**
- Final mode: **Atlas**

## Errors

1. Initial local buyer registration failed. Exact error: \`Local registration failed. HTTP 400. Body: {"message":"User with same email or contact already exists","success":false}\`
2. During the first stopped run, a redundant post-restoration verification request timed out after an earlier successful HTTP 200 verification. Exact error: \`The request was canceled due to the configured HttpClient.Timeout of 10 seconds elapsing.\`

The user subsequently instructed the workflow to continue. The exact requested credentials authenticated successfully, so the existing account was reused without deleting or changing it. No Atlas collection or document was deleted or modified, and no destructive fix was attempted.
`;

await fs.writeFile(resultsPath, results, "utf8");
console.log(
  `Wrote ${failures.length} failures and the k6 summary to ${resultsPath}`,
);
