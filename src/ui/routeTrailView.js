import { routeTrailModel } from "../runtime/routeMapModel.js?v=0.20.68";

export function routeTrailHtml({
  choices = [],
  keyQuestionCount = 0,
  investigationIndexBase = Number.POSITIVE_INFINITY
} = {}) {
  const nodes = routeTrailModel({ choices, keyQuestionCount, investigationIndexBase });
  if (!nodes.length) return "";
  return `
    <div class="route-trail">
      ${nodes.map((item) => routeTrailItemHtml(item)).join("")}
    </div>
  `;
}

function routeTrailItemHtml(item) {
  return `
    <span>
      <em>${escapeHtml(item.mark)}</em>
      <b>${escapeHtml(item.label)}</b>
      ${item.question ? `<small>${escapeHtml(item.question)}</small>` : ""}
    </span>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
