import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "steam-demo-01";
const checkOnly = process.argv.includes("--check");
const manifest = await readJson(`content/packs/${packId}/manifest.json`);
const comments = await readJson(`content/packs/${packId}/comments.json`);
const castRegistry = await readJson("content/characters/cast.json");
const casePackets = await Promise.all(
  manifest.sequence.map((item) => readJson(`content/packs/${packId}/cases/${item.caseId}.json`))
);
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
  }
];
assertSourceCompleteness(outputs[0].content, { manifest, comments, cases: casePackets });

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
  add("> 本文档由内容包自动汇编。它按真实游玩顺序整理夜 A、收麦幕间、白天调查、夜 B、材料与所有分支；方括号内是舞台或玩法说明，不是角色台词。请修改 JSON 真源后运行 `npm run content:script`，不要手改本文档。", "");
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
  renderNode(lines, manifest.caseLabels, "来电标签", 3);
  renderNode(lines, manifest.sequence, "案件顺序", 3);
  add("");

  add("## 演员与声纹速查", "");
  add("| 角色 | 类型 | 固定性格 | 压力反应 | 主要声纹 |", "|---|---|---|---|---|");
  for (const profile of castRegistry.cast ?? []) {
    add(`| ${cell(profile.name)} | ${cell(profile.kind)} | ${cell(profile.personality?.core)} | ${cell(profile.personality?.stressResponse)} | ${cell([profile.voice?.rhythm, ...(profile.voice?.lexicon ?? [])].filter(Boolean).join("；"))} |`);
  }
  add("");

  add("## 序幕：凌晨一点，ON AIR", "");
  for (const line of manifest.nightShell?.prologue?.lines ?? []) renderSpokenLine(lines, line);
  if (manifest.nightShell?.prologue?.hostLine) renderSpokenLine(lines, manifest.nightShell.prologue.hostLine);
  add("");

  casePackets.forEach((packet, caseIndex) => {
    const item = sequenceByCaseId.get(packet.caseId) ?? {};
    const caseNumber = chineseNumber(caseIndex + 1);
    const title = packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? packet.caseId;
    add(`# 第${caseNumber}案：${title}`, "");
    add(`> ${item.bridge ?? packet.publicHook ?? ""}`, "");
    add(`- **案件 ID：** ${packet.caseId}`);
    add(`- **剧情 ID：** ${packet.plotId}`);
    if (packet.storyArcTitle) add(`- **内容包原题：** ${packet.storyArcTitle}`);
    if (packet.caseTitle?.subtitle) add(`- **副标题：** ${packet.caseTitle.subtitle}`);
    if (packet.caseTitle?.intro) add(`- **标题卡引子：** ${packet.caseTitle.intro}`);
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
    for (const key of ["dramaticAnchor", "whyTonight", "objectPurpose", "callerStake", "otherStake", "thirdPressure", "selfServingOmission", "publicHook", "storyArcSummary", "storySuspense", "storyClueObject"]) {
      if (packet[key] !== undefined) renderNode(lines, packet[key], key, 3);
    }
    add("");

    add("## 夜 A：第一次来电", "");
    if (packet.openingComplaint) add(`**咨询者：** ${packet.openingComplaint}`, "");
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
    renderNode(lines, overnight.snapshotEcho, "立场快照回应拍", 3);
    renderNode(lines, overnight.callerQuestion, "来电人反问", 3);
    const secondNightIndexes = packet.nightStructure?.segment2SceneIndexes ?? [];
    secondNightIndexes.forEach((sceneIndex, localIndex) => {
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
    for (const key of ["hostDisclosure", "hostWoundHook", "deepFollowup", "stageJudgement", "quotePickCandidates", "accusationChoices", "caseClosing", "storyInterludeRecap", "conclusionWhenCleared", "conclusionBranches", "followupTwist", "dailyShareTitle", "dailyShareBody", "dailyShareQuestion", "truth"]) {
      if (packet[key] !== undefined) renderNode(lines, packet[key], key, 3);
    }
    add("");

    add("## 【编剧资料】事实边界与运行规则", "");
    const alreadyRendered = new Set([
      "caseId", "plotId", "label", "storyArcTitle", "caseTitle", "dramaticAnchor", "whyTonight", "objectPurpose", "callerStake", "otherStake", "thirdPressure", "selfServingOmission", "publicHook", "storyArcSummary", "storySuspense", "storyClueObject", "openingComplaint", "openingDialogue", "sceneVersions", "nightStructure", "overnightStructure", "stanceSnapshot", "delegation", "evidenceCards", "evidenceChecks", "investigationHooks", "documents", "advisorNotes", "respondentNote", "lurkerNote", "crossCaseEchoes", "hostDisclosure", "hostWoundHook", "deepFollowup", "stageJudgement", "quotePickCandidates", "accusationChoices", "caseClosing", "storyInterludeRecap", "conclusionWhenCleared", "conclusionBranches", "followupTwist", "dailyShareTitle", "dailyShareBody", "dailyShareQuestion", "truth"
    ]);
    for (const [key, value] of Object.entries(packet)) {
      if (!alreadyRendered.has(key)) renderNode(lines, value, key, 3);
    }
    add("");

    const interlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === packet.caseId);
    if (interlude) add("## 案间串场", "", interlude.line, "");
  });

  add("# 尾声", "");
  renderNode(lines, manifest.nightShell?.epilogue, "收播后", 2);
  add("", "# 评论与分享文案库", "");
  renderNode(lines, comments, "评论种子", 2);
  add("");
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function renderDirectorScript() {
  const lines = [];
  const sequenceByCaseId = new Map(manifest.sequence.map((item) => [item.caseId, item]));
  const profilesById = new Map((castRegistry.cast ?? []).map((profile) => [profile.id, profile]));

  lines.push(`# 《${manifest.title}》导演阅读版`, "");
  lines.push(
    "> 本版只保留排演所需的台词、动作、场景目标、主要选择与分支入口。完整事实字段、所有材料追问和运行时配置见同目录的“全量可读文字剧本”。两份文档均由 JSON 真源生成，请勿手改。",
    ""
  );
  lines.push("## 排演总原则", "");
  lines.push(`- **主题：** ${manifest.theme?.title ?? ""}`);
  lines.push(`- **主题句：** ${manifest.theme?.thesis ?? ""}`);
  lines.push("- 夜 A 让人物按自己的防御讲故事；白天让物件和第三方改变主语；夜 B 才让省略重新回到人物嘴里。", "- 方括号为舞台、表演或玩家操作，不念出。`【防备分支】` 只在压力不足时使用。", "");

  lines.push("# 序幕", "", "【凌晨一点。控台灯亮，直播间连线。】", "");
  for (const line of manifest.nightShell?.prologue?.lines ?? []) renderDirectorSpoken(lines, line);
  if (manifest.nightShell?.prologue?.hostLine) renderDirectorSpoken(lines, manifest.nightShell.prologue.hostLine);

  casePackets.forEach((packet, caseIndex) => {
    const item = sequenceByCaseId.get(packet.caseId) ?? {};
    const title = packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? packet.caseId;
    lines.push(`# 第${chineseNumber(caseIndex + 1)}案｜${title}`, "");
    if (packet.caseTitle?.subtitle) lines.push(`**副标题：** ${packet.caseTitle.subtitle}`, "");
    if (packet.caseTitle?.intro) lines.push(`【标题卡】${packet.caseTitle.intro}`, "");
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

    lines.push("## 夜 A｜第一次来电", "", "【ON AIR。先让咨询者把自己相信的版本讲完整。】", "");
    if (packet.openingComplaint) lines.push(`**咨询者：** ${packet.openingComplaint}`, "");
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
    if (overnight.hangupLine) lines.push(`【回拨前】${overnight.hangupLine}`, "");
    if (overnight.hostHoldLine) lines.push(`**林旭阳：** ${overnight.hostHoldLine}`, "");
    lines.push("### 带回物开场", "");
    for (const [earnedItem, opener] of Object.entries(overnight.callbackOpeners ?? {})) {
      lines.push(`#### ${earnedItem}`, "", `**咨询者：** ${opener.line ?? ""}`, "");
      if (opener.firstConflict?.hostLine) lines.push(`**林旭阳：** ${opener.firstConflict.hostLine}`, "");
      if (opener.firstConflict?.callerLine) lines.push(`**咨询者：** ${opener.firstConflict.callerLine}`, "");
      if (opener.firstConflict?.pauseAfterCallerLine) lines.push("【停顿】", "");
      if (opener.firstConflict?.callerFollowupLine) lines.push(`**咨询者：** ${opener.firstConflict.callerFollowupLine}`, "");
    }
    if (overnight.callbackFallback?.line) lines.push("#### 没带回关键物件", "", `**咨询者：** ${overnight.callbackFallback.line}`, "");
    if (packet.nightStructure?.returnStance?.lines) {
      lines.push("### 回拨时的咨询者立场", "");
      for (const [stance, line] of Object.entries(packet.nightStructure.returnStance.lines)) lines.push(`- **${humanLabel(stance)}：** ${line}`);
      lines.push("");
    }
    if (overnight.snapshotEcho) {
      lines.push("### 中段立场回应拍", "");
      for (const [optionId, line] of Object.entries(overnight.snapshotEcho)) lines.push(`- **${optionId}：** ${line}`);
      lines.push("");
    }
    (packet.nightStructure?.segment2SceneIndexes ?? []).forEach((sceneIndex, localIndex) => {
      renderDirectorScene(lines, packet.sceneVersions?.[sceneIndex], `夜 B · ${localIndex + 1}`);
      for (const beat of (overnight.liveCounterBeats ?? []).filter((item) => item.afterSceneIndex === sceneIndex)) renderDirectorLiveCounter(lines, beat);
    });

    lines.push("## 终局｜确认到哪，停在哪", "");
    if (packet.hostDisclosure?.text) lines.push(`【主播自揭，仅一次】${packet.hostDisclosure.text}`, "");
    if (packet.deepFollowup?.question) {
      lines.push(`**林旭阳：** ${packet.deepFollowup.question}`, "");
      for (const beat of packet.deepFollowup.resistanceBeat?.lines ?? []) renderDirectorSpoken(lines, beat);
      lines.push(`**咨询者：** ${packet.deepFollowup.answer ?? ""}`, "");
    }
    if (packet.respondentNote?.text) lines.push(`【对方后台留言，不可追问】${packet.respondentNote.text}`, "");
    if (packet.stageJudgement) lines.push(`**林旭阳：** ${packet.stageJudgement}`, "");
    renderDirectorClosing(lines, packet.caseClosing);
    const interlude = manifest.nightShell?.interludes?.find((entry) => entry.afterCaseId === packet.caseId);
    if (interlude?.line) lines.push("## 案间转场", "", `【${interlude.line}】`, "");
  });

  lines.push("# 尾声", "");
  const epilogue = manifest.nightShell?.epilogue;
  if (epilogue?.line) lines.push(`【${epilogue.line}】`, "");
  for (const line of epilogue?.lines ?? []) renderDirectorSpoken(lines, line);
  if (epilogue?.hostLine) renderDirectorSpoken(lines, epilogue.hostLine);
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function renderDirectorScene(lines, scene, label) {
  if (!scene) return;
  lines.push(`### ${label}｜${scene.id ?? "未命名场"}`, "");
  if (scene.version) lines.push(`**${scene.speaker ?? "咨询者"}：** ${scene.version}`, "");
  if (scene.pressureHint?.expression?.text) lines.push(`【受压动作】${scene.pressureHint.expression.text}`, "");
  const coreQuestions = (scene.questionOptions ?? []).filter((option) => option.correct);
  for (const option of coreQuestions) {
    if (option.suspicionLabel) lines.push(`【玩家怀疑方向】${option.suspicionLabel}`, "");
    lines.push(`**林旭阳：** ${option.question}`, "");
    for (const beat of option.resistanceBeat?.lines ?? []) renderDirectorSpoken(lines, beat);
    lines.push(`**咨询者：** ${option.answer}`, "");
    if (option.guardedAnswer) lines.push(`【防备分支·咨询者】${option.guardedAnswer}`, "");
  }
  if (scene.revisedVersion) lines.push(`【材料触发后的重述】**${scene.speaker ?? "咨询者"}：** ${scene.revisedVersion}`, "");
  if (scene.afterScene?.line) lines.push(`【段后】${scene.afterScene.line}`, "");
}

function renderDirectorSpoken(lines, line) {
  if (!line) return;
  if (line.role === "pause") {
    lines.push("【停顿】", "");
    return;
  }
  if (line.role === "stage") {
    lines.push(`【${line.text ?? ""}】`, "");
    return;
  }
  const speaker = line.speaker ?? roleLabel(line.role) ?? "台词";
  const spoken = line.text ?? line.line;
  if (spoken) lines.push(`**${speaker}：** ${spoken}`, "");
}

function renderDirectorLiveCounter(lines, beat = {}) {
  lines.push(`### 场间实时反压｜${beat.from ?? beat.id ?? "后台"}`, "");
  if (beat.text) lines.push(`【${beat.text}】`, "");
  for (const line of beat.lines ?? []) renderDirectorSpoken(lines, line);
  for (const choice of beat.choices ?? []) {
    lines.push(`- **玩家选择：** ${choice.label}`);
    if (choice.questionOverride?.question) lines.push(`  - **下一问改为：** ${choice.questionOverride.question}`);
    if (choice.recapAftertaste) lines.push(`  - **回味：** ${choice.recapAftertaste}`);
  }
  if ((beat.choices ?? []).length) lines.push("");
}

function renderDirectorHangup(lines, hangup) {
  if (!hangup) return;
  lines.push("### 第一次收麦", "");
  if (hangup.hangupLine) lines.push(`【${hangup.hangupLine}】`, "");
  if (hangup.line) lines.push(`【${hangup.line}】`, "");
  if (hangup.hostHoldLine) lines.push(`**林旭阳：** ${hangup.hostHoldLine}`, "");
  if (hangup.hostLine) lines.push(`**林旭阳：** ${hangup.hostLine}`, "");
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
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  if (!columns.length) return;
  lines.push(`| ${columns.map((column) => cell(humanLabel(column))).join(" | ")} |`);
  lines.push(`| ${columns.map(() => "---").join(" | ")} |`);
  rows.forEach((row) => lines.push(`| ${columns.map((column) => cell(row[column] ?? "")).join(" | ")} |`));
  lines.push("");
}

function renderDirectorClosing(lines, closing) {
  if (!closing) return;
  lines.push(`### ${closing.title ?? "结案"}`, "");
  if (closing.verdict) lines.push(`**林旭阳：** ${closing.verdict}`, "");
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
  if (scene.version) lines.push(`**${scene.speaker ?? "咨询者"}：** ${scene.version}`, "");
  if (scene.revisedVersion) lines.push(`【材料触发后的重述】 **${scene.speaker ?? "咨询者"}：** ${scene.revisedVersion}`, "");
  if (scene.helperHint) lines.push(`【主动求助·V哥】 ${scene.helperHint}`, "");
  for (const [key, value] of Object.entries(scene)) {
    if (["id", "speaker", "version", "revisedVersion", "helperHint"].includes(key)) continue;
    renderNode(lines, value, key, 4);
  }
}

function renderSpokenLine(lines, line) {
  if (!line) return;
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
  if (value.speaker && (value.text || value.line)) {
    lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "");
    renderSpokenLine(lines, value);
    return;
  }
  if (value.question && value.answer) {
    lines.push(`${"#".repeat(Math.min(level, 6))} ${title}`, "", `**林旭阳：** ${value.question}`, "", `**咨询者：** ${value.answer}`, "");
    renderObjectBody(lines, value, level + 1, new Set(["question", "answer"]));
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
  const rows = document.rows ?? [];
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  if (columns.length) {
    lines.push(`| ${columns.map((column) => cell(humanLabel(column))).join(" | ")} |`);
    lines.push(`| ${columns.map(() => "---").join(" | ")} |`);
    rows.forEach((row) => lines.push(`| ${columns.map((column) => cell(row[column] ?? "")).join(" | ")} |`));
    lines.push("");
  }
  for (const [key, value] of Object.entries(document)) {
    if (["title", "intro", "rows"].includes(key)) continue;
    renderNode(lines, value, key, level);
  }
}

function isDocument(value) {
  return value && typeof value === "object" && Array.isArray(value.rows) && value.rows.every((row) => row && typeof row === "object" && !Array.isArray(row));
}

function humanLabel(key) {
  const labels = {
    id: "内部 ID", caseId: "案件 ID", plotId: "剧情 ID", runtimeContentStatus: "运行时状态", callMedium: "来电媒介", speakerProfileId: "声纹卡 ID", voiceAttribution: "声音归属",
    dramaticAnchor: "戏剧锚点", whyTonight: "为何今晚发生", objectPurpose: "核心物件作用", callerStake: "咨询者所求", otherStake: "对方所求", thirdPressure: "第三压力", selfServingOmission: "咨询者自利删减",
    publicHook: "公开钩子", storyArcSummary: "故事概述", storySuspense: "悬念", storyClueObject: "线索物件", storyArcTitle: "故事标题",
    clueRole: "线索职能", falseFrame: "错误框架", payoffFor: "回收目标", speakerId: "说话人 ID", doubt: "现场疑点", contradiction: "矛盾", reliability: "可靠度", showsCard: "展示卡片",
    casualQuestions: "自由追问", questionOptions: "关键追问", dialogueOptions: "补充对话", question: "主播问句", answer: "咨询者回答", guardedAnswer: "防备回答", suspicionLabel: "玩家所选怀疑方向", correct: "是否核心项", routeAxis: "路线轴", routeTone: "路线口气",
    pressureHint: "压力表演", intentHook: "意图钩子", callerGuard: "防备状态", expression: "表情/听感", helperHint: "V哥提示",
    afterScene: "段后触发", kind: "类型", checkId: "材料检视 ID", revisedVersion: "材料触发后的重述",
    title: "标题", subtitle: "副标题", intro: "引子", text: "正文", line: "台词", role: "角色职能", type: "表现类型", audioCueId: "音频提示",
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
    caseClosing: "正式结案", verdict: "结论", confirmed: "已确认", unresolved: "未决", nextStep: "下一步", dailyShareTitle: "分享卡标题", dailyShareBody: "分享卡正文", dailyShareQuestion: "分享题", truth: "作者真相",
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
      Object.entries(value).forEach(([key, entry]) => visit(entry, `${path}.${key}`));
    }
  };
  visit(sources, "source");
  if (missing.length) throw new Error(`readable script omitted source strings: ${missing.slice(0, 12).join(", ")}`);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}
