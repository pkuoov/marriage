import { routeTrailModel } from "../runtime/routeMapModel.js";
import { escapeHtml } from "./html.js";

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
      <b>${escapeHtml(item.question || item.label)}</b>
    </span>
  `;
}
