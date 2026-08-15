import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pool = JSON.parse(await readFile(resolve(root, "content", "intelligence", "plot-template-pool.json"), "utf8"));
const templates = Array.isArray(pool.templates) ? pool.templates : [];
const allowedAxes = new Set([
  "money-flow",
  "document-edge",
  "caller-credibility",
  "process-control",
  "identity-wording",
  "outer-thread"
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertNonEmptyString(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

assert(templates.length >= Number(pool.minimumPlotCount ?? 9), "plot template pool is below minimum count");
assert(templates.length >= 12, "plot template pool must provide at least 12 pressure systems before AI experiments");
assert(new Set(templates.map((item) => item.plotId)).size === templates.length, "plotId values must be unique");
assert(templates.filter((item) => item.nonRomance === true).length >= Math.ceil(templates.length / 2), "non-romance templates must be at least half of the pool");

templates.forEach((template, index) => {
  const label = template.plotId || `template[${index}]`;
  [
    "plotId",
    "category",
    "dramaticAnchor",
    "objectPurpose",
    "thirdPressure",
    "callerBenefit",
    "otherBenefit"
  ].forEach((field) => assertNonEmptyString(template[field], `${label} missing ${field}`));
  ["true", "edited", "unknown"].forEach((field) => {
    assert(Array.isArray(template.truthBoundary?.[field]) && template.truthBoundary[field].length > 0, `${label} missing truthBoundary.${field}`);
  });
  assert(Array.isArray(template.routeAxes) && template.routeAxes.length >= 2, `${label} needs at least two route axes`);
  template.routeAxes.forEach((axis) => assert(allowedAxes.has(axis), `${label} has unknown route axis ${axis}`));
});

console.log(`Content pipeline verification passed: ${templates.length} plot templates, ${templates.filter((item) => item.nonRomance).length} non-romance`);
