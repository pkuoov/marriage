export function tutorialGuideLine(brief, step) {
  if (!brief?.tutorialChapter) return "";
  const guides = {
    open: "孟姐提示：开案先不要急着站队。先看案由、悬念物和旧档牵连，决定第一步该复盘现场还是先看证据。",
    scene: "孟姐提示：现场复原里至少有一个版本讲得顺但不完整。点击“比对这个版本”，把不自洽之处记成矛盾。",
    testimony: "孟姐提示：证词追问不是为了让人认错，而是让台词和材料互相咬住。优先追问含糊话、半真话和防御话。",
    evidence: "孟姐提示：证据卡只能证明局部事实。把时间线、钱和动机放在一起看，才能避免被单张截图带跑。",
    accusation: "孟姐提示：阶段指认前至少抓到一处矛盾。没有证据支撑的同情，也可能误伤另一方。"
  };
  return `<p class="signal signal-yellow">${guides[step] ?? brief.tutorialTip ?? "孟姐提示：先找矛盾，再做判断。"}</p>`;
}

export function storyCallsBlock(brief) {
  const calls = brief.storyCalls ?? [];
  if (!calls.length) return "";
  return `
    <div class="scene-list">
      <p><b>连线进程</b></p>
      ${calls.map((line, index) => `<p><b>第 ${index + 1} 次连线</b>：${line}</p>`).join("")}
    </div>
  `;
}

export function dialogueBlock(lines = []) {
  if (!lines.length) return "";
  return `
    <div class="call-dialogue">
      ${lines.map((line) => `
        <div class="call-line ${line.role ?? ""}">
          <b>${line.speaker}</b>
          <p>${line.text}</p>
        </div>
      `).join("")}
    </div>
  `;
}

export function plotThreadsBlock(brief, contradictionCount = 0) {
  const threads = brief.plotThreads ?? [];
  if (!threads.length) return "";
  const unlockedCount = Math.min(threads.length, Math.max(0, contradictionCount));
  const visible = threads.slice(0, unlockedCount);
  return `
    <div class="scene-list">
      <p><b>已拆出的混杂线索</b></p>
      ${visible.length
        ? visible.map((line, index) => `<p><b>第 ${index + 1} 条</b>：${line}</p>`).join("")
        : `<p>证据还没咬合。先别给本案贴类型标签，至少抓到一处矛盾后再拆线。</p>`}
      ${unlockedCount < threads.length ? `<p class="hint">还有 ${threads.length - unlockedCount} 条线没有证据支撑，暂不展开。</p>` : ""}
    </div>
  `;
}
