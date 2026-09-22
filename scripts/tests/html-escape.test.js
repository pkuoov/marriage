import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "../../src/ui/html.js";

test("escapeHtml 转义空值、数字和五个标记字符", () => {
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
  assert.equal(escapeHtml(12), "12");
  assert.equal(escapeHtml(0), "0");
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#039;");
  assert.equal(escapeHtml(`a&b<c>d"e'f`), "a&amp;b&lt;c&gt;d&quot;e&#039;f");
});
