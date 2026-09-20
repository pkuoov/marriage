import { STORY_PACK_CREDITS } from "../runtime/storyPackCredits.js";

export function storyPackCompleteHtml() {
  return `
    <div class="demo-return-card" aria-live="polite" aria-atomic="true">
      ${STORY_PACK_CREDITS.map((line) => `<p class="demo-end-caption demo-end-caption-final">${line}</p>`).join("\n")}
    </div>
  `;
}
