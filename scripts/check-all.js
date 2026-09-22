import { existsSync, readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmCliPath = [
  process.env.npm_execpath,
  process.env.NPM_CLI_JS,
  join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js")
].find((candidate) => candidate && existsSync(candidate));
const syntaxRoots = ["src", "scripts", "desktop/electron", "tools/dialogue-editor"];
const syntaxExtensions = new Set([".js", ".cjs", ".mjs"]);

runNpm("content:index:check");
runNpm("content:script:check");

const syntaxFiles = syntaxRoots
  .flatMap((root) => collectSyntaxFiles(join(projectRoot, root)))
  .sort((left, right) => left.localeCompare(right));

syntaxFiles.forEach((file) => run(process.execPath, ["--check", file]));
console.log(`Syntax validation passed: ${syntaxFiles.length} files.`);

runNpm("audio:bgm", ["validate"]);
runNpm("audio:voice", ["validate"]);
runNpm("verify:audio");
runNpm("verify:content-pipeline");
runNpm("verify:pack");
runNpm("test:logic");
run(process.execPath, ["--test", "scripts/tests/core-rebuttal.test.js", "scripts/tests/focused-inquiry.test.js", "scripts/tests/state-snapshot.test.js", "scripts/tests/html-escape.test.js", "scripts/tests/stage-art-url.test.js"]);
run(process.execPath, ["--test", "scripts/tests/ui-review-regressions.test.js"]);
run(process.execPath, ["--test", "scripts/tests/playtest-fixes.test.js", "scripts/tests/combined-review-fixes.test.js"]);
run(process.execPath, ["--test", "scripts/tests/visual-polish.test.js"]);
run(process.execPath, ["--test", "scripts/tests/story-canvas-review.test.js"]);
runNpm("test:audio-runtime");
run(process.execPath, ["--test", "scripts/tests/http-byte-range.test.js"]);
run(process.execPath, ["--test", "scripts/tests/dev-reload.test.js"]);
run(process.execPath, ["--test", "scripts/tests/content-revision-mechanisms.test.js"]);
run(process.execPath, ["--test", "scripts/tests/script-presentation-parity.test.js"]);
run(process.execPath, ["--test", "scripts/tests/ordered-dialogue.test.js"]);
run(process.execPath, ["--test", "scripts/tests/project-skill-links.test.js"]);
run(process.execPath, ["--test", "scripts/tests/authoring-policy.test.js"]);
run(process.execPath, ["--test", "scripts/tests/script-review-repairs.test.js"]);
runNpm("test:narrative");
runNpm("test:dialogue-editor");

function collectSyntaxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSyntaxFiles(path);
    return entry.isFile() && syntaxExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

function runNpm(script, extraArgs = []) {
  const args = ["run", script, ...(extraArgs.length ? ["--", ...extraArgs] : [])];
  if (npmCliPath) {
    run(process.execPath, [npmCliPath, ...args]);
    return;
  }
  run(npmCommand, args);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
