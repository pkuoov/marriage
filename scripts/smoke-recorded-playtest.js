// Recorded playtest regressions now follow the concentrated inquiry path.
// Deleted per-line menus, timeline sorting and the end-of-case quiz are no longer fixtures.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const script = fileURLToPath(new URL("./smoke-browser-replay.js", import.meta.url));
for (const viewport of ["1920x1080", "1366x768", "1280x800", "1280x720", "390x844"]) {
  console.log(`Recorded playtest: ${viewport}`);
  execFileSync(process.execPath, [script, "--target=focused-credit"], {
    stdio: "inherit", env: { ...process.env, SMOKE_VIEWPORT: viewport }
  });
}
