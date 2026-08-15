import { readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const syntaxRoots = ["src", "scripts", "desktop/electron"];
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
runNpm("test:narrative");

function collectSyntaxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSyntaxFiles(path);
    return entry.isFile() && syntaxExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

function runNpm(script, extraArgs = []) {
  run(npmCommand, ["run", script, ...(extraArgs.length ? ["--", ...extraArgs] : [])]);
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
