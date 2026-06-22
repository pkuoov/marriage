import { plotThreadsBlock, storyCallsBlock, tutorialGuideLine } from "./caseFragments.js?v=0.14.0";

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
  threadLine,
  agencyBattle,
  earlyWarning,
  showStreamline,
  scanDisabled
}) {
  return {
    chapter,
    text: `
      <p class="episode-hook"><b>${playthroughLabel}</b>：${opening.hook}</p>
      ${coldOpen}
      ${tutorialGuideLine(brief, "open")}
      <p class="side-signal">${opening.director}</p>
      <p><b>案由</b>：${brief.label}｜${difficultyText}</p>
      ${brief.contentWarning ? `<p class="signal signal-yellow"><b>内容提示</b>：${brief.contentWarning}</p>` : ""}
      <p>${brief.openingComplaint}</p>
      <p class="hint">${brief.publicHook}</p>
      ${storyCallsBlock(brief)}
      <div class="scene-list">
        <p><b>栏目</b>：${brief.modeLabel ?? "婚恋 case"}</p>
        ${brief.storySetName ? `<p><b>档案组</b>：${brief.storySetName}</p>` : ""}
        <p><b>先诉苦的人</b>：${complainantName}</p>
        <p><b>另一方</b>：${respondentName}</p>
        <p><b>本案结构</b>：${structureText}</p>
        <p><b>调查资源</b>：${budgetText}</p>
        ${brief.storySuspense ? `<p><b>主线疑问</b>：${brief.storySuspense}</p>` : ""}
        ${brief.storyClueObject ? `<p><b>悬念物</b>：${brief.storyClueObject}</p>` : ""}
        <p><b>旧档牵连</b>：${threadLine}</p>
        <p><b>侦探局战况</b>：${agencyBattle}</p>
        <p><b>开场压力</b>：${opening.pressure}</p>
        ${earlyWarning ? `<p><b>提前预警</b>：${earlyWarning}</p>` : ""}
      </div>
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
      <p class="hint">${budgetText}</p>
      ${tutorialGuideLine(brief, "scene")}
      <p class="episode-hook">${beat}</p>
      ${brief.storyMislead ? `<p class="side-signal"><b>误导方向</b>：${brief.storyMislead}</p>` : ""}
      <p>${brief.scene.description}</p>
      <p class="side-signal">${brief.scene.dialogue}</p>
      <p>注意：场景复原不是事实本身，只是当事人带着立场复述的版本。你需要比对版本，而不是相信讲得更顺的那个人。</p>
      <div class="scene-list">
        ${brief.sceneVersions.map((item, index) => {
          const version = versionStates[index] ?? {};
          return `<p><b>${item.speaker}</b>：${item.version}<br><span>${item.doubt}</span><br><button data-version="${index}" ${version.disabled} type="button">${version.done ? "已比对" : "比对这个版本"}</button></p>`;
        }).join("")}
      </div>
      ${contradictions.length ? `<p class="signal signal-yellow">已发现迷惑点：${contradictions.slice(-2).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-scene-question="complainant" ${questionStates.complainant} type="button">追问先诉苦者</button>
      <button data-scene-question="respondent" ${questionStates.respondent} type="button">追问另一方</button>
      <button data-scene-question="details" ${questionStates.details} type="button">追问现场细节</button>
      <button class="primary" data-case-scene="testimony" type="button">进入证词交叉追问</button>
    `
  };
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
      <p><b>证据卡</b></p>
      <p class="hint">${budgetText}</p>
      ${tutorialGuideLine(brief, "evidence")}
      ${brief.storyClueObject ? `<p class="episode-hook">主线悬念物：${brief.storyClueObject}。它未必能直接定案，但会决定你如何理解下一案。</p>` : ""}
      ${archiveBlock}
      ${tutorialPracticeBlock}
      ${plotThreadsBlock(brief, contradictionCount)}
      <div class="scene-list">
        ${(brief.evidenceCards ?? []).map((card) => `<p><b>${card.type}｜${card.title}</b><br><span>${card.front}</span><br><span>${card.detail}</span></p>`).join("")}
      </div>
      ${insights.length ? `<p><b>证据整理发现</b>：${insights.join(" / ")}</p>` : ""}
      ${timelineHint ? `<p class="signal signal-yellow">时间线追踪工具提示：${timelineHint}</p>` : ""}
      ${contradictions.length ? `<p><b>已抓到的迷惑点/矛盾点</b>：${contradictions.join(" / ")}</p>` : ""}
      ${hiddenHint}
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回现场复原继续比对</button>
      <button data-case-scene="testimony" type="button">回证词继续追问</button>
      <button data-evidence="timeline" ${evidenceStates.timeline} type="button">按时间线重排</button>
      <button data-evidence="money" ${evidenceStates.money} type="button">优先查钱和资源</button>
      <button data-evidence="motive" ${evidenceStates.motive} type="button">回到动机和收益</button>
      ${specialtySkill}
      ${inspiration}
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
      ${inspiration}
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
      ${inspiration}
      <button class="primary" data-case-scene="evidence" type="button">整理自我核验证据</button>
    `
  };
}

export function testimonyView({
  chapter,
  brief,
  budgetText,
  testimonyBeat,
  selectedCard,
  notes,
  contradictions,
  followupStates,
  presentStates,
  specialtySkill,
  inspiration
}) {
  return {
    chapter,
    text: `
      <p><b>证词交叉追问</b></p>
      <p class="hint">${budgetText}</p>
      ${tutorialGuideLine(brief, "testimony")}
      <p class="episode-hook">${testimonyBeat}</p>
      <p>每一句话都可能是假话、含糊话、半真话，或者当事人不愿意说完整的真话。直播间里最有力的证据，往往是 TA 前面自己说过的话。</p>
      <p class="signal signal-yellow">当前出示卡：${selectedCard ? `${selectedCard.type}｜${selectedCard.title}` : "未选择。你可以先从下方证据卡选一张。"}</p>
      <div class="scene-list">
        ${(brief.evidenceCards ?? []).map((card) => `
          <p><b>${card.type}｜${card.title}</b><br><span>${card.front}</span><br><button data-select-card="${card.id}" type="button">${selectedCard?.id === card.id ? "已选中" : "选为出示证据"}</button></p>
        `).join("")}
      </div>
      <div class="scene-list">
        ${brief.testimony.map((item, index) => `
          <p><b>${item.speaker}</b> <span class="status-badge badge-locked">${item.surface}</span>：${item.line}<br>
          ${(item.followups ?? []).map((followup, followupIndex) => {
            const state = followupStates[`${index}:${followupIndex}`] ?? {};
            return `<button data-followup="${index}:${followupIndex}" ${state.disabled} type="button">${state.done ? "已追问" : followup.question}</button>`;
          }).join("")}
          <button data-present="${index}" ${presentStates[index] ?? "disabled"} type="button">出示当前证据</button>
          </p>
        `).join("")}
      </div>
      ${notes.length ? `<p class="reaction">已追问：${notes.slice(-2).join(" / ")}</p>` : ""}
      ${contradictions.length ? `<p class="signal signal-yellow">已发现矛盾：${contradictions.slice(-3).join(" / ")}</p>` : ""}
    `,
    choices: `
      <button data-case-scene="sceneReview" type="button">回到现场复原</button>
      ${specialtySkill}
      ${inspiration}
      <button class="primary" data-case-scene="evidence" type="button">整理证据卡</button>
    `
  };
}
