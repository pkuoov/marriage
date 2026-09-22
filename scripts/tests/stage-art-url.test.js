import test from "node:test";
import assert from "node:assert/strict";
import { liveFrameHtml } from "../../src/ui/liveFrameView.js";

const ART = "./assets/generated/backgrounds/credit_bill_room.png";

function stageArtUrl(html) {
  return html.match(/--stage-art:url\('([^']*)'\)/)?.[1] ?? null;
}

test("stage art resolves against the page, not the stylesheet that reads var(--stage-art)", () => {
  const previous = globalThis.document;
  globalThis.document = { baseURI: "http://127.0.0.1:5173/index.html" };
  try {
    const url = stageArtUrl(liveFrameHtml({ backdropClass: "backdrop-credit", backdropArt: ART }));
    assert.equal(url, "http://127.0.0.1:5173/assets/generated/backgrounds/credit_bill_room.png");
    assert.doesNotMatch(url, /src\/styles/);
  } finally {
    globalThis.document = previous;
  }
});

test("stage art is omitted for paths outside assets/", () => {
  assert.equal(stageArtUrl(liveFrameHtml({ backdropClass: "backdrop-credit", backdropArt: "javascript:alert(1)" })), null);
});
