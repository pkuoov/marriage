import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "steam-demo-01";
const checkOnly = process.argv.includes("--check");
const manifest = await readJson(`content/packs/${packId}/manifest.json`);
const comments = await readJson(`content/packs/${packId}/comments.json`);
const castRegistry = await readJson("content/characters/cast.json");
const helperRegistry = await readJson("content/characters/helper-npcs.json").catch(() => ({ helpers: [] }));
const vBroPlayerVisible = helperRegistry.helpers?.find((helper) => helper.id === "v-bro")?.playerVisible !== false;
const casePackets = await Promise.all(
  manifest.sequence.map((item) => readJson(`content/packs/${packId}/cases/${item.caseId}.json`))
);
const quickCasePackets = await Promise.all(
  (manifest.quickCases ?? []).map((quickCaseId) => readJson(`content/packs/${packId}/quick-cases/${quickCaseId}.json`))
);
const continuousStoryRoutes = {
  "01-credit": {
    helperSceneId: "credit-eight-wan-bill",
    interludeActionId: "recheck-history-pages",
    dayStops: [
      { sceneId: "day-support-payments", optionId: "ask-rent-home" },
      { sceneId: "day-bank-flow", documentQuestionRowId: "r13" }
    ],
    callbackEarnedItem: "流水圈注",
    posture: "withCaller",
    snapshot: "both-performed",
    callerQuestionChoiceId: "dont-answer-for-her",
    accusationChoiceIndex: 3,
    backflowHookId: "credit-friend-dm",
    careChoiceId: "pragmatic"
  },
  "02-tony": {
    helperSceneId: "tony-roster-function-notes",
    interludeActionId: "listen-dryer",
    dayStops: [
      { sceneId: "day-tony-shop-observe", optionId: "note-shared-address" },
      { sceneId: "day-tony-friend-studio", optionId: "split-template" }
    ],
    callbackEarnedItem: "吹风机回放",
    posture: "withCaller",
    snapshot: "industry-gray",
    accusationChoiceIndex: 3,
    backflowHookId: "tony-manager-training-note",
    careChoiceId: "affirm"
  },
  "03-profile": {
    helperSceneId: "profile-mba-wording",
    interludeActionId: "profile-listen-dinner-pause",
    dayStops: [
      { sceneId: "day-profile-teahouse", optionId: "keep-both-records" },
      { sceneId: "day-profile-credential-docs" }
    ],
    callbackEarnedItem: "双份材料圈注",
    posture: "withCaller",
    snapshot: "market-coauthored",
    accusationChoiceIndex: 1,
    backflowHookId: "profile-family-chat-backflow",
    careChoiceId: "accompany"
  },
  "04-workplace": {
    helperSceneId: "work-approval-only",
    interludeActionId: "recheck-approval-page",
    dayStops: [
      { sceneId: "day-work-finance-window", optionId: "keep-payment-receipt-rule" },
      { sceneId: "day-work-supplier-visit", optionId: "keep-supplier-contact-column" }
    ],
    callbackEarnedItem: "财务窗口回单要求",
    posture: "withCaller",
    snapshot: "caller-complicit",
    accusationChoiceIndex: 2,
    backflowHookId: "work-assistant-flow-sample",
    careChoiceId: "affirm"
  }
};
const outputs = [
  {
    path: resolve(root, "docs", "generated", `${packId}-full-readable-script.md`),
    label: "Full readable script",
    content: renderScript()
  },
  {
    path: resolve(root, "docs", "generated", `${packId}-director-script.md`),
    label: "Director script",
    content: renderDirectorScript()
  },
  {
    path: resolve(root, "docs", "generated", `${packId}-pure-story-script.md`),
    label: "Pure story script",
    content: renderPureStoryScript()
  },
  {
    path: resolve(root, "docs", "generated", `${packId}-continuous-story-script.md`),
    label: "Continuous story script",
    content: renderContinuousStoryScript()
  }
];
assertSourceCompleteness(outputs[0].content, {
  manifest,
  comments,
  cases: casePackets.map(projectPlayableCaseSource),
  quickCases: quickCasePackets
});
assertContinuousStory(outputs[3].content, casePackets);

if (checkOnly) {
  for (const output of outputs) {
    const current = await readFile(output.path, "utf8").catch(() => "");
    if (current !== output.content) throw new Error(`${output.label} is stale; run npm run content:script -- ${packId}`);
  }
} else {
  for (const output of outputs) {
    await mkdir(dirname(output.path), { recursive: true });
    await writeFile(output.path, output.content);
    console.log(`${output.label} ready: ${output.path}`);
  }
}

function renderScript() {
  const lines = [];
  const add = (...items) => lines.push(...items);
  const sequenceByCaseId = new Map(manifest.sequence.map((item) => [item.caseId, item]));
  const profilesById = new Map((castRegistry.cast ?? []).map((profile) => [profile.id, profile]));

  add(`# 《${manifest.title}》全量可读文字剧本`, "");
  add("> 本文档由内容包自动汇编。它按真实游玩阶段整理夜 A、收麦幕间、白天调查、夜 B、材料与所有分支；同一阶段的互斥选项会并列收录，不表示它们会在一次实机流程里连续发生。方括号内是舞台或玩法说明，不是角色台词。需要逐屏核对固定代表路线时，请看“连续故事台本”。请修改 JSON 真源后运行 `npm run content:script`，不要手改本文档。", "");
  add("## 阅读图例", "");
  add("- **角色名：** 玩家能听见或读到的台词。", "- `【可选】` 表示玩家选择、失败反馈、顾问分歧或未必进入本轮的分支。", "- `【编剧资料】` 表示真相边界、人物利益、路线轴等不会原样播出的制作信息。", "- 同一个表面名（如“咨询者”）只在所属案件内指向该案角色。", "");

  add("## 故事包总纲", "");
  add(`- **主题：** ${manifest.theme?.title ?? ""}`);
  add(`- **开场提示：** ${manifest.theme?.intro ?? ""}`);
  add(`- **主题句：** ${manifest.theme?.thesis ?? ""}`);
  add(`- **观众观察题：** ${manifest.theme?.commentPrompt ?? ""}`);
  if (manifest.theme?.hiddenThread) renderNode(lines, manifest.theme.hiddenThread, "暗线", 3);
  add("");

  add("## 【编剧资料】案件顺序与舞台索引", "");
  add(`- **内容包 ID：** ${manifest.id}`);
  add(`- **案件数：** ${manifest.size}`);
  renderNode(lines, manifest.fictionalEntities, "虚构机构登记", 3);
  renderNode(lines, manifest.crossCasePromises, "跨案承诺账本", 3);
  renderNode(lines, manifest.caseLabels, "来电标签", 3);
  renderNode(lines, manifest.sequence, "案件顺序", 3);
  renderNode(lines, manifest.quickCases, "独立快案入口", 3);
  add("");

  add("## 演员与声纹速查", "");
  add("| 角色 | 类型 | 固定性格 | 压力反应 | 主要声纹 |", "|---|---|---|---|---|");
  for (const profile of castRegistry.cast ?? []) {
    if (profile.id === "v-bro" && !vBroPlayerVisible) continue;
    add(`| ${cell(profile.name)} | ${cell(profile.kind)} | ${cell(profile.personality?.core)} | ${cell(profile.personality?.stressResponse)} | ${cell([profile.voice?.rhythm, ...(profile.voice?.lexicon ?? [])].filter(Boolean).join("；"))} |`);
  }
  add("");

  add("## 序幕：晚上八点，开播", "");
  for (const line of manifest.nightShell?.prologue?.lines ?? []) renderSpokenLine(lines, line);
  if (manifest.nightShell?.prologue?.hostLine) renderSpokenLine(lines, manifest.nightShell.prologue.hostLine);
  add("");

  casePackets.forEach((packet, caseIndex) => {
    const item = sequenceByCaseId.get(packet.caseId) ?? {};
    const caseNumber = chineseNumber(caseIndex + 1);
    const title = packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? packet.caseId;
    add(`# 第${caseNumber}幕：${title}`, "");
    add(`- **案件 ID：** ${packet.caseId}`);
    add(`- **剧情 ID：** ${packet.plotId}`);
    if (packet.storyArcTitle) add(`- **内容包原题：** ${packet.storyArcTitle}`);
    if (packet.caseTitle?.subtitle) add(`- **副标题：** ${packet.caseTitle.subtitle}`);
    add("");

    add("## 本案人物", "");
    add("| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |", "|---|---|---|---|---|");
    for (const profileId of item.castProfileIds ?? []) {
      const profile = profilesById.get(profileId);
      if (!profile) continue;
      add(`| ${cell(profile.name)} | ${cell(profile.personality?.core)} | ${cell(profile.motivation)} | ${cell(profile.defense)} | ${cell(profile.knowledgeBoundary)} |`);
    }
    add("");

    add("## 【编剧资料】案件发动机", "");
    for (const key of ["dramaticAnchor", "whyTonight", "helpRequest", "objectPurpose", "callerStake", "otherStake", "thirdPressure", "selfServingOmission", "publicHook", "storyArcSummary", "storySuspense", "storyClueObject"]) {
      if (packet[key] !== undefined) renderNode(lines, packet[key], key, 3);
    }
    add("");

    add("## 夜 A：第一次来电", "");
    for (const line of packet.openingDialogue ?? []) renderSpokenLine(lines, line);
    const firstNightIndexes = packet.nightStructure?.segment1SceneIndexes ?? [];
    firstNightIndexes.forEach((sceneIndex, localIndex) => renderScene(lines, packet.sceneVersions?.[sceneIndex], sceneIndex, `夜 A · ${localIndex + 1}`));
    renderNode(lines, packet.stanceSnapshot, "中段立场快照", 3);
    renderNode(lines, packet.nightStructure?.hangup, "第一次收麦", 3);
    add("");

    add("## 收麦幕间：控台短查", "");
    renderNode(lines, packet.nightStructure?.interlude, "幕间行动", 3);
    if (packet.delegation) renderNode(lines, packet.delegation, "证据委托", 3);
    add("");

    add("## 白天调查", "");
    const overnight = packet.overnightStructure ?? {};
    for (const key of ["dayIntro", "dayBudget", "minDayScenes"]) {
      if (overnight[key] !== undefined) renderNode(lines, overnight[key], key, 3);
    }
    (overnight.dayScenes ?? []).forEach((scene, index) => renderNode(lines, scene, `地点 ${index + 1}`, 3));
    if (overnight.interludeEarnedItemMap) renderNode(lines, overnight.interludeEarnedItemMap, "幕间物件映射", 3);
    add("");

    add("## 夜 B：回拨", "");
    for (const key of ["hangupAnchor", "hangupLine", "hangupAudioCueId", "hostHoldLine"]) {
      if (overnight[key] !== undefined) renderNode(lines, overnight[key], key, 3);
    }
    renderNode(lines, overnight.callbackOpeners, "带回物开场（全部分支）", 3);
    renderNode(lines, overnight.callbackFallback, "无带回物兜底开场", 3);
    renderNode(lines, overnight.postures, "回拨立场", 3);
    renderNode(lines, overnight.returnLead, "回拨先行拍", 3);
    renderNode(lines, overnight.returnBeat, "回拨后的生活拍", 3);
    renderNode(lines, overnight.snapshotEcho, "立场快照回应拍", 3);
    renderNode(lines, overnight.callerQuestion, "来电人反问", 3);
    const secondNightIndexes = packet.nightStructure?.segment2SceneIndexes ?? [];
    secondNightIndexes.forEach((sceneIndex, localIndex) => {
      (overnight.liveCounterBeats ?? []).filter((beat) => beat.beforeSceneIndex === sceneIndex).forEach((beat) => renderNode(lines, beat, "场前情绪反应", 3));
      renderScene(lines, packet.sceneVersions?.[sceneIndex], sceneIndex, `夜 B · ${localIndex + 1}`);
      (overnight.liveCounterBeats ?? []).filter((beat) => beat.afterSceneIndex === sceneIndex).forEach((beat) => renderNode(lines, beat, "场间实时反压", 3));
    });
    renderNode(lines, packet.nightStructure?.returnStance, "回拨后立场", 3);
    add("");

    add("## 材料、回流与可选追查", "");
    for (const [key, label] of [
      ["evidenceCards", "证据卡"],
      ["evidenceChecks", "材料圈点"],
      ["investigationHooks", "后台回流"],
      ["documents", "文档原件"],
      ["advisorNotes", "顾问留言"],
      ["respondentNote", "对方留言"],
      ["lurkerNote", "同席回声"],
      ["crossCaseEchoes", "跨案回声"]
    ]) {
      if (packet[key] !== undefined && (!Array.isArray(packet[key]) || packet[key].length)) renderNode(lines, packet[key], label, 3);
    }
    add("");

    add("## 收束与结案", "");
    for (const key of ["hostDisclosure", "hostWoundHook", "deepFollowup", "stageJudgement", "quotePickCandidates", "accusationChoices", "careChoices", "caseClosing", "storyInterludeRecap", "conclusionWhenCleared", "conclusionBranches", "followupTwist", "dailyShareTitle", "dailyShareBody", "dailyShareQuestion", "truth"]) {
      if (packet[key] !== undefined) renderNode(lines, packet[key], key, 3);
    }
    add("");

    add("## 【编剧资料】事实边界与运行规则", "");
    if (packet.openingComplaint) renderNode(lines, packet.openingComplaint, "内部来电索引", 3);
    const alreadyRendered = new Set([
      "caseId", "plotId", "label", "storyArcTitle", "caseTitle", "dramaticAnchor", "whyTonight", "helpRequest", "objectPurpose", "callerStake", "otherStake", "thirdPressure", "selfServingOmission", "publicHook", "storyArcSummary", "storySuspense", "storyClueObject", "openingComplaint", "openingDialogue", "sceneVersions", "nightStructure", "overnightStructure", "stanceSnapshot", "delegation", "evidenceCards", "evidenceChecks", "investigationHooks", "documents", "advisorNotes", "respondentNote", "lurkerNote", "crossCaseEchoes", "hostDisclosure", "hostWoundHook", "deepFollowup", "stageJudgement", "quotePickCandidates", "accusationChoices", "careChoices", "caseClosing", "storyInterludeRecap", "conclusionWhenCleared", "conclusionBranches", "followupTwist", "dailyShareTitle", "dailyShareBody", "dailyShareQuestion", "truth"
    ]);
    for (const [key, value] of Object.entries(packet)) {
      if (!alreadyRendered.has(key)) renderNode(lines, value, key, 3);
    }
    add("");

    const interlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === packet.caseId);
    if (interlude) {
      add(`## ${interlude.kicker ?? "案间串场"}`, "");
      for (const line of interlude.lines ?? []) renderSpokenLine(lines, line);
      if (interlude.line) add(interlude.line, "");
      for (const line of interlude.afterLines ?? []) renderSpokenLine(lines, line);
      renderTransitionQuote(lines, interlude.transitionQuote);
      renderWorldEcho(lines, interlude.worldEcho, true);
    }
  });

  if (quickCasePackets.length) {
    add("# 独立模式：直播快案", "");
    add("> 快案不属于四幕主线。每听完一个局部段落，玩家判断当前已经出现的问题；当面对质逼出的改口，再带出下一段。", "");
    for (const packet of quickCasePackets) {
      add(`## ${packet.label}：${packet.title}`, "");
      add(`- **开场：** ${packet.premise}`, "");
      renderNode(lines, {
        whyTonight: packet.whyTonight,
        helpRequest: packet.helpRequest,
        callerStake: packet.callerStake,
        selfServingOmission: packet.selfServingOmission,
        coverStrategy: packet.coverStrategy,
        caseLedger: packet.caseLedger,
        deceptionChain: packet.deceptionChain
      }, "求助与重大隐瞒", 3);
      renderReadableQuickRounds(lines, packet);
      add("", "### 主播结案复盘", "");
      if (packet.ending?.verdictKicker) add(`> ${packet.ending.verdictKicker}`, "");
      for (const [pageIndex, page] of (packet.ending?.summaryPages ?? []).entries()) {
        add(`#### ${page.kicker ?? `总结第 ${pageIndex + 1} 页`}｜${page.title ?? packet.title}`, "");
        if (page.stageLabel) add(`【舞台状态】${page.stageLabel}`, "");
        for (const line of page.lines ?? []) {
          add(`**${line.role === "caller" ? "来电人" : "林旭阳"}：** ${line.text}`, "");
        }
      }
      renderNode(lines, {
        riskReading: packet.ending?.riskReading,
        confirmedTitle: packet.ending?.confirmedTitle,
        confirmed: packet.ending?.confirmed,
        unknownTitle: packet.ending?.unknownTitle,
        unknown: packet.ending?.unknown
      }, "制作边界（不上屏）", 4);
      add(`- **改写边界：** ${packet.sourceBoundary}`, "");
      renderNode(lines, packet.presentation, "UI 舞台配置（非剧情证据）", 4);
      renderNode(lines, {
        id: packet.id,
        caseNumber: packet.caseNumber,
        castProfileId: packet.castProfileId,
        confrontationCount: packet.confrontations?.length ?? 0
      }, "运行规则", 4);
      add("");
    }
  }

  add("# 尾声", "");
  renderNode(lines, manifest.nightShell?.epilogue, "收播后", 2);
  add("", "# 评论与分享文案库", "");
  renderNode(lines, comments, "评论种子", 2);
  add("");
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function quickConfrontationLines(confrontation = {}) {
  if (Array.isArray(confrontation.lines) && confrontation.lines.length) return confrontation.lines;
  return [
    confrontation.host ? { role: "host", text: confrontation.host } : null,
    confrontation.caller ? { role: "caller", text: confrontation.caller } : null
  ].filter(Boolean);
}

function renderReadableQuickRounds(lines, packet) {
  const turnsById = new Map((packet.turns ?? []).map((turn, index) => [turn.id, { turn, index }]));
  const optionsById = new Map((packet.issueOptions ?? []).map((option) => [option.id, option]));
  const confrontationsById = new Map((packet.confrontations ?? []).map((item) => [item.id, item]));
  const rounds = packet.disclosureRounds?.length
    ? packet.disclosureRounds
    : [{
        id: "full-call",
        label: "原始连线",
        turnIds: (packet.turns ?? []).map((turn) => turn.id),
        issueOptionIds: (packet.issueOptions ?? []).map((option) => option.id),
        requiredConfrontationIds: (packet.confrontations ?? []).map((item) => item.id)
      }];

  rounds.forEach((round, roundIndex) => {
    lines.push(`### 第 ${roundIndex + 1} 轮｜${round.label ?? round.id}（${round.id}）`, "");
    lines.push("#### 普通问话", "");
    for (const turnId of round.turnIds ?? []) {
      const entry = turnsById.get(turnId);
      if (!entry) continue;
      const { turn, index } = entry;
      lines.push(`##### 第 ${index + 1} 组（${turn.id}）`, "");
      lines.push(`**林旭阳：** ${turn.host}`, "", `**来电人：** ${turn.caller}`, "");
      if (turn.ambientComments?.length) lines.push(`【实时评论】${turn.ambientComments.join("／")}`, "");
    }

    lines.push("#### 本轮玩家可选的问题方向", "");
    for (const optionId of round.issueOptionIds ?? []) {
      const option = optionsById.get(optionId);
      if (!option) continue;
      lines.push(`- **${option.id}**：${option.label}${option.confrontationId ? ` → 对质 ${option.confrontationId}` : " → 不触发对质"}`, "");
    }

    lines.push("#### 本轮当面对质", "");
    for (const confrontationId of round.requiredConfrontationIds ?? []) {
      const confrontation = confrontationsById.get(confrontationId);
      if (!confrontation) continue;
      lines.push(`##### ${confrontation.id}`, "");
      lines.push(`【依据话轮】${(confrontation.basisTurnIds ?? []).join(" / ")}`, "");
      if (confrontation.logicContract) renderNode(lines, confrontation.logicContract, "微因果合同", 6);
      const confrontationLines = quickConfrontationLines(confrontation);
      confrontationLines.forEach((line, lineIndex) => {
        lines.push(`**${line.role === "caller" ? "来电人" : "林旭阳"}：** ${line.text}`, "");
        if (confrontation.revealTransition?.lineIndex === lineIndex + 1) {
          const transition = confrontation.revealTransition;
          lines.push(`【画面短停，屏幕掠过“${transition.label}”。主播立绘提亮。】`, "");
          lines.push(`- **过场 ID：** ${transition.id}`, `- **过场类型：** ${transition.kind}`, `- **过场短标：** ${transition.eyebrow}`, `- **触发行：** ${transition.lineIndex}`, "");
        }
      });
      if (confrontation.revealTransition && !Number.isInteger(confrontation.revealTransition.lineIndex)) {
        const transition = confrontation.revealTransition;
        lines.push(`【画面短停，屏幕掠过“${transition.label}”。主播立绘提亮。】`, "");
        lines.push(`- **过场 ID：** ${transition.id}`, `- **过场类型：** ${transition.kind}`, `- **过场短标：** ${transition.eyebrow}`, "");
      }
    }
  });
}

function renderPureStoryScript() {
  const lines = [];

  lines.push(`# 《${manifest.title}》纯故事台本`, "");
  lines.push(
    "> 本稿是玩家可见内容的分支汇编，不是某一次游玩的逐屏录像。它保留故事、台词、动作、材料内容与玩家可能听见的分支，移除内部 ID、数值、判定规则、作者真相和工程字段；`【另一种接法】` 表示同一处互斥台词。需要按实际界面顺序连续阅读时，请看“连续故事台本”。本文由当前内容包自动生成，请修改 JSON 真源后运行 `npm run content:script`。",
    ""
  );
  lines.push("# 序幕｜晚上八点，开麦", "", "【直播间。控台灯亮，热线接入。】", "");
  for (const line of manifest.nightShell?.prologue?.lines ?? []) renderDirectorSpoken(lines, line);
  if (manifest.nightShell?.prologue?.hostLine) renderDirectorSpoken(lines, manifest.nightShell.prologue.hostLine);

  casePackets.forEach((packet, caseIndex) => {
    const title = packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? `第${caseIndex + 1}案`;
    lines.push(`# 第${chineseNumber(caseIndex + 1)}幕｜${title}`, "");
    if (packet.caseTitle?.subtitle) lines.push(`**副标题：** ${packet.caseTitle.subtitle}`, "");

    lines.push("## 第一夜｜第一次来电", "", "【开播。】", "");
    for (const line of packet.openingDialogue ?? []) renderDirectorSpoken(lines, line);
    (packet.nightStructure?.segment1SceneIndexes ?? []).forEach((sceneIndex, localIndex) => {
      renderPureStoryScene(lines, packet.sceneVersions?.[sceneIndex], `第一夜 · ${localIndex + 1}`);
    });
    renderDirectorHangup(lines, packet.nightStructure?.hangup);

    lines.push("## 收麦后｜控台短查", "");
    renderPureStoryInterlude(lines, packet.nightStructure?.interlude);
    if (packet.delegation?.depositLine) renderDirectorSpoken(lines, packet.delegation.depositLine);

    lines.push("## 白天｜离开直播间", "");
    const overnight = packet.overnightStructure ?? {};
    if (overnight.dayIntro) lines.push(`【${overnight.dayIntro}】`, "");
    for (const scene of overnight.dayScenes ?? []) renderPureStoryDayScene(lines, scene, packet.documents ?? []);

    lines.push("## 第二夜｜回拨", "");
    renderPureStoryCallerVariants(lines, "来电人的回拨立场", overnight.postures);
    for (const line of overnight.returnLead?.lines ?? []) renderDirectorSpoken(lines, line);
    renderPureStoryCallbackOpeners(lines, overnight.callbackOpeners, overnight.callbackFallback);
    renderPureStoryCallerVariants(lines, "她对昨夜判断的回应", overnight.snapshotEcho);
    for (const line of overnight.returnBeat?.lines ?? []) renderDirectorSpoken(lines, line);

    (packet.nightStructure?.segment2SceneIndexes ?? []).forEach((sceneIndex, localIndex) => {
      for (const beat of (overnight.liveCounterBeats ?? []).filter((item) => item.beforeSceneIndex === sceneIndex)) renderPureStoryLiveCounter(lines, beat);
      renderPureStoryScene(lines, packet.sceneVersions?.[sceneIndex], `第二夜 · ${localIndex + 1}`);
      for (const beat of (overnight.liveCounterBeats ?? []).filter((item) => item.afterSceneIndex === sceneIndex)) renderPureStoryLiveCounter(lines, beat);
    });
    renderPureStoryCallerQuestion(lines, overnight.callerQuestion);
    renderPureStoryMaterials(lines, packet);

    lines.push("## 结案｜确认到哪，停在哪", "");
    for (const line of packet.hostDisclosure?.lines ?? []) renderDirectorSpoken(lines, line);
    if (!packet.hostDisclosure?.lines?.length && packet.hostDisclosure?.text) lines.push(`**林旭阳：** ${packet.hostDisclosure.text}`, "");
    if (packet.deepFollowup?.question) {
      lines.push(`**林旭阳：** ${packet.deepFollowup.question}`, "");
      for (const beat of packet.deepFollowup.resistanceBeat?.lines ?? []) renderDirectorSpoken(lines, beat);
      lines.push(`**咨询者：** ${packet.deepFollowup.answer ?? ""}`, "");
    }
    if (packet.respondentNote?.text) lines.push(`【对方发来一条不能继续追问的后台留言】`, "", `**对方：** ${packet.respondentNote.text}`, "");
    if (packet.stageJudgement) lines.push(`**林旭阳：** ${packet.stageJudgement}`, "");
    renderDirectorCareChoices(lines, packet.careChoices);
    renderDirectorClosing(lines, packet.caseClosing);

    const interlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === packet.caseId);
    if (interlude) {
      lines.push(`## ${interlude.kicker ?? "案间｜广告与下一通热线"}`, "");
      for (const line of interlude.lines ?? []) renderDirectorSpoken(lines, line);
      if (interlude.line) lines.push(`【${interlude.line}】`, "");
      for (const line of interlude.afterLines ?? []) renderDirectorSpoken(lines, line);
      renderTransitionQuote(lines, interlude.transitionQuote);
      renderWorldEcho(lines, interlude.worldEcho);
    }
  });

  renderPureStoryEpilogue(lines, manifest.nightShell?.epilogue);
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function renderContinuousStoryScript() {
  const lines = [];

  lines.push("# 《深夜热线：直播间侦探》连续故事台本", "");
  lines.push(
    "> 固定一条完整可玩路线，按实机先后收录夜间问答、材料圈选、深入追问、最终追问、后台回流、连线回看、最后一句与案件结案，供连续阅读和流程核对。其他分支见“纯故事台本”和“全量可读文字剧本”。本文由 JSON 真源生成，请勿手改。",
    ""
  );
  lines.push("# 序幕｜晚上八点，开麦", "", "【直播间。控台灯亮，热线接入。】", "");
  for (const line of manifest.nightShell?.prologue?.lines ?? []) renderContinuousSpoken(lines, line);
  if (manifest.nightShell?.prologue?.hostLine) renderContinuousSpoken(lines, manifest.nightShell.prologue.hostLine);

  casePackets.forEach((packet, caseIndex) => {
    const route = continuousStoryRoutes[packet.caseId];
    if (!route) throw new Error(`${packet.caseId} 缺少连续阅读路线`);
    const title = continuousCaseTitle(packet, caseIndex);

    lines.push(`# 第${chineseNumber(caseIndex + 1)}幕｜${title}`, "");
    if (packet.caseTitle?.subtitle) lines.push(`**副标题：** ${packet.caseTitle.subtitle}`, "");

    lines.push("## 第一夜｜第一次来电", "", "【你接入电话。】", "");
    for (const line of packet.openingDialogue ?? []) renderContinuousSpoken(lines, line);
    const embeddedEvidenceCheckIds = new Set();
    for (const sceneIndex of packet.nightStructure?.segment1SceneIndexes ?? []) {
      renderContinuousScene(lines, packet.sceneVersions?.[sceneIndex], {
        includeHelper: vBroPlayerVisible && packet.sceneVersions?.[sceneIndex]?.id === route.helperSceneId
      });
      renderContinuousHostDisclosure(lines, packet, `afterScene:${sceneIndex + 1}`);
      renderContinuousAfterSceneEvidence(lines, packet, sceneIndex, embeddedEvidenceCheckIds);
    }
    renderDirectorHangup(lines, packet.nightStructure?.hangup);

    lines.push("## 收麦后｜控台只够做一件事", "");
    renderContinuousInterlude(lines, packet, route.interludeActionId, route.interludeOptionId);

    lines.push("## 白天｜沿两条线核实", "");
    if (packet.overnightStructure?.dayIntro) lines.push(`【${continuousStageText(packet.overnightStructure.dayIntro)}】`, "");
    for (const stop of route.dayStops) {
      const scene = (packet.overnightStructure?.dayScenes ?? []).find((entry) => entry.id === stop.sceneId);
      if (!scene) throw new Error(`${packet.caseId} 连续阅读路线找不到白天场景 ${stop.sceneId}`);
      renderContinuousDayScene(lines, scene, packet.documents ?? [], stop.optionId, stop.documentQuestionRowId);
    }

    lines.push("## 第二夜｜回拨", "");
    renderContinuousCallerVariant(lines, packet.overnightStructure?.postures, route.posture);
    for (const line of packet.overnightStructure?.returnLead?.lines ?? []) renderContinuousSpoken(lines, line);
    renderContinuousCallback(lines, packet, route.callbackEarnedItem);
    renderContinuousCallerVariant(lines, packet.overnightStructure?.snapshotEcho, route.snapshot);
    for (const line of packet.overnightStructure?.returnBeat?.lines ?? []) renderContinuousSpoken(lines, line);

    for (const sceneIndex of packet.nightStructure?.segment2SceneIndexes ?? []) {
      for (const beat of (packet.overnightStructure?.liveCounterBeats ?? []).filter((entry) => entry.beforeSceneIndex === sceneIndex)) {
        renderContinuousLiveCounter(lines, beat);
      }
      renderContinuousScene(lines, packet.sceneVersions?.[sceneIndex]);
      renderContinuousHostDisclosure(lines, packet, `afterScene:${sceneIndex + 1}`);
      renderContinuousAfterSceneEvidence(lines, packet, sceneIndex, embeddedEvidenceCheckIds);
      for (const beat of (packet.overnightStructure?.liveCounterBeats ?? []).filter((entry) => entry.afterSceneIndex === sceneIndex)) {
        renderContinuousLiveCounter(lines, beat);
      }
    }
    renderContinuousEvidenceChecks(lines, packet, embeddedEvidenceCheckIds);
    renderContinuousCallerQuestion(lines, packet.overnightStructure?.callerQuestion, route.callerQuestionChoiceId);

    lines.push("## 深入一问", "");
    renderContinuousHostDisclosure(lines, packet, "beforeDeepFollowup");
    if (packet.deepFollowup?.question) {
      lines.push(`**林旭阳：** ${packet.deepFollowup.question}`, "");
      for (const line of packet.deepFollowup.resistanceBeat?.lines ?? []) renderContinuousSpoken(lines, line);
      if (packet.deepFollowup.answer) lines.push(`**咨询者：** ${packet.deepFollowup.answer}`, "");
    }
    renderContinuousAccusation(lines, packet, route.accusationChoiceIndex);
    renderContinuousBackflow(lines, packet, route.backflowHookId);
    renderContinuousHostDisclosure(lines, packet, "afterBackflow");
    renderContinuousRecap(lines, packet, route.accusationChoiceIndex);
    renderContinuousCareChoice(lines, packet.careChoices, route.careChoiceId);
    renderContinuousCaseClosing(lines, packet.caseClosing);

    const interlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === packet.caseId);
    if (interlude) {
      lines.push(`## ${interlude.kicker ?? "案间｜下一通热线"}`, "");
      for (const line of interlude.lines ?? []) renderContinuousSpoken(lines, line);
      if (interlude.line) lines.push(`【${continuousStageText(interlude.line)}】`, "");
      for (const line of interlude.afterLines ?? []) renderContinuousSpoken(lines, line);
      renderTransitionQuote(lines, interlude.transitionQuote);
      renderWorldEcho(lines, interlude.worldEcho, false, false);
    }
  });

  renderContinuousEpilogue(lines, manifest.nightShell?.epilogue);
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function renderContinuousScene(lines, scene, { includeHelper = false } = {}) {
  if (!scene) return;
  for (const line of scene.beforeVersion?.lines ?? []) renderContinuousSpoken(lines, line);
  if (scene.entryQuestion) lines.push(`**林旭阳：** ${scene.entryQuestion}`, "");
  if (scene.version) lines.push(`**${scene.speaker ?? "咨询者"}：** ${scene.version}`, "");
  for (const line of scene.afterVersion?.lines ?? []) renderContinuousSpoken(lines, line);
  if (scene.pressureHint?.expression?.text) lines.push(`【${scene.pressureHint.expression.text}】`, "");
  if (includeHelper && scene.helperHint) {
    lines.push("【林旭阳按亮场外求助键】", "", `**V哥：** ${scene.helperHint}`, "");
  }
  const question = (scene.questionOptions ?? []).find((option) => option.correct) ?? scene.questionOptions?.[0];
  if (question?.revealTransition) lines.push(`【画面短停，屏幕掠过“${question.revealTransition.label}”。主播立绘提亮。】`, "");
  if (question?.question) lines.push(`**林旭阳：** ${question.question}`, "");
  for (const line of question?.resistanceBeat?.lines ?? []) renderContinuousSpoken(lines, line);
  if (question?.lines?.length) question.lines.forEach((line) => renderContinuousSpoken(lines, line));
  else if (question?.answer) lines.push(`**咨询者：** ${question.answer}`, "");
  if (question?.reactionLine) lines.push(`**咨询者：** ${question.reactionLine}`, "");
  for (const line of scene.sceneCloser?.lines ?? []) renderContinuousSpoken(lines, line);
}

function renderContinuousInterlude(lines, packet, actionId, optionId) {
  const interlude = packet.nightStructure?.interlude;
  if (!interlude) return;
  if (interlude.kicker) lines.push(`【${interlude.kicker}】`, "");
  const action = (interlude.actions ?? []).find((entry) => entry.id === actionId);
  if (!action) throw new Error(`连续阅读路线找不到幕间行动 ${actionId}`);
  lines.push(`### ${action.label ?? "控台短查"}`, "");
  if (action.sceneText) lines.push(`【${continuousStageText(action.sceneText)}】`, "");
  if (action.script?.open) lines.push(`**林旭阳：** ${action.script.open}`, "");
  if (action.script?.reply) lines.push(`**${advisorName(action.advisorId)}：** ${action.script.reply}`, "");
  if (action.script?.clipLine) lines.push(`【${action.script.clipLabel ?? "回放"}】${action.script.clipLine}`, "");
  if (action.script?.hostNote) lines.push(`【林旭阳记下】${action.script.hostNote}`, "");
  if (action.text) lines.push(`**${action.from ?? "后台"}：** ${action.text}`, "");
  if (action.kind === "evidencePass") {
    const check = (packet.evidenceChecks ?? []).find((entry) => action.focusCheckIds?.includes(entry.id));
    const selected = check?.options?.find((entry) => entry.correct) ?? check?.options?.[0];
    if (check?.material) lines.push(`【${check.title ?? "重看材料"}】${check.material}`, "");
    if (selected?.label) lines.push(`【你圈出：${selected.label}】`, "");
    if (selected?.feedback) lines.push(`**林旭阳：** ${selected.feedback}`, "");
  }
  if (optionId) {
    const option = (action.options ?? action.choices ?? []).find((entry) => entry.id === optionId);
    if (!option) throw new Error(`连续阅读路线找不到幕间选项 ${optionId}`);
    if (option.label) lines.push(`【你选择：${option.label}】`, "");
    if (option.advisorLine) lines.push(`**${advisorName(option.advisorId)}：** ${option.advisorLine}`, "");
  }
  const hasVisibleContent = action.sceneText || action.script?.open || action.script?.reply || action.script?.clipLine || action.text || action.kind === "evidencePass" || optionId;
  if (!hasVisibleContent && action.summary) lines.push(`【控台记录】${action.summary}`, "");
}

function renderContinuousDayScene(lines, scene, documents, optionId, documentQuestionRowId) {
  lines.push(`### ${scene.label ?? "白天地点"}`, "");
  const body = scene.body ?? {};
  if (body.access) lines.push(`【这次为什么能问】${continuousStageText(body.access)}`, "");
  if (body.text) lines.push(`【${continuousStageText(body.text)}】`, "");
  for (const beat of body.beats ?? []) renderContinuousSpoken(lines, beat);
  const document = documents.find((entry) => entry.id === body.documentId);
  if (document) {
    renderDirectorDocument(lines, document);
    if (documentQuestionRowId) {
      const question = document.rowQuestions?.[documentQuestionRowId]?.[0];
      if (!question) throw new Error(`${document.id} 连续阅读路线找不到逐行追问 ${documentQuestionRowId}`);
      lines.push(`【你圈出：${documentQuestionRowId}】`, "", `**林旭阳：** ${question.question}`, "", `**咨询者：** ${question.answer}`, "");
    }
  }
  const options = body.choice?.options ?? [];
  if (!options.length) return;
  const option = options.find((entry) => entry.id === optionId);
  if (!option) throw new Error(`连续阅读路线找不到白天选项 ${optionId}`);
  lines.push(`【你选择：${option.label ?? "继续核实"}】`, "");
  for (const beat of option.resultBeats ?? []) renderContinuousSpoken(lines, beat);
  if (option.resultText) lines.push(`【${continuousStageText(option.resultText)}】`, "");
}

function renderContinuousCallback(lines, packet, earnedItem) {
  const opener = packet.overnightStructure?.callbackOpeners?.[earnedItem];
  if (!opener) throw new Error(`${packet.caseId} 连续阅读路线找不到回拨物件 ${earnedItem}`);
  lines.push(`【白天带回：${earnedItem}】`, "", `**咨询者：** ${unwrapSpokenQuote(opener.line ?? "")}`, "");
  for (const line of opener.firstConflict?.lines ?? []) renderContinuousSpoken(lines, line);
  if (!opener.firstConflict?.lines?.length && opener.firstConflict?.hostLine) lines.push(`**林旭阳：** ${opener.firstConflict.hostLine}`, "");
  if (opener.firstConflict?.callerLine) lines.push(`**咨询者：** ${opener.firstConflict.callerLine}`, "");
  if (opener.firstConflict?.pauseAfterCallerLine) lines.push("【停顿】", "");
  if (opener.firstConflict?.callerFollowupLine) lines.push(`**咨询者：** ${opener.firstConflict.callerFollowupLine}`, "");
}

function renderContinuousCallerVariant(lines, variants, key) {
  if (!variants || !key) return;
  const value = variants[key];
  const spoken = typeof value === "string" ? value : value?.line;
  if (spoken) lines.push(`**咨询者：** ${unwrapSpokenQuote(spoken)}`, "");
}

function renderContinuousLiveCounter(lines, beat) {
  if (beat.text) lines.push(`**${beat.from ?? "后台"}：** ${beat.text}`, "");
  for (const line of beat.lines ?? []) renderContinuousSpoken(lines, line);
  const choice = (beat.choices ?? []).find((entry) => !entry.silent) ?? beat.choices?.[0];
  if (!choice) return;
  if (!choice.silent && choice.label && choice.lines?.length) lines.push(`**林旭阳：** ${choice.label}`, "");
  else if (!choice.silent && choice.label && !choice.questionOverride?.question) lines.push(`【你选择：${choice.label}】`, "");
  for (const line of choice.lines ?? []) renderContinuousSpoken(lines, line);
  if (choice.questionOverride?.question) lines.push(`**林旭阳：** ${choice.questionOverride.question}`, "");
}

function renderContinuousCallerQuestion(lines, question, choiceId) {
  if (!question?.prompt || !choiceId) return;
  const option = (question.options ?? []).find((entry) => entry.id === choiceId);
  if (!option) throw new Error(`连续阅读路线找不到来电人反问选项 ${choiceId}`);
  lines.push(`**咨询者：** ${question.prompt}`, "");
  if (!option.silent && option.label) lines.push(`**林旭阳：** ${option.label}`, "");
  if (option.lines?.length) option.lines.forEach((line) => renderContinuousSpoken(lines, line));
  else if (option.callerLine) lines.push(`**咨询者：** ${option.callerLine}`, "");
}

function renderContinuousAfterSceneEvidence(lines, packet, sceneIndex, embeddedIds) {
  const afterScene = packet.sceneVersions?.[sceneIndex]?.afterScene;
  if (afterScene?.kind !== "evidenceCheck" || !afterScene.checkId) return;
  const check = (packet.evidenceChecks ?? []).find((entry) => entry.id === afterScene.checkId);
  if (!check) throw new Error(`${packet.caseId} 连续阅读路线找不到段后材料 ${afterScene.checkId}`);
  renderContinuousEvidenceCheck(lines, check, { label: afterScene.label ?? "看材料", packet });
  embeddedIds.add(check.id);
}

function renderContinuousEvidenceChecks(lines, packet, embeddedIds = new Set()) {
  const checks = (packet.evidenceChecks ?? []).filter((check) => !embeddedIds.has(check.id));
  if (!checks.length) return;
  lines.push("## 看材料", "");
  for (const check of checks) renderContinuousEvidenceCheck(lines, check, { packet });
}

function renderContinuousEvidenceCheck(lines, check, { label = "材料检视", packet = null } = {}) {
  lines.push(`### ${label}｜${check.title ?? "台面材料"}`, "");
  if ((check.materialRows ?? []).length) {
    for (const row of check.materialRows) lines.push(`- ${row}`);
    lines.push("");
  } else if (check.material) {
    lines.push(check.material, "");
  }
  if (check.prompt) lines.push(`【屏幕提问】${check.prompt}`, "");
  const option = (check.options ?? []).find((entry) => entry.correct) ?? check.options?.[0];
  if (!option) return;
  lines.push(`【你圈出：${option.label ?? "这一处"}】`, "");
  if (option.feedback) lines.push(`**林旭阳：** ${option.feedback}`, "");
  if (option.reactionLine) lines.push(`**咨询者：** ${option.reactionLine}`, "");
  const revisedVersion = option.revisedVersion
    ?? (Number.isInteger(option.revisesScene) ? packet?.sceneVersions?.[option.revisesScene]?.revisedVersion : "");
  if (revisedVersion) lines.push(`**咨询者：** ${revisedVersion}`, "");
}

function renderContinuousAccusation(lines, packet, choiceIndex = 0) {
  const choice = packet.accusationChoices?.[choiceIndex] ?? packet.accusationChoices?.[0];
  if (!choice) return;
  lines.push("## 收住话头", "", `【你选中：${choice.label ?? "继续追问"}】`, "");
}

function renderContinuousBackflow(lines, packet, hookId) {
  const hook = (packet.investigationHooks ?? []).find((entry) => entry.id === hookId);
  if (!hook) {
    if (hookId) throw new Error(`${packet.caseId} 连续阅读路线找不到后台回流 ${hookId}`);
    return;
  }
  lines.push(`## ${hook.surface ?? "后台私信"}`, "");
  if (hook.appearsNowBecause) lines.push(`【${hook.appearsNowBecause}】`, "");
  renderContinuousEvidenceCheck(lines, hook, { label: hook.title ?? "新材料", packet });
}

function renderContinuousHostDisclosure(lines, packet, anchor) {
  const disclosure = packet.hostDisclosure;
  if (!disclosure?.text || disclosure.anchor !== anchor) return;
  lines.push(`**林旭阳：** ${disclosure.text}`, "");
  for (const line of disclosure.lines ?? []) renderContinuousSpoken(lines, line);
}

function renderContinuousRecap(lines, packet, accusationChoiceIndex = 0) {
  const conclusion = packet.conclusionWhenCleared ?? {
    summary: packet.stageJudgement ?? "",
    followup: packet.followupTwist ?? "",
    truth: packet.truth ?? ""
  };
  lines.push("## 连线回看", "");
  const accusation = packet.accusationChoices?.[accusationChoiceIndex] ?? packet.accusationChoices?.[0];
  if (accusation?.label) lines.push(`【你接住的那句】${accusation.label}`, "");
  if (accusation?.response) lines.push(`【主播接法】${accusation.response}`, "");
  if (conclusion.summary) lines.push(`【主播收话】${conclusion.summary}`, "");
  renderContinuousHostDisclosure(lines, packet, "atStageJudgement");
  if (conclusion.followup) lines.push(`【后续回拨】${conclusion.followup}`, "");
  renderContinuousOffMicLetters(lines, packet);
  if (conclusion.truth) lines.push(`【连线收住】${conclusion.truth}`, "");
}

function renderContinuousOffMicLetters(lines, packet) {
  for (const note of packet.advisorNotes ?? []) {
    if (note.appearsNowBecause) lines.push(`【${note.appearsNowBecause}】`, "");
    if (note.text) lines.push(`【麦外来信 · ${advisorName(note.advisorId)}】${note.text}`, "");
  }
  const respondentNotes = Array.isArray(packet.respondentNote)
    ? packet.respondentNote
    : packet.respondentNote ? [packet.respondentNote] : [];
  for (const note of respondentNotes) {
    if (note.appearsNowBecause) lines.push(`【${note.appearsNowBecause}】`, "");
    if (note.text) lines.push(`【麦外来信 · ${note.badge ?? "对方留言"}】${note.text}`, "");
  }
  if (packet.lurkerNote?.presenceLine && packet.lurkerNote?.deletedFragment) {
    lines.push(`【后台提示】${packet.lurkerNote.presenceLine}`, "", `【已删除弹幕残影】${packet.lurkerNote.deletedFragment}`, "");
  }
}

function renderContinuousCaseClosing(lines, closing) {
  if (!closing) return;
  lines.push(`## 案件结案｜${closing.title ?? "本案结案"}`, "");
  if (closing.verdict) lines.push(closing.verdict, "");
  for (const beat of closing.beats ?? []) lines.push(`- **${beat.label ?? "进展"}：** ${beat.text ?? ""}`);
  if ((closing.beats ?? []).length) lines.push("");
  if (closing.confirmed?.length) lines.push(`【已经确认】${closing.confirmed.slice(0, 3).join("；")}`, "");
  if (closing.unresolved?.length) lines.push(`【还没弄清】${closing.unresolved.slice(0, 3).join("；")}`, "");
  if (closing.nextStep) lines.push(`【接下来】${closing.nextStep}`, "");
}

function renderContinuousCareChoice(lines, choices = [], choiceId) {
  const choice = choices.find((entry) => entry.id === choiceId);
  if (!choice) return;
  lines.push("### 今晚最后一句", "", `**林旭阳：** ${choice.hostLine}`, "");
  for (const line of choice.lines ?? []) renderContinuousSpoken(lines, line);
}

function renderContinuousEpilogue(lines, epilogue) {
  lines.push("# 尾声｜收播以后", "");
  if (!epilogue) return;
  if (epilogue.opening) lines.push(`【${continuousStageText(epilogue.opening)}】`, "");
  for (const [index, message] of (epilogue.unreadMessages ?? []).entries()) {
    lines.push(`## 后台未读｜${message.sender ?? "陌生号码"}`, "");
    if (message.attachment) lines.push(`【附图：${message.attachment.label ?? message.attachment.alt ?? "图片"}】`, "");
    if (message.base) lines.push(message.base, "");
    const caseId = casePackets[index]?.caseId;
    const careChoiceId = continuousStoryRoutes[caseId]?.careChoiceId;
    if (careChoiceId && message.echoes?.[careChoiceId]) lines.push(message.echoes[careChoiceId], "");
  }
  if (epilogue.good) lines.push(`【后台曲线】${continuousStageText(epilogue.good)}`, "");
  if (epilogue.home) lines.push(`【回家】${continuousStageText(epilogue.home)}`, "");
  if (epilogue.close) lines.push(`【收束】${epilogue.close}`, "");
}

function renderPureStoryScene(lines, scene, label) {
  if (!scene) return;
  lines.push(`### ${label}`, "");
  for (const line of scene.beforeVersion?.lines ?? []) renderDirectorSpoken(lines, line);
  if (scene.entryQuestion) lines.push(`**林旭阳：** ${scene.entryQuestion}`, "");
  if (scene.version) lines.push(`**${scene.speaker ?? "咨询者"}：** ${scene.version}`, "");
  for (const line of scene.afterVersion?.lines ?? []) renderDirectorSpoken(lines, line);
  if (scene.pressureHint?.expression?.text) lines.push(`【${scene.pressureHint.expression.text}】`, "");

  const questions = scene.questionOptions ?? [];
  questions.forEach((option, index) => {
    lines.push(index === 0 ? "#### 主播追问" : "#### 另一种接法", "");
    if (option.suspicionLabel) lines.push(`【玩家怀疑：${option.suspicionLabel}】`, "");
    if (option.revealTransition) lines.push(`【画面短停，屏幕掠过“${option.revealTransition.label}”。主播立绘提亮。】`, "");
    if (option.question) lines.push(`**林旭阳：** ${option.question}`, "");
    for (const beat of option.resistanceBeat?.lines ?? []) renderDirectorSpoken(lines, beat);
    if (option.lines?.length) option.lines.forEach((line) => renderDirectorSpoken(lines, line));
    else if (option.answer) lines.push(`**咨询者：** ${option.answer}`, "");
    if (option.guardedAnswer) lines.push(`【若咨询者已经起了防备】`, "", `**咨询者：** ${option.guardedAnswer}`, "");
    if (option.reactionLine) lines.push(`**咨询者：** ${option.reactionLine}`, "");
  });

  const optionalQuestions = [...(scene.casualQuestions ?? []), ...(scene.dialogueOptions ?? [])];
  optionalQuestions.forEach((option) => {
    lines.push("#### 可选补问", "");
    if (option.question) lines.push(`**林旭阳：** ${option.question}`, "");
    if (option.lines?.length) option.lines.forEach((line) => renderDirectorSpoken(lines, line));
    else if (option.answer) lines.push(`**咨询者：** ${option.answer}`, "");
  });

  for (const line of scene.sceneCloser?.lines ?? []) renderDirectorSpoken(lines, line);
  if (scene.revisedVersion) lines.push("#### 材料出现后的重述", "", `**${scene.speaker ?? "咨询者"}：** ${scene.revisedVersion}`, "");
  if (scene.afterScene?.line) lines.push(`【${scene.afterScene.line}】`, "");
}

function renderWorldEcho(lines, worldEcho, includeBoundary = false, includeAction = true) {
  if (!worldEcho) return;
  lines.push(`### ${worldEcho.kicker ?? "城市回声"}`, "");
  if (includeBoundary && worldEcho.id) lines.push(`- **世界回声 ID：** ${worldEcho.id}`);
  if (includeBoundary && worldEcho.promiseId) lines.push(`- **承诺 ID：** ${worldEcho.promiseId}`, "");
  if (includeAction && worldEcho.actionLabel) lines.push(`【玩家操作：${worldEcho.actionLabel}】`, "");
  if (worldEcho.headline) lines.push(`**${worldEcho.headline}**`, "");
  if (worldEcho.body) lines.push(worldEcho.body, "");
  if (includeBoundary && worldEcho.proves) lines.push(`【确认到】${worldEcho.proves}`, "");
  if (includeBoundary && worldEcho.doesNotProve) lines.push(`【不能倒推】${worldEcho.doesNotProve}`, "");
}

function renderTransitionQuote(lines, quote) {
  if (!quote?.text) return;
  lines.push("### 幕间引页", "", `> “${quote.text}”`, ">", `> ${quote.source ?? ""}`, "");
}

function renderPureStoryInterlude(lines, interlude) {
  if (!interlude) return;
  if (interlude.kicker) lines.push(`【${interlude.kicker}】`, "");
  for (const action of interlude.actions ?? []) {
    lines.push(`### ${action.label ?? "另一种短查"}`, "");
    if (action.sceneText) lines.push(`【${action.sceneText}】`, "");
    if (action.script?.open) lines.push(`**林旭阳：** ${action.script.open}`, "");
    if (action.script?.reply) lines.push(`**${advisorName(action.advisorId)}：** ${action.script.reply}`, "");
    if (action.script?.clipLine) lines.push(`【${action.script.clipLabel ?? "回放"}】${action.script.clipLine}`, "");
    if (action.text) lines.push(`**${action.from ?? "后台"}：** ${action.text}`, "");
    for (const option of action.options ?? action.choices ?? []) {
      if (option.advisorLine) lines.push(`【另一种接法：${option.label ?? ""}】`, "", `**${advisorName(action.advisorId)}：** ${option.advisorLine}`, "");
    }
  }
}

function renderPureStoryDayScene(lines, scene, documents) {
  lines.push(`### ${scene.label ?? "白天地点"}`, "");
  const body = scene.body ?? {};
  if (body.access) lines.push(`【这次为什么能问】${body.access}`, "");
  if (body.text) lines.push(`【${body.text}】`, "");
  for (const beat of body.beats ?? []) renderDirectorSpoken(lines, beat);
  const document = documents.find((entry) => entry.id === body.documentId);
  if (document) renderDirectorDocument(lines, document);
  if (body.choice?.prompt) lines.push(`【${body.choice.prompt}】`, "");
  for (const option of body.choice?.options ?? []) {
    lines.push(`#### 选择：${option.label}`, "");
    for (const beat of option.resultBeats ?? []) renderDirectorSpoken(lines, beat);
    if (option.resultText) lines.push(`【${option.resultText}】`, "");
  }
}

function renderPureStoryCallbackOpeners(lines, openers = {}, fallback = null) {
  if (Object.keys(openers).length) lines.push("### 根据白天带回的东西，回拨会这样开场", "");
  for (const [earnedItem, opener] of Object.entries(openers)) {
    lines.push(`#### 如果带回「${earnedItem}」`, "", `**咨询者：** ${unwrapSpokenQuote(opener.line ?? "")}`, "");
    for (const line of opener.firstConflict?.lines ?? []) renderDirectorSpoken(lines, line);
    if (!opener.firstConflict?.lines?.length && opener.firstConflict?.hostLine) lines.push(`**林旭阳：** ${opener.firstConflict.hostLine}`, "");
    if (opener.firstConflict?.callerLine) lines.push(`**咨询者：** ${opener.firstConflict.callerLine}`, "");
    if (opener.firstConflict?.pauseAfterCallerLine) lines.push("【停顿】", "");
    if (opener.firstConflict?.callerFollowupLine) lines.push(`**咨询者：** ${opener.firstConflict.callerFollowupLine}`, "");
  }
  if (fallback?.line) lines.push("#### 如果没有带回关键物件", "", `**咨询者：** ${unwrapSpokenQuote(fallback.line)}`, "");
}

function renderPureStoryCallerVariants(lines, title, variants = null) {
  if (!variants || !Object.keys(variants).length) return;
  lines.push(`### ${title}`, "");
  for (const [label, value] of Object.entries(variants)) {
    const spoken = typeof value === "string" ? value : value?.line;
    if (spoken) lines.push(`【另一种接法：${humanLabel(label)}】`, "", `**咨询者：** ${unwrapSpokenQuote(spoken)}`, "");
  }
}

function renderPureStoryLiveCounter(lines, beat = {}) {
  lines.push(`### 直播中的打断｜${beat.from ?? "后台"}`, "");
  if (beat.text) lines.push(`**${beat.from ?? "后台"}：** ${beat.text}`, "");
  for (const line of beat.lines ?? []) renderDirectorSpoken(lines, line);
  for (const choice of beat.choices ?? []) {
    lines.push(`#### 主播可以：${choice.label}`, "");
    if (!choice.silent && choice.lines?.length) lines.push(`**林旭阳：** ${choice.label}`, "");
    for (const line of choice.lines ?? []) renderDirectorSpoken(lines, line);
    if (choice.questionOverride?.question) lines.push(`**林旭阳：** ${choice.questionOverride.question}`, "");
  }
}

function renderPureStoryCallerQuestion(lines, question = null) {
  if (!question?.prompt) return;
  lines.push("### 来电人反问", "", `**咨询者：** ${question.prompt}`, "");
  for (const option of question.options ?? []) {
    lines.push(`#### 主播回答：${option.label ?? ""}`, "");
    if (!option.silent) lines.push(`**林旭阳：** ${option.label ?? ""}`, "");
    if (option.lines?.length) option.lines.forEach((line) => renderDirectorSpoken(lines, line));
    else if (option.callerLine) lines.push(`**咨询者：** ${option.callerLine}`, "");
    for (const hostChoice of option.hostChoices ?? []) {
      lines.push(`【接着可以说：${hostChoice.label ?? ""}】`, "");
      if (!hostChoice.silent) lines.push(`**林旭阳：** ${hostChoice.label ?? ""}`, "");
      for (const line of hostChoice.lines ?? []) renderDirectorSpoken(lines, line);
    }
  }
}

function renderPureStoryMaterials(lines, packet) {
  const hasMaterial = (packet.evidenceCards ?? []).length || (packet.evidenceChecks ?? []).length || (packet.investigationHooks ?? []).length || (packet.advisorNotes ?? []).length || packet.lurkerNote;
  if (!hasMaterial) return;
  lines.push("## 麦上材料与后台回流", "");

  for (const card of packet.evidenceCards ?? []) {
    lines.push(`### 材料卡｜${card.title ?? card.type ?? "未命名材料"}`, "");
    if (card.front) lines.push(card.front, "");
    if (card.detail) lines.push(card.detail, "");
  }

  for (const check of packet.evidenceChecks ?? []) {
    lines.push(`### 材料检视｜${check.title ?? "圈选材料"}`, "");
    if (check.material) lines.push(check.material, "");
    for (const row of check.materialRows ?? []) lines.push(`- ${row}`);
    if ((check.materialRows ?? []).length) lines.push("");
    if (check.prompt) lines.push(`**林旭阳：** ${check.prompt}`, "");
    for (const option of check.options ?? []) {
      lines.push(`#### 圈选：${option.label ?? ""}`, "");
      if (option.correct && option.feedback) lines.push(`**林旭阳：** ${option.feedback}`, "");
      if (option.correct && option.reactionLine) lines.push(`**咨询者：** ${option.reactionLine}`, "");
    }
  }

  for (const hook of packet.investigationHooks ?? []) {
    lines.push(`### ${hook.surface ?? "后台回流"}｜${hook.title ?? "新材料"}`, "");
    if (hook.material) lines.push(hook.material, "");
    for (const row of hook.materialRows ?? []) lines.push(`- ${row}`);
    if ((hook.materialRows ?? []).length) lines.push("");
    if (hook.prompt) lines.push(`**林旭阳：** ${hook.prompt}`, "");
    for (const option of hook.options ?? []) {
      lines.push(`#### 圈选：${option.label ?? ""}`, "");
      if (option.correct && option.feedback) lines.push(`**林旭阳：** ${option.feedback}`, "");
    }
    for (const reply of hook.replyChoices ?? []) lines.push(`【主播可以回复：${reply.label ?? ""}】`, "");
  }

  for (const note of packet.advisorNotes ?? []) {
    lines.push(`### 顾问留言｜${advisorName(note.advisorId)}`, "");
    if (note.text) lines.push(`**${advisorName(note.advisorId)}：** ${note.text}`, "");
  }

  if (packet.lurkerNote) {
    lines.push("### 同席回声", "");
    if (packet.lurkerNote.presenceLine) lines.push(`【${packet.lurkerNote.presenceLine}】`, "");
    if (packet.lurkerNote.deletedFragment) lines.push(`【被删掉的一句】${packet.lurkerNote.deletedFragment}`, "");
  }
}

function renderPureStoryEpilogue(lines, epilogue) {
  lines.push("# 尾声｜收播以后", "");
  if (!epilogue) return;
  if (epilogue.opening) lines.push(`【${epilogue.opening}】`, "");
  for (const message of epilogue.unreadMessages ?? []) {
    lines.push(`## 后台未读｜${message.sender ?? "陌生号码"}`, "");
    if (message.attachment) lines.push(`【附图：${message.attachment.label ?? message.attachment.alt ?? "图片"}】`, "");
    if (message.base) lines.push(message.base, "");
    for (const [choiceId, echo] of Object.entries(message.echoes ?? {})) lines.push(`【另一种收尾回声：${humanLabel(choiceId)}】${echo}`, "");
  }
  if (epilogue.good) lines.push(`【数据较好的夜晚】${epilogue.good}`, "");
  if (epilogue.bad) lines.push(`【数据不理想的夜晚】${epilogue.bad}`, "");
  if (epilogue.home) lines.push(`【回家】${epilogue.home}`, "");
  if (epilogue.close) lines.push(`【收束】${epilogue.close}`, "");
}

function renderDirectorScript() {
  const lines = [];
  const sequenceByCaseId = new Map(manifest.sequence.map((item) => [item.caseId, item]));
  const profilesById = new Map((castRegistry.cast ?? []).map((profile) => [profile.id, profile]));

  lines.push(`# 《${manifest.title}》导演阅读版`, "");
  lines.push(
    "> 本版只保留排演所需的台词、动作、场景目标、主要选择与分支入口。完整事实字段、所有材料追问和运行时配置见“全量可读文字剧本”；所有玩家可见分支见“纯故事台本”；固定代表路线见“连续故事阅读版”。文档均由 JSON 真源生成，请勿手改。",
    ""
  );
  lines.push("## 排演总原则", "");
  lines.push(`- **主题：** ${manifest.theme?.title ?? ""}`);
  lines.push(`- **主题句：** ${manifest.theme?.thesis ?? ""}`);
  lines.push("- 夜 A 让人物按自己的防御讲故事；白天让物件和第三方改变主语；夜 B 才让省略重新回到人物嘴里。", "- 方括号为舞台、表演或玩家操作，不念出。`【防备分支】` 只在压力不足时使用。", "");

  lines.push("# 序幕", "", "【晚上八点。控台灯亮，直播间连线。】", "");
  for (const line of manifest.nightShell?.prologue?.lines ?? []) renderDirectorSpoken(lines, line);
  if (manifest.nightShell?.prologue?.hostLine) renderDirectorSpoken(lines, manifest.nightShell.prologue.hostLine);

  casePackets.forEach((packet, caseIndex) => {
    const item = sequenceByCaseId.get(packet.caseId) ?? {};
    const title = packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? packet.caseId;
    lines.push(`# 第${chineseNumber(caseIndex + 1)}幕｜${title}`, "");
    if (packet.caseTitle?.subtitle) lines.push(`**副标题：** ${packet.caseTitle.subtitle}`, "");
    lines.push(`【场景目标】${packet.dramaticAnchor ?? ""}`, "");
    lines.push(`【今晚非发生不可】${packet.whyTonight ?? ""}`, "");

    lines.push("## 人物与本案声音", "");
    for (const profileId of item.castProfileIds ?? []) {
      const profile = profilesById.get(profileId);
      if (!profile) continue;
      lines.push(`### ${profile.name}`, "");
      lines.push(`- **性格 / 防御：** ${profile.personality?.core ?? ""}；${profile.defense ?? ""}`);
      lines.push(`- **受压变化：** ${profile.personality?.stressResponse ?? ""}`);
      if (profile.voiceArc) {
        lines.push(`- **跨幕：** 夜 A｜${profile.voiceArc.nightA} 白天｜${profile.voiceArc.day} 夜 B｜${profile.voiceArc.nightB} 结案｜${profile.voiceArc.ending}`);
      }
      lines.push("");
    }

    lines.push("## 夜 A｜第一次来电", "", "【开播。先让咨询者把自己相信的版本讲完整。】", "");
    for (const line of packet.openingDialogue ?? []) renderDirectorSpoken(lines, line);
    (packet.nightStructure?.segment1SceneIndexes ?? []).forEach((sceneIndex, localIndex) => {
      renderDirectorScene(lines, packet.sceneVersions?.[sceneIndex], `夜 A · ${localIndex + 1}`);
    });
    renderDirectorHangup(lines, packet.nightStructure?.hangup);

    lines.push("## 收麦幕间｜只够做一件事", "");
    renderDirectorInterlude(lines, packet.nightStructure?.interlude);
    if (packet.delegation?.depositLine) renderDirectorSpoken(lines, packet.delegation.depositLine);

    lines.push("## 白天｜物件改变主语", "");
    const overnight = packet.overnightStructure ?? {};
    if (overnight.dayIntro) lines.push(`【行动限制】${overnight.dayIntro}`, "");
    for (const scene of overnight.dayScenes ?? []) renderDirectorDayScene(lines, scene, packet.documents ?? []);

    lines.push("## 夜 B｜把省略问回来", "");
    if (packet.nightStructure?.returnStance?.lines) {
      lines.push("### 回拨时的咨询者立场", "");
      for (const [stance, line] of Object.entries(packet.nightStructure.returnStance.lines)) lines.push(`- **${humanLabel(stance)}：** ${line}`);
      lines.push("");
    }
    if (overnight.returnLead?.lines?.length) {
      lines.push("### 回拨先行拍", "");
      for (const line of overnight.returnLead.lines) renderDirectorSpoken(lines, line);
    }
    lines.push("### 带回物开场", "");
    for (const [earnedItem, opener] of Object.entries(overnight.callbackOpeners ?? {})) {
      lines.push(`#### ${earnedItem}`, "", `**咨询者：** ${opener.line ?? ""}`, "");
      for (const line of opener.firstConflict?.lines ?? []) renderDirectorSpoken(lines, line);
      if (!opener.firstConflict?.lines?.length && opener.firstConflict?.hostLine) lines.push(`**林旭阳：** ${opener.firstConflict.hostLine}`, "");
      if (opener.firstConflict?.callerLine) lines.push(`**咨询者：** ${opener.firstConflict.callerLine}`, "");
      if (opener.firstConflict?.pauseAfterCallerLine) lines.push("【停顿】", "");
      if (opener.firstConflict?.callerFollowupLine) lines.push(`**咨询者：** ${opener.firstConflict.callerFollowupLine}`, "");
    }
    if (overnight.callbackFallback?.line) lines.push("#### 没带回关键物件", "", `**咨询者：** ${overnight.callbackFallback.line}`, "");
    if (overnight.snapshotEcho) {
      lines.push("### 中段立场回应拍", "");
      for (const [optionId, line] of Object.entries(overnight.snapshotEcho)) lines.push(`- **${optionId}：** ${line}`);
      lines.push("");
    }
    if (overnight.returnBeat?.lines?.length) {
      lines.push("### 回拨后的生活拍", "");
      for (const line of overnight.returnBeat.lines) renderDirectorSpoken(lines, line);
    }
    (packet.nightStructure?.segment2SceneIndexes ?? []).forEach((sceneIndex, localIndex) => {
      for (const beat of (overnight.liveCounterBeats ?? []).filter((item) => item.beforeSceneIndex === sceneIndex)) renderDirectorLiveCounter(lines, beat);
      renderDirectorScene(lines, packet.sceneVersions?.[sceneIndex], `夜 B · ${localIndex + 1}`);
      for (const beat of (overnight.liveCounterBeats ?? []).filter((item) => item.afterSceneIndex === sceneIndex)) renderDirectorLiveCounter(lines, beat);
    });
    renderDirectorCallerQuestion(lines, overnight.callerQuestion);

    lines.push("## 终局｜确认到哪，停在哪", "");
    if (packet.hostDisclosure?.text) lines.push(`【主播自揭，仅一次】${packet.hostDisclosure.text}`, "");
    for (const line of packet.hostDisclosure?.lines ?? []) renderDirectorSpoken(lines, line);
    if (packet.deepFollowup?.question) {
      lines.push(`**林旭阳：** ${packet.deepFollowup.question}`, "");
      for (const beat of packet.deepFollowup.resistanceBeat?.lines ?? []) renderDirectorSpoken(lines, beat);
      lines.push(`**咨询者：** ${packet.deepFollowup.answer ?? ""}`, "");
    }
    if (packet.respondentNote?.text) lines.push(`【对方后台留言，不可追问】${packet.respondentNote.text}`, "");
    if (packet.stageJudgement) lines.push(`**林旭阳：** ${packet.stageJudgement}`, "");
    renderDirectorCareChoices(lines, packet.careChoices);
    renderDirectorClosing(lines, packet.caseClosing);
    const interlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === packet.caseId);
    if (interlude) {
      lines.push(`## ${interlude.kicker ?? "案间转场"}`, "");
      for (const line of interlude.lines ?? []) renderDirectorSpoken(lines, line);
      if (interlude.line) lines.push(`【${interlude.line}】`, "");
      for (const line of interlude.afterLines ?? []) renderDirectorSpoken(lines, line);
      renderTransitionQuote(lines, interlude.transitionQuote);
      renderWorldEcho(lines, interlude.worldEcho, true);
    }
  });

  lines.push("# 尾声", "");
  const epilogue = manifest.nightShell?.epilogue;
  if (epilogue?.opening) lines.push(`【${epilogue.opening}】`, "");
  if (epilogue?.unreadMessages?.length) {
    lines.push("## 收播后 · 后台未读", "");
    for (const message of epilogue.unreadMessages) {
      lines.push(`### ${message.sender ?? "陌生号码"}`, "");
      if (message.attachment) lines.push(`【附图占位：${message.attachment.label ?? message.attachment.alt ?? "图片"}】`, "");
      lines.push(message.base ?? "", "");
      for (const [choiceId, echo] of Object.entries(message.echoes ?? {})) lines.push(`- ${choiceId} 回声：${echo}`);
      if (message.echoes) lines.push("");
    }
  }
  if (epilogue?.good) lines.push(`【数据较好分支】${epilogue.good}`, "");
  if (epilogue?.bad) lines.push(`【数据较差分支】${epilogue.bad}`, "");
  if (epilogue?.home) lines.push(`【回家】${epilogue.home}`, "");
  if (epilogue?.close) lines.push(`【收束】${epilogue.close}`, "");
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function renderDirectorScene(lines, scene, label) {
  if (!scene) return;
  lines.push(`### ${label}｜${scene.id ?? "未命名场"}`, "");
  for (const line of scene.beforeVersion?.lines ?? []) renderDirectorSpoken(lines, line);
  if (scene.entryQuestion) lines.push(`**林旭阳：** ${scene.entryQuestion}`, "");
  if (scene.version) lines.push(`**${scene.speaker ?? "咨询者"}：** ${scene.version}`, "");
  for (const line of scene.afterVersion?.lines ?? []) renderDirectorSpoken(lines, line);
  if (scene.pressureHint?.expression?.text) lines.push(`【受压动作】${scene.pressureHint.expression.text}`, "");
  const coreQuestions = (scene.questionOptions ?? []).filter((option) => option.correct);
  for (const option of coreQuestions) {
    if (option.suspicionLabel) lines.push(`【玩家怀疑方向】${option.suspicionLabel}`, "");
    if (option.revealTransition) lines.push(`【画面短停，屏幕掠过“${option.revealTransition.label}”。主播立绘提亮。】`, "");
    lines.push(`**林旭阳：** ${option.question}`, "");
    for (const beat of option.resistanceBeat?.lines ?? []) renderDirectorSpoken(lines, beat);
    lines.push(`**咨询者：** ${option.answer}`, "");
    if (option.guardedAnswer) lines.push(`【防备分支·咨询者】${option.guardedAnswer}`, "");
  }
  const optionalQuestions = [...(scene.casualQuestions ?? []), ...(scene.dialogueOptions ?? [])];
  if (optionalQuestions.length) lines.push("#### 可选补问", "");
  for (const option of optionalQuestions) {
    lines.push(`**林旭阳：** ${option.question ?? ""}`, "");
    if (option.lines?.length) option.lines.forEach((line) => renderDirectorSpoken(lines, line));
    else if (option.answer) lines.push(`**咨询者：** ${option.answer}`, "");
  }
  for (const line of scene.sceneCloser?.lines ?? []) renderDirectorSpoken(lines, line);
  if (scene.revisedVersion) lines.push(`【材料触发后的重述】**${scene.speaker ?? "咨询者"}：** ${scene.revisedVersion}`, "");
  if (scene.afterScene?.line) lines.push(`【段后】${scene.afterScene.line}`, "");
}

function renderDirectorCareChoices(lines, choices = []) {
  if (!choices.length) return;
  lines.push("### 今晚最后一句（三选一，不判分）", "");
  for (const choice of choices) {
    lines.push(`#### ${choice.label}`, "", `**林旭阳：** ${choice.hostLine}`, "");
    for (const line of choice.lines ?? []) renderDirectorSpoken(lines, line);
  }
}

function renderDirectorSpoken(lines, line) {
  if (!line) return;
  if (line.role === "pause") {
    lines.push("【停顿】", "");
    return;
  }
  if (line.role === "stage") {
    lines.push(`【${line.text ?? ""}】`, "");
    if (line.audioCueId) lines.push(`【音效：${line.audioCueId}】`, "");
    return;
  }
  const speaker = line.speaker ?? roleLabel(line.role) ?? "台词";
  const spoken = line.text ?? line.line;
  if (spoken) lines.push(`**${speaker}：** ${spoken}`, "");
  if (line.audioCueId) lines.push(`【音效：${line.audioCueId}】`, "");
}

function renderDirectorCallerQuestion(lines, question = null) {
  if (!question?.prompt) return;
  lines.push("### 来电人反问", "", `**咨询者：** ${question.prompt}`, "");
  for (const option of question.options ?? []) {
    lines.push(`#### 主播选｜${option.label ?? ""}`, "", `**林旭阳：** ${option.label ?? ""}`, "");
    if (option.lines?.length) option.lines.forEach((line) => renderDirectorSpoken(lines, line));
    else if (option.callerLine) lines.push(`**咨询者：** ${option.callerLine}`, "");
    for (const hostChoice of option.hostChoices ?? []) {
      lines.push(`【再选｜${hostChoice.label ?? ""}｜立场 ${hostChoice.stanceNudge ?? ""}】`, "");
      if (!hostChoice.silent) lines.push(`**林旭阳：** ${hostChoice.label ?? ""}`, "");
      for (const line of hostChoice.lines ?? []) renderDirectorSpoken(lines, line);
    }
  }
}

function renderDirectorLiveCounter(lines, beat = {}) {
  lines.push(`### 场间实时反压｜${beat.from ?? beat.id ?? "后台"}`, "");
  if (beat.text) lines.push(`【${beat.text}】`, "");
  for (const line of beat.lines ?? []) renderDirectorSpoken(lines, line);
  for (const choice of beat.choices ?? []) {
    lines.push(`- **玩家选择：** ${choice.label}`);
    if (choice.questionOverride?.question) lines.push(`  - **下一问改为：** ${choice.questionOverride.question}`);
    if (choice.recapAftertaste) lines.push(`  - **回味：** ${choice.recapAftertaste}`);
    if (choice.lines?.length) {
      lines.push("");
      if (!choice.silent) lines.push(`**林旭阳：** ${choice.label ?? ""}`, "");
      for (const line of choice.lines) renderDirectorSpoken(lines, line);
    }
  }
  if ((beat.choices ?? []).length) lines.push("");
}

function renderDirectorHangup(lines, hangup) {
  if (!hangup) return;
  lines.push("### 第一次收麦", "");
  if (hangup.hangupLine) lines.push(`【${hangup.hangupLine}】`, "");
  if (hangup.line) {
    renderDirectorSpoken(lines, {
      role: hangup.speaker === "林旭阳" ? "host" : "caller",
      speaker: hangup.speaker,
      text: hangup.line
    });
  }
  if (hangup.hostHoldLine) lines.push(`**林旭阳：** ${hangup.hostHoldLine}`, "");
  if (hangup.hostLine) lines.push(`**林旭阳：** ${hangup.hostLine}`, "");
  if (hangup.stageDirection && hangup.stageDirection !== hangup.hangupLine) {
    lines.push(`【${hangup.stageDirection}】`, "");
  }
}

function renderDirectorInterlude(lines, interlude) {
  if (!interlude) return;
  if (interlude.kicker) lines.push(`【${interlude.kicker}】`, "");
  for (const action of interlude.actions ?? []) {
    lines.push(`### 可选｜${action.label}`, "", action.summary ?? "", "");
    if (action.sceneText) lines.push(`【${action.sceneText}】`, "");
    if (action.script?.open) lines.push(`**林旭阳：** ${action.script.open}`, "");
    if (action.script?.reply) lines.push(`**${advisorName(action.advisorId)}：** ${action.script.reply}`, "");
    if (action.script?.clipLine) lines.push(`【${action.script.clipLabel ?? "回放"}】${action.script.clipLine}`, "");
    if (action.script?.hostNote) lines.push(`【主播只知道】${action.script.hostNote}`, "");
    if (action.text) lines.push(`【${action.from ?? "后台"}】${action.text}`, "");
    for (const option of action.options ?? action.choices ?? []) {
      lines.push(`【选 ${option.label}】${option.advisorLine ?? ""}`);
    }
    if ((action.options ?? action.choices ?? []).length) lines.push("");
  }
}

function renderDirectorDayScene(lines, scene, documents) {
  lines.push(`### ${scene.label ?? scene.id}`, "");
  const body = scene.body ?? {};
  if (body.access) lines.push(`【联系与授权】${body.access}`, "");
  if (body.text) lines.push(`【${body.text}】`, "");
  for (const beat of body.beats ?? []) renderDirectorSpoken(lines, beat);
  const document = documents.find((entry) => entry.id === body.documentId);
  if (document) renderDirectorDocument(lines, document);
  if (body.choice?.prompt) lines.push(`【玩家选择】${body.choice.prompt}`, "");
  for (const option of body.choice?.options ?? []) {
    lines.push(`#### 选｜${option.label}`, "");
    for (const beat of option.resultBeats ?? []) renderDirectorSpoken(lines, beat);
    if (option.resultText) lines.push(`【结果】${option.resultText}`, "");
  }
}

function renderDirectorDocument(lines, document) {
  lines.push(`【屏幕材料】${document.title ?? document.id}`, "");
  if (document.intro) lines.push(document.intro, "");
  const rows = document.rows ?? [];
  const columns = readableDocumentColumns(document, rows);
  if (!columns.length) return;
  lines.push(`| ${columns.map((column) => cell(column.label)).join(" | ")} |`);
  lines.push(`| ${columns.map(() => "---").join(" | ")} |`);
  rows.forEach((row) => lines.push(`| ${columns.map((column) => cell(row[column.key] ?? "")).join(" | ")} |`));
  lines.push("");
}

function readableDocumentColumns(document = {}, rows = []) {
  if (Array.isArray(document.columns) && document.columns.length) {
    return [{ key: "rowId", label: "行" }, ...document.columns];
  }
  return [...new Set(rows.flatMap((row) => Object.keys(row)))]
    .map((key) => ({ key, label: humanLabel(key) }));
}

function renderDirectorClosing(lines, closing) {
  if (!closing) return;
  lines.push(`### ${closing.title ?? "结案"}`, "");
  if (closing.verdict) lines.push(`【结案卡】${closing.verdict}`, "");
  for (const beat of closing.beats ?? []) lines.push(`- **${beat.label}：** ${beat.text}`);
  if ((closing.beats ?? []).length) lines.push("");
  if (closing.confirmed?.length) lines.push(`【能确认】${closing.confirmed.join("；")}`, "");
  if (closing.unresolved?.length) lines.push(`【仍未知】${closing.unresolved.join("；")}`, "");
  if (closing.nextStep) lines.push(`【下一步】${closing.nextStep}`, "");
}

function advisorName(advisorId) {
  return ({ "zhao-lawyer": "赵律师", "zhou-accountant": "周会计", "lin-matchmaker": "小林老师", "zhang-forensic": "张法医" })[advisorId] ?? "顾问";
}

function renderScene(lines, scene, sourceIndex, label) {
  if (!scene) return;
  lines.push(`### ${label}｜${scene.id ?? `场景 ${sourceIndex + 1}`}`, "");
  if (scene.entryQuestion) lines.push(`**林旭阳：** ${scene.entryQuestion}`, "");
  if (scene.version) lines.push(`**${scene.speaker ?? "咨询者"}：** ${scene.version}`, "");
  if (scene.revisedVersion) lines.push(`【材料触发后的重述】 **${scene.speaker ?? "咨询者"}：** ${scene.revisedVersion}`, "");
  if (vBroPlayerVisible && scene.helperHint) lines.push(`【主动求助·V哥】 ${scene.helperHint}`, "");
  for (const [key, value] of Object.entries(scene)) {
    if (["id", "speaker", "entryQuestion", "version", "revisedVersion", "helperHint"].includes(key)) continue;
    renderNode(lines, value, key, 4);
  }
}

function renderSpokenLine(lines, line) {
  if (!line) return;
  if (line.role === "pause") {
    lines.push("【停顿】", "");
    return;
  }
  if (line.role === "stage") {
    lines.push(`【${line.text ?? ""}】`, "");
    if (line.audioCueId) lines.push(`【音效：${line.audioCueId}】`, "");
    return;
  }
  const speaker = line.speaker ?? roleLabel(line.role) ?? "台词";
  const text = line.text ?? line.line ?? "";
  if (text) lines.push(`**${speaker}：** ${text}`, "");
  const rest = Object.fromEntries(Object.entries(line).filter(([key]) => !["speaker", "role", "text", "line"].includes(key)));
  if (Object.keys(rest).length) renderNode(lines, rest, "舞台标记", 4);
}

function renderNode(lines, value, label, level = 3) {
  if (value === undefined || value === null) return;
  const title = humanLabel(label);
  if (["string", "number", "boolean"].includes(typeof value)) {
    lines.push(scalarLine(title, value));
    return;
  }
  if (Array.isArray(value)) {
    if (!value.length) return;
    lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "");
    if (value.every((item) => ["string", "number", "boolean"].includes(typeof item))) {
      value.forEach((item) => lines.push(`- ${String(item)}`));
      lines.push("");
      return;
    }
    value.forEach((item, index) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const itemTitle = item.title ?? item.label ?? item.name ?? item.id ?? `${title} ${index + 1}`;
        renderNode(lines, item, `${index + 1}. ${itemTitle}`, level + 1);
      } else {
        renderNode(lines, item, `${title} ${index + 1}`, level + 1);
      }
    });
    return;
  }
  if (isDocument(value)) {
    lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "");
    renderDocument(lines, value, level + 1);
    return;
  }
  if ((value.speaker || value.role) && (value.text || value.line || value.role === "pause")) {
    lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "");
    renderSpokenLine(lines, value);
    return;
  }
  if (value.question && value.answer) {
    lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "", `**林旭阳：** ${value.question}`, "");
    if (value.lines?.length) value.lines.forEach((line) => renderSpokenLine(lines, line));
    else lines.push(`**咨询者：** ${value.answer}`, "");
    renderObjectBody(lines, value, level + 1, new Set(["question", "answer", "lines"]));
    return;
  }
  lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "");
  renderObjectBody(lines, value, level + 1);
}

function renderObjectBody(lines, object, level, skip = new Set()) {
  for (const [key, value] of Object.entries(object)) {
    if (skip.has(key)) continue;
    if (key === "text" && typeof value === "string") {
      lines.push(value, "");
      continue;
    }
    if (["string", "number", "boolean"].includes(typeof value)) {
      lines.push(scalarLine(humanLabel(key), value));
    } else {
      renderNode(lines, value, key, level);
    }
  }
  lines.push("");
}

function scalarLine(label, value) {
  const text = String(value);
  return text ? `- **${label}：** ${text}` : `- **${label}：**`;
}

function renderDocument(lines, document, level) {
  if (document.title) lines.push(`**${document.title}**`, "");
  if (document.intro) lines.push(document.intro, "");
  if (document.dateMode) lines.push(`- **时间格式：** ${document.dateMode}`);
  if (document.columns?.length) {
    lines.push(`- **表格字段：** ${document.columns.map((column) => `${column.key}（${column.label}）`).join("；")}`);
  }
  if (document.dateMode || document.columns?.length) lines.push("");
  const rows = document.rows ?? [];
  const columns = readableDocumentColumns(document, rows);
  if (columns.length) {
    lines.push(`| ${columns.map((column) => cell(column.label)).join(" | ")} |`);
    lines.push(`| ${columns.map(() => "---").join(" | ")} |`);
    rows.forEach((row) => lines.push(`| ${columns.map((column) => cell(row[column.key] ?? "")).join(" | ")} |`));
    lines.push("");
  }
  for (const [key, value] of Object.entries(document)) {
    if (["title", "intro", "rows", "columns", "dateMode"].includes(key)) continue;
    renderNode(lines, value, key, level);
  }
}

function isDocument(value) {
  return value && typeof value === "object" && Array.isArray(value.rows) && value.rows.every((row) => row && typeof row === "object" && !Array.isArray(row));
}

function humanLabel(key) {
  const labels = {
    id: "内部 ID", caseId: "案件 ID", caseNumber: "案件编号", plotId: "剧情 ID", runtimeContentStatus: "运行时状态", callMedium: "来电媒介", speakerProfileId: "声纹卡 ID", voiceAttribution: "声音归属",
    dramaticAnchor: "戏剧锚点", whyTonight: "为何今晚发生", helpRequest: "公开求助", objectPurpose: "核心物件作用", callerStake: "咨询者所求", otherStake: "对方所求", thirdPressure: "第三压力", selfServingOmission: "咨询者自利删减",
    publicHook: "公开钩子", storyArcSummary: "故事概述", storySuspense: "悬念", storyClueObject: "线索物件", storyArcTitle: "故事标题",
    clueRole: "线索职能", falseFrame: "错误框架", payoffFor: "回收目标", speakerId: "说话人 ID", doubt: "现场疑点", contradiction: "矛盾", reliability: "可靠度", showsCard: "展示卡片",
    casualQuestions: "自由追问", questionOptions: "关键追问", dialogueOptions: "补充对话", question: "主播问句", answer: "咨询者回答", guardedAnswer: "防备回答", suspicionLabel: "玩家所选怀疑方向", correct: "是否核心项", routeAxis: "路线轴", routeTone: "路线口气",
    pressureHint: "压力表演", intentHook: "意图钩子", callerGuard: "防备状态", expression: "表情/听感", helperHint: "V哥提示", revealTransition: "唯一核心反转过场", eyebrow: "过场短标",
    afterScene: "段后触发", beforeVersion: "正文前节拍", afterVersion: "正文后节拍", sceneCloser: "场尾自动拍", returnLead: "回拨先行拍", returnBeat: "回拨后的生活拍", hostChoices: "主播应对选择", stanceNudge: "立场变化", nonLoadBearing: "生活噪声标记", silent: "不出声", kind: "类型", checkId: "材料检视 ID", revisedVersion: "材料触发后的重述",
    title: "标题", subtitle: "副标题", intro: "引子", text: "正文", request: "求助内容", line: "台词", role: "角色职能", type: "表现类型", audioCueId: "音频提示",
    opening: "开场", good: "数据较好分支", bad: "数据较差分支", home: "回家", close: "收束",
    true: "能确认", edited: "被修剪", unknown: "今晚定不了", offlineSitIn: "同席特许事实", truthBoundary: "事实边界",
    taskProfile: "任务画像", runtimeLengthPlan: "运行时长度计划", routeAxisComments: "路线评论", stanceSnapshot: "中段立场快照",
    prompt: "提示题", note: "说明", options: "选项", summary: "摘要", feedback: "反馈", reactionLine: "人物反应", response: "主播回应", accuse: "责任指向", accuseRole: "责任角色",
    source: "来源", surface: "出现界面", appearsNowBecause: "此刻出现原因", teaseDuringSegment2: "夜 B 预告", proves: "能证明", stillCannotProve: "仍不能证明", triggerContradiction: "触发矛盾",
    material: "材料", materialRows: "材料行", pityLine: "失败后侧向提示", markLimit: "最多圈选", rowQuestions: "逐行追问", crossQuestions: "跨行追问", rows: "表格行", rowId: "行 ID", date: "日期", amount: "金额", party: "对方/项目", memo: "备注",
    enabled: "是否启用", segment1SceneIndexes: "夜 A 段落下标", segment2SceneIndexes: "夜 B 段落下标", hangup: "第一次收麦", interlude: "幕间", returnStance: "回拨后立场",
    hangupAnchor: "收麦锚点", hangupLine: "收麦舞台", hostHoldLine: "主播留话", dayIntro: "白天开场", dayBudget: "白天行动预算", minDayScenes: "最少白天场景", dayScenes: "白天场景", callbackOpeners: "带回物开场", callbackFallback: "兜底开场", postures: "回拨立场", callerQuestion: "来电人反问", interludeEarnedItemMap: "幕间物件映射",
    backdropClass: "舞台背景", body: "场景正文", beats: "场景节拍", choice: "场景选择", earnedItemId: "获得物件", grantsEarnedItemId: "授予物件", grantsInventory: "授予库存", resultBeats: "选择后节拍", resultText: "选择后正文", firstConflict: "回拨首次冲突", hostLine: "主播台词", callerLine: "咨询者台词",
    delegation: "证据委托", moment: "发生时机", outcomes: "顾问结果", advisorId: "顾问 ID", advisorLine: "顾问台词", tone: "口气", report: "报告",
    careChoices: "今晚最后一句", caseClosing: "正式结案", verdict: "结论", confirmed: "已确认", unresolved: "未决", nextStep: "下一步", dailyShareTitle: "分享卡标题", dailyShareBody: "分享卡正文", dailyShareQuestion: "分享题", truth: "作者真相",
    commentSeeds: "评论种子", themeId: "主题 ID", hiddenThread: "暗线", label: "标签", reveal: "完整揭示", lowReveal: "低揭示", comment: "评论"
  };
  return labels[key] ?? key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
}

function roleLabel(role) {
  return ({ host: "林旭阳", caller: "咨询者", respondent: "对方", narrator: "旁白" })[role];
}

function cell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

function chineseNumber(value) {
  return ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][value] ?? String(value);
}

function unwrapSpokenQuote(value) {
  const text = String(value ?? "").trim();
  return text.startsWith("「") && text.endsWith("」") ? text.slice(1, -1) : text;
}

function continuousCaseTitle(packet, caseIndex) {
  const title = packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? `第${caseIndex + 1}案`;
  return String(title).replace(/^今日来电[：:]\s*/, "");
}

function continuousStageText(value) {
  return String(value ?? "");
}

function renderContinuousSpoken(lines, line) {
  if (!line) return;
  const readableLine = line.audioCueId ? { ...line, audioCueId: undefined } : line;
  if (line.speaker === "你" || line.role === "player") {
    renderDirectorSpoken(lines, { ...readableLine, speaker: "林旭阳" });
    return;
  }
  renderDirectorSpoken(lines, readableLine);
}

function assertContinuousStory(markdown, packets) {
  if (markdown.includes("咨询者连线说")) throw new Error("连续阅读版仍把来电摘要当成咨询者自述");
  if (markdown.includes("**林旭阳：** 林旭阳")) throw new Error("连续阅读版仍把第三人称结案摘要当成主播台词");
  if (markdown.includes("【玩家") || markdown.includes("**你：**")) throw new Error("连续阅读版仍混入玩家界面称谓");
  if (markdown.includes("## 控台留下的材料")) throw new Error("连续阅读版仍在对话后重复证据卡摘要");
  for (const [caseIndex, packet] of packets.entries()) {
    const route = continuousStoryRoutes[packet.caseId];
    const title = continuousCaseTitle(packet, caseIndex);
    if (title && !markdown.includes(title)) throw new Error(`连续阅读版缺少案件 ${packet.caseId}`);
    const caseHeading = `# 第${chineseNumber(caseIndex + 1)}幕｜${title}`;
    const nextPacket = packets[caseIndex + 1];
    const nextHeading = nextPacket
      ? `# 第${chineseNumber(caseIndex + 2)}幕｜${continuousCaseTitle(nextPacket, caseIndex + 1)}`
      : "";
    const caseStart = markdown.indexOf(caseHeading);
    const nextStart = nextHeading ? markdown.indexOf(nextHeading, caseStart + caseHeading.length) : markdown.length;
    const caseMarkdown = markdown.slice(caseStart, nextStart >= 0 ? nextStart : markdown.length);
    const hangupStage = packet.nightStructure?.hangup?.stageDirection;
    if (hangupStage) {
      const stageMarker = `【${hangupStage}】`;
      const stageIndex = caseMarkdown.indexOf(stageMarker);
      const postLiveIndex = caseMarkdown.indexOf("## 收麦后");
      const stageCount = caseMarkdown.split(stageMarker).length - 1;
      if (stageIndex < 0 || postLiveIndex < 0 || stageIndex > postLiveIndex || stageCount !== 1) {
        throw new Error(`${packet.caseId} 连续阅读版的第一次收麦动作必须只出现一次，并紧跟在第一夜之后`);
      }
    }
    const holdLine = packet.overnightStructure?.hostHoldLine;
    if (holdLine && markdown.split(holdLine).length - 1 > 1) throw new Error(`${packet.caseId} 连续阅读版重复播放收麦留话`);
    if (packet.hostDisclosure?.text) {
      const disclosureCount = caseMarkdown.split(packet.hostDisclosure.text).length - 1;
      if (disclosureCount !== 1) throw new Error(`${packet.caseId} 连续阅读版主播自揭应只出现一次，实际 ${disclosureCount} 次`);
    }
    for (const check of packet.evidenceChecks ?? []) {
      const correct = (check.options ?? []).find((option) => option.correct) ?? check.options?.[0];
      if (check.title && !caseMarkdown.includes(check.title)) throw new Error(`${packet.caseId} 连续阅读版漏掉必经材料 ${check.title}`);
      if (correct?.label && !caseMarkdown.includes(`【你圈出：${correct.label}】`)) throw new Error(`${packet.caseId} 连续阅读版没有记录材料圈选 ${correct.label}`);
    }
    const accusation = packet.accusationChoices?.[route?.accusationChoiceIndex ?? 0];
    if (accusation?.label && !caseMarkdown.includes(`【你选中：${accusation.label}】`)) throw new Error(`${packet.caseId} 连续阅读版漏掉最终追问`);
    const backflow = (packet.investigationHooks ?? []).find((entry) => entry.id === route?.backflowHookId);
    if (backflow?.title && !caseMarkdown.includes(backflow.title)) throw new Error(`${packet.caseId} 连续阅读版漏掉结案前后台回流 ${backflow.title}`);
    if (packet.caseClosing?.verdict && !caseMarkdown.includes(packet.caseClosing.verdict)) throw new Error(`${packet.caseId} 连续阅读版漏掉实机案件结案屏`);
    const deepIndex = caseMarkdown.indexOf("## 深入一问");
    const accusationIndex = caseMarkdown.indexOf("## 收住话头");
    const recapIndex = caseMarkdown.indexOf("## 连线回看");
    const careIndex = caseMarkdown.indexOf("### 今晚最后一句");
    const closingIndex = caseMarkdown.indexOf("## 案件结案｜");
    if (!(deepIndex >= 0 && accusationIndex > deepIndex && recapIndex > accusationIndex && careIndex > recapIndex && closingIndex > careIndex)) {
      throw new Error(`${packet.caseId} 连续阅读版结案顺序与实机不一致`);
    }
  }
  const helperCount = (markdown.match(/\*\*V哥：\*\*/g) ?? []).length;
  const expectedHelperCount = vBroPlayerVisible ? packets.length : 0;
  if (helperCount !== expectedHelperCount) throw new Error(`连续阅读版 V哥露出次数不符合当前可见状态：预期 ${expectedHelperCount}，实际 ${helperCount}`);
}

function assertSourceCompleteness(markdown, sources) {
  const missing = [];
  const visit = (value, path) => {
    if (typeof value === "string") {
      if (value.trim().length < 4) return;
      const tableEscaped = value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
      if (!markdown.includes(value) && !markdown.includes(tableEscaped)) missing.push(path);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${path}[${index}]`));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, entry]) => {
        if (key === "answer" && Array.isArray(value.lines) && value.lines.length) return;
        if (key === "helperHint" && !vBroPlayerVisible) return;
        visit(entry, `${path}.${key}`);
      });
    }
  };
  visit(sources, "source");
  if (missing.length) throw new Error(`readable script omitted source strings: ${missing.slice(0, 12).join(", ")}`);
}

function projectPlayableCaseSource(packet) {
  if (!packet.nightStructure?.enabled) return packet;
  const activeIndexes = new Set([
    ...(packet.nightStructure.segment1SceneIndexes ?? []),
    ...(packet.nightStructure.segment2SceneIndexes ?? [])
  ]);
  return {
    ...packet,
    sceneVersions: (packet.sceneVersions ?? []).filter((_, index) => activeIndexes.has(index))
  };
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}
