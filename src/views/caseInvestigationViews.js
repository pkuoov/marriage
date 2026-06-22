import { tutorialGuideLine } from "./caseFragments.js?v=0.14.0";

export function caseOpenView({
  chapter,
  brief,
  playthroughLabel,
  coldOpen,
  opening,
  difficultyText,
  complainantName,
  respondentName,
  structureText,
  budgetText,
  openingDialogue,
  threadLine,
  agencyBattle,
  earlyWarning,
  showStreamline,
  scanDisabled
}) {
  return {
    chapter,
    text: `
      ${tutorialGuideLine(brief, "open")}
      ${brief.contentWarning ? `<p class="signal signal-yellow"><b>内容提示</b>：${brief.contentWarning}</p>` : ""}
      <p class="vn-line">${openingDialogue[0]?.text ?? ""}</p>
    `,
    choices: `
      <button class="primary" data-case-scene="sceneReview" type="button">复盘当时场景</button>
      ${showStreamline ? `<button data-streamline-case type="button">绿色模式：仅核查硬性时间线</button>` : ""}
      <button data-case-scan ${scanDisabled} type="button">先看案卷摘要，直达证据卡</button>
    `
  };
}

export function sceneReviewView({
  chapter,
  brief,
  budgetText,
  beat,
  contradictions,
  versionStates,
  questionStates
}) {
  return {
    chapter,
    text: `
      <p><b>现场复原：${brief.scene.name}</b></p>
      ${tutorialGuideLine(brief, "scene")}
      <p class="side-signal">回放开始。只听台词，不急着站队。</p>
      <div class="call-dialogue">
        ${brief.sceneVersions.map((item, index) => {
          const version = versionStates[index] ?? {};
          const options = sceneQuestionOptions(item, index);
          const lineClass = item.speakerId
            ? item.speakerId === brief.complainantId ? "caller" : "other"
            : "host";
          return `
            <div class="call-line ${lineClass}">
              <b>${item.speaker}</b>
              <p>${item.version}</p>
              <p class="muted">${item.doubt}</p>
              <div class="inline-actions">
                ${options.map((option, optionIndex) => `
                  <button data-version-question="${index}:${optionIndex}" ${version.disabled} type="button">${version.done ? "已问到关键" : option.question}</button>
                `).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
      ${contradictions.length ? `<p class="signal signal-yellow">已发现迷惑点：${contradictions.slice(-2).join(" / ")}</p>` : ""}
      <p class="side-signal">孟姐把三段说法压到记事本上：先问咨询者，再补另一方情况，最后看证物能不能接住。</p>
    `,
    choices: `
      <button data-scene-question="complainant" ${questionStates.complainant} type="button">询问咨询者</button>
      <button data-scene-question="respondent" ${questionStates.respondent} type="button">询问另一方的情况</button>
      <button data-scene-question="details" ${questionStates.details} type="button">核对现场细节</button>
      <button class="primary" data-case-scene="testimony" type="button">整理成逐句证词</button>
    `
  };
}

function sceneQuestionOptions(item, index) {
  if (Array.isArray(item.questionOptions) && item.questionOptions.length) return item.questionOptions;
  const factual = index === 2
    ? "这份材料只能证明哪一部分？"
    : "你刚才省略的是哪一段？";
  return [
    {
      question: factual,
      answer: item.contradiction ?? "这段说法里有一个事实缺口被问出来了。",
      contradiction: item.contradiction,
      correct: true
    },
    {
      question: index === 0 ? "所以你觉得全是对方的问题？" : "你能保证自己这版没有修剪吗？",
      answer: `${item.speaker} 的语气明显防御起来，开始重复立场，没有补出新事实。`,
      correct: false
    }
  ];
}

export function evidenceView({
  chapter,
  brief,
  budgetText,
  archiveBlock,
  tutorialPracticeBlock,
  contradictionCount,
  insights,
  timelineHint,
  contradictions,
  hiddenHint,
  evidenceStates,
  specialtySkill,
  inspiration
}) {
  return {
    chapter,
    text: `
      <p><b>调查记事本</b></p>
      <p class="hint">${budgetText}</p>
      ${tutorialGuideLine(brief, "evidence")}
      ${brief.storyClueObject ? `<p class="episode-hook">主线物证：${brief.storyClueObject}</p>` : ""}
      ${archiveBlock}
      ${tutorialPracticeBlock}
      <div class="notebook-board">
        <section>
          <h3>已记下的矛盾</h3>
          ${contradictions.length
            ? `<ul>${contradictions.slice(-5).map((line) => `<li>${line}</li>`).join("")}</ul>`
            : `<p>还没有足够矛盾。先回现场或证词页继续追问。</p>`}
        </section>
        <section>
          <h3>可用证物</h3>
          <div class="court-record compact-record">
            ${(brief.evidenceCards ?? []).slice(0, 6).map((card) => `<p><b>${card.type}｜${card.title}</b><br><span>${card.front}</span></p>`).join("")}
          </div>
        </section>
      </div>
      ${insights.length ? `<p><b>整理发现</b>：${insights.slice(-3).join(" / ")}</p>` : ""}
      ${timelineHint ? `<p class="signal signal-yellow">时间线追踪工具提示：${timelineHint}</p>` : ""}
      ${hiddenHint}
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">调查：现场回放</button>
      <button data-case-scene="testimony" type="button">询问：继续逐句问</button>
      <button data-evidence="timeline" ${evidenceStates.timeline} type="button">整理：时间线</button>
      <button data-evidence="money" ${evidenceStates.money} type="button">整理：钱和资源</button>
      <button data-evidence="motive" ${evidenceStates.motive} type="button">整理：动机收益</button>
      ${specialtySkill}
      <button class="primary" data-case-scene="accusation" type="button">进入阶段指认</button>
    `
  };
}

export function accusationView({
  chapter,
  brief,
  budgetText,
  contradictions,
  hint,
  complainantName,
  respondentName,
  structuralChoice,
  inspiration
}) {
  return {
    chapter,
    text: `
      <p><b>阶段指认</b></p>
      <p class="hint">${budgetText}</p>
      ${tutorialGuideLine(brief, "accusation")}
      <p>${brief.caseMode === "confession" ? "你不需要审判这位告解者，但必须判断 TA 的自述里哪里是被坑、哪里是自欺、哪里可能也伤害了别人。" : "你不需要一次性给出全部法律结论，但必须判断目前谁的叙事最需要被拆开。没有抓到足够矛盾点时，任何指认都可能只是被台词带着走。"}</p>
      <p><b>已发现矛盾点</b>：${contradictions.length ? contradictions.join(" / ") : "暂无，建议回去追问。"}</p>
      <p class="hint">${hint}</p>
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回现场复原</button>
      <button data-case-scene="testimony" type="button">回证词追问</button>
      <button data-accuse="${brief.complainantId}" type="button">${brief.caseMode === "confession" ? `重点拆 ${complainantName} 的自述` : `重点指向 ${complainantName}`}</button>
      <button data-accuse="${brief.respondentId}" type="button">重点指向 ${respondentName}</button>
      ${structuralChoice}
      <button data-accuse="both" type="button">${brief.caseMode === "confession" ? "自我选择和对方行为都要查" : "双方都有隐瞒"}</button>
      <button data-accuse="noPremeditated" type="button">${brief.caseMode === "confession" ? "暂判不是骗局，是选择机制失衡" : "暂判无预谋，只是关系失衡"}</button>
    `
  };
}

export function confessionTimelineView({
  chapter,
  brief,
  budgetText,
  coldOpen,
  marks,
  markLabels,
  markStates,
  contradictions,
  inspiration
}) {
  return {
    chapter,
    text: `
      <p><b>告解时间线</b></p>
      <p class="hint">${budgetText}</p>
      <p class="episode-hook">${coldOpen}</p>
      <p>这次不是比对两个人谁说得更顺，而是把当事人的经历拆成节点。每个节点都要判断：TA 是被坑、在自欺，还是也可能伤了别人。</p>
      <div class="scene-list">
        ${(brief.confessionTimeline ?? []).map((node, index) => `
          <p><b>${index + 1}. ${node.label}</b>：${node.text}<br>
          <span>${marks[node.id] ? `你的标注：${markLabels[marks[node.id]]}` : "尚未标注"}</span><br>
          ${Object.entries(markLabels).map(([mark, label]) => {
            const state = markStates[`${node.id}:${mark}`] ?? {};
            return `<button data-confession="${node.id}:${mark}" ${state.disabled} type="button">${label}</button>`;
          }).join("")}
          </p>
        `).join("")}
      </div>
      ${contradictions.length ? `<p class="signal signal-yellow">已发现自述断点：${contradictions.slice(-3).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-case-scene="testimony" type="button">继续听 TA 告解</button>
      <button class="primary" data-case-scene="evidence" type="button">整理自我核验证据</button>
    `
  };
}

export function testimonyView({
  chapter,
  brief,
  budgetText,
  testimonyBeat,
  testimonyIndex,
  currentTestimony,
  selectedCard,
  notes,
  contradictions,
  followupStates,
  presentStates,
  specialtySkill,
  inspiration
}) {
  const total = brief.testimony?.length ?? 0;
  const item = currentTestimony ?? {};
  const currentFollowups = item.followups ?? [];
  const currentIndex = Math.max(0, testimonyIndex ?? 0);
  return {
    chapter,
    text: `
      <p><b>逐句询问记录</b></p>
      ${tutorialGuideLine(brief, "testimony")}
      <p class="signal signal-yellow">第 ${currentIndex + 1}/${total} 句证词｜当前证物：${selectedCard ? `${selectedCard.type}｜${selectedCard.title}` : "未选择"}</p>
      <div class="call-dialogue">
        <div class="call-line ${item.speakerId ? item.speakerId === brief.complainantId ? "caller" : "other" : "host"} active-testimony">
          <b>${item.speaker ?? "证词"}<span>${item.surface ?? ""}</span></b>
          <p>${item.line ?? "暂无证词。"}</p>
          <div class="inline-actions">
            ${currentFollowups.map((followup, followupIndex) => {
              const state = followupStates[`${currentIndex}:${followupIndex}`] ?? {};
              return `<button data-followup="${currentIndex}:${followupIndex}" ${state.disabled} type="button">${state.done ? "已询问" : followup.question}</button>`;
            }).join("")}
            <button data-present="${currentIndex}" ${presentStates[currentIndex] ?? "disabled"} type="button">出示当前证据</button>
          </div>
        </div>
      </div>
      <details class="evidence-drawer">
        <summary>证物夹</summary>
        <div class="court-record compact-record">
          ${(brief.evidenceCards ?? []).map((card) => `
            <p><b>${card.type}｜${card.title}</b><br><span>${card.front}</span><br><button data-select-card="${card.id}" type="button">${selectedCard?.id === card.id ? "已选中" : "选为证物"}</button></p>
          `).join("")}
        </div>
      </details>
      ${notes.length ? `<p class="reaction">已询问：${notes.slice(-2).join(" / ")}</p>` : ""}
      ${contradictions.length ? `<p class="signal signal-yellow">已发现矛盾：${contradictions.slice(-3).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回到现场复原</button>
      <button data-testimony-prev ${currentIndex <= 0 ? "disabled" : ""} type="button">上一句</button>
      <button data-testimony-next ${currentIndex >= total - 1 ? "disabled" : ""} type="button">下一句</button>
      ${specialtySkill}
      <button class="primary" data-case-scene="evidence" type="button">整理证据卡</button>
    `
  };
}
