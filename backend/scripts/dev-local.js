import { spawn } from "child_process";
import path from "path";

const cwd = process.cwd();
const env = { ...process.env, DOTENV_CONFIG_PATH: ".env.local" };

const proc = spawn("npx", ["nodemon", "server.js"], {
  stdio: "inherit",
  cwd,
  env,
  shell: true,
});

proc.on("close", (code) => {
  process.exit(code);
});
