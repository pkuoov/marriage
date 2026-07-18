import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packId = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "steam-demo-01";
const checkOnly = process.argv.includes("--check");
const manifest = await readJson(`content/packs/${packId}/manifest.json`);
const castRegistry = await readJson("content/characters/cast.json");
const casePackets = await Promise.all(
  manifest.sequence.map((item) => readJson(`content/packs/${packId}/cases/${item.caseId}.json`))
);
const outputPath = resolve(root, "docs", "generated", `${packId}-character-dialogue-report.md`);
const profiles = castRegistry.cast ?? [];
const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
const sequenceByCaseId = new Map(manifest.sequence.map((item) => [item.caseId, item]));
const lines = [];
const errors = [];
const seen = new Set();

collectShellDialogue();
for (const packet of casePackets) collectCaseDialogue(packet);
assertNoForbiddenPatterns();
if (errors.length) throw new Error(`character dialogue attribution failed:\n${errors.slice(0, 20).join("\n")}`);

const output = renderReport();
if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== output) throw new Error(`character dialogue report is stale; run npm run content:dialogue-report -- ${packId}`);
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);
  console.log(`Character dialogue report ready: ${outputPath}`);
}

function collectCaseDialogue(packet) {
  const item = sequenceByCaseId.get(packet.caseId) ?? {};
  const allowedProfileIds = new Set([
    ...profiles.filter((profile) => profile.caseIds.includes("*")).map((profile) => profile.id),
    ...(item.castProfileIds ?? [])
  ]);
  const callerId = findCaseRole(item, "caller");
  const respondentId = findCaseRole(item, "respondent");
  const hostId = "host-lin-xuyang";

  const add = (profileId, phase, path, text, surface = "") => {
    if (typeof text !== "string" || !text.trim()) return;
    const profile = profilesById.get(profileId);
    if (!profile) {
      errors.push(`${packet.caseId} ${path}: unknown profile ${profileId}`);
      return;
    }
    if (!allowedProfileIds.has(profileId)) {
      errors.push(`${packet.caseId} ${path}: ${profileId} is not in this case cast`);
      return;
    }
    const normalized = text.trim();
    const key = `${packet.caseId}\u0000${profileId}\u0000${path}\u0000${normalized}`;
    if (seen.has(key)) return;
    seen.add(key);
    lines.push({ caseId: packet.caseId, profileId, phase, path, text: normalized, surface });
  };

  const resolveSurface = (surface, path) => {
    const matches = profiles.filter((profile) => allowedProfileIds.has(profile.id) && profile.surfaceNames.includes(surface));
    if (matches.length !== 1) {
      errors.push(`${packet.caseId} ${path}: speaker “${surface}” resolved to ${matches.length} profiles`);
      return "";
    }
    return matches[0].id;
  };

  const visit = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${path}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    const phase = phaseFor(path, packet);
    if (typeof value.speaker === "string" && (typeof value.text === "string" || typeof value.line === "string")) {
      const profileId = resolveSurface(value.speaker, `${path}.speaker`);
      if (profileId) add(profileId, phase, path, value.text ?? value.line, value.speaker);
    } else if (typeof value.role === "string" && typeof value.text === "string") {
      if (value.role === "host") add(hostId, phase, path, value.text, "林旭阳");
      if (value.role === "caller") add(callerId, phase, path, value.text, "咨询者");
    }
    if (typeof value.speakerProfileId === "string") {
      for (const key of ["material", "text", "line"]) add(value.speakerProfileId, phase, `${path}.${key}`, value[key]);
    }
    if (typeof value.advisorId === "string") {
      for (const key of ["text", "advisorLine", "reply"]) add(value.advisorId, phase, `${path}.${key}`, value[key]);
      add(value.advisorId, phase, `${path}.script.reply`, value.script?.reply);
    }
    if (typeof value.hostLine === "string") add(hostId, phase, `${path}.hostLine`, value.hostLine, "林旭阳");
    if (typeof value.callerLine === "string") add(callerId, phase, `${path}.callerLine`, value.callerLine, "咨询者");
    Object.entries(value).forEach(([key, entry]) => visit(entry, `${path}.${key}`));
  };
  visit(packet, "$case");

  for (const [advisorId, outcome] of Object.entries(packet.delegation?.outcomes ?? {})) {
    add(advisorId, "backstage", `$case.delegation.outcomes.${advisorId}.text`, outcome.text);
  }

  add(callerId, "nightA", "$case.openingComplaint", packet.openingComplaint, "咨询者");
  for (const [sceneIndex, scene] of (packet.sceneVersions ?? []).entries()) {
    const phase = scenePhase(sceneIndex, packet);
    const speakerId = resolveSurface(scene.speaker ?? "咨询者", `$case.sceneVersions[${sceneIndex}].speaker`);
    if (speakerId) {
      add(speakerId, phase, `$case.sceneVersions[${sceneIndex}].version`, scene.version, scene.speaker ?? "咨询者");
      add(speakerId, phase, `$case.sceneVersions[${sceneIndex}].revisedVersion`, scene.revisedVersion, scene.speaker ?? "咨询者");
    }
    add("v-bro", phase, `$case.sceneVersions[${sceneIndex}].helperHint`, scene.helperHint, "V哥");
    for (const groupName of ["casualQuestions", "questionOptions", "dialogueOptions"]) {
      for (const [optionIndex, option] of (scene[groupName] ?? []).entries()) {
        const base = `$case.sceneVersions[${sceneIndex}].${groupName}[${optionIndex}]`;
        add(hostId, phase, `${base}.question`, option.question, "林旭阳");
        if (!option.lines?.length) add(callerId, phase, `${base}.answer`, option.answer, "咨询者");
        add(callerId, phase, `${base}.guardedAnswer`, option.guardedAnswer, "咨询者");
        add(callerId, phase, `${base}.reactionLine`, option.reactionLine, "咨询者");
      }
    }
  }

  for (const [earnedItem, opener] of Object.entries(packet.overnightStructure?.callbackOpeners ?? {})) {
    add(callerId, "nightB", `$case.overnightStructure.callbackOpeners.${earnedItem}.line`, opener.line, "咨询者");
  }
  add(callerId, "nightB", "$case.overnightStructure.callbackFallback.line", packet.overnightStructure?.callbackFallback?.line, "咨询者");
  for (const [posture, text] of Object.entries(packet.overnightStructure?.postures ?? {})) {
    add(callerId, "nightB", `$case.overnightStructure.postures.${posture}`, text, "咨询者");
  }
  for (const [stance, text] of Object.entries(packet.nightStructure?.returnStance?.lines ?? {})) {
    add(callerId, "nightB", `$case.nightStructure.returnStance.lines.${stance}`, text, "咨询者");
  }
  const callerQuestion = packet.overnightStructure?.callerQuestion;
  if (callerQuestion) {
    add(callerId, "nightB", "$case.overnightStructure.callerQuestion.prompt", callerQuestion.prompt, "咨询者");
    for (const [index, option] of (callerQuestion.options ?? []).entries()) {
      add(hostId, "nightB", `$case.overnightStructure.callerQuestion.options[${index}].label`, option.label, "林旭阳");
      for (const [choiceIndex, choice] of (option.hostChoices ?? []).entries()) {
        if (!choice.silent) add(hostId, "nightB", `$case.overnightStructure.callerQuestion.options[${index}].hostChoices[${choiceIndex}].label`, choice.label, "林旭阳");
      }
    }
  }

  add(hostId, "ending", "$case.hostDisclosure.text", packet.hostDisclosure?.text, "林旭阳");
  for (const [lineIndex, line] of (packet.hostDisclosure?.lines ?? []).entries()) {
    if (line.speakerProfileId) add(line.speakerProfileId, "ending", `$case.hostDisclosure.lines[${lineIndex}]`, line.text, line.speaker ?? line.speakerProfileId);
  }
  add(hostId, "ending", "$case.deepFollowup.question", packet.deepFollowup?.question, "林旭阳");
  add(callerId, "ending", "$case.deepFollowup.answer", packet.deepFollowup?.answer, "咨询者");
  add(hostId, "ending", "$case.stageJudgement", packet.stageJudgement, "林旭阳");
  for (const [choiceIndex, choice] of (packet.careChoices ?? []).entries()) {
    add(hostId, "ending", `$case.careChoices[${choiceIndex}].hostLine`, choice.hostLine, "林旭阳");
    for (const [lineIndex, line] of (choice.lines ?? []).entries()) {
      if (line.role === "host") add(hostId, "ending", `$case.careChoices[${choiceIndex}].lines[${lineIndex}]`, line.text, line.speaker ?? "林旭阳");
      if (line.role === "caller") add(callerId, "ending", `$case.careChoices[${choiceIndex}].lines[${lineIndex}]`, line.text, line.speaker ?? "咨询者");
    }
  }
  add(hostId, "ending", "$case.caseClosing.verdict", packet.caseClosing?.verdict, "林旭阳");
  if (respondentId) add(respondentId, "backstage", "$case.respondentNote.text", packet.respondentNote?.text, "对方后台留言");
}

function collectShellDialogue() {
  const globalProfiles = profiles.filter((profile) => profile.caseIds.includes("*"));
  const resolveSurface = (surface, path) => {
    const matches = globalProfiles.filter((profile) => profile.surfaceNames.includes(surface));
    if (matches.length !== 1) {
      errors.push(`shell ${path}: speaker “${surface}” resolved to ${matches.length} profiles`);
      return "";
    }
    return matches[0].id;
  };
  const add = (profileId, path, text, surface) => {
    if (typeof text !== "string" || !text.trim()) return;
    const normalized = text.trim();
    const key = `_shell\u0000${profileId}\u0000${path}\u0000${normalized}`;
    if (seen.has(key)) return;
    seen.add(key);
    lines.push({ caseId: "_shell", profileId, phase: "other", path, text: normalized, surface });
  };
  const visit = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${path}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    if (typeof value.speaker === "string" && (typeof value.text === "string" || typeof value.line === "string")) {
      const profileId = resolveSurface(value.speaker, `${path}.speaker`);
      if (profileId) add(profileId, path, value.text ?? value.line, value.speaker);
    }
    if (typeof value.speakerProfileId === "string" && typeof value.base === "string") {
      const profile = profilesById.get(value.speakerProfileId);
      if (!profile) errors.push(`shell ${path}: speakerProfileId “${value.speakerProfileId}” missing`);
      else {
        add(profile.id, `${path}.base`, value.base, value.sender ?? profile.name);
        Object.entries(value.echoes ?? {}).forEach(([choiceId, echo]) => add(profile.id, `${path}.echoes.${choiceId}`, echo, value.sender ?? profile.name));
      }
    }
    Object.entries(value).forEach(([key, entry]) => visit(entry, `${path}.${key}`));
  };
  visit(manifest.nightShell?.prologue, "$manifest.nightShell.prologue");
  visit(manifest.nightShell?.interludes, "$manifest.nightShell.interludes");
  visit(manifest.nightShell?.epilogue, "$manifest.nightShell.epilogue");
}

function findCaseRole(item, kind) {
  const matches = (item.castProfileIds ?? []).map((id) => profilesById.get(id)).filter((profile) => profile?.kind === kind);
  if (matches.length !== 1) {
    errors.push(`${item.caseId}: expected one ${kind}, found ${matches.length}`);
    return "";
  }
  return matches[0].id;
}

function scenePhase(sceneIndex, packet) {
  if ((packet.nightStructure?.segment1SceneIndexes ?? []).includes(sceneIndex)) return "nightA";
  if ((packet.nightStructure?.segment2SceneIndexes ?? []).includes(sceneIndex)) return "nightB";
  return "other";
}

function phaseFor(path, packet) {
  const sceneMatch = path.match(/sceneVersions\[(\d+)\]/);
  if (sceneMatch) return scenePhase(Number(sceneMatch[1]), packet);
  if (path.includes("overnightStructure.dayScenes")) return "day";
  if (path.includes("nightStructure.interlude")) return "interlude";
  if (/callbackOpeners|callbackFallback|returnStance|overnightStructure\.postures|callerQuestion/.test(path)) return "nightB";
  if (/openingDialogue|openingComplaint|nightStructure\.hangup/.test(path)) return "nightA";
  if (/hostDisclosure|deepFollowup|stageJudgement|caseClosing|conclusion|storyInterludeRecap/.test(path)) return "ending";
  if (/investigationHooks|advisorNotes|respondentNote|delegation|evidenceChecks|evidenceCards/.test(path)) return "backstage";
  return "other";
}

function assertNoForbiddenPatterns() {
  const forbidden = [
    { label: "我现在想知道的是", regex: /我现在想知道的是/ },
    { label: "本质上", regex: /本质上/ },
    { label: "更重要的是", regex: /更重要的是/ },
    { label: "一方面／另一方面", regex: /一方面.{0,36}另一方面/ }
  ];
  const violations = [];
  for (const line of lines) {
    for (const rule of forbidden) {
      if (rule.regex.test(line.text)) violations.push(`${line.caseId} ${line.path}: ${rule.label}`);
    }
  }
  if (violations.length) throw new Error(`forbidden dialogue templates found:\n${violations.slice(0, 20).join("\n")}`);
}

function renderReport() {
  const out = [];
  const phaseLabels = {
    nightA: "夜 A",
    interlude: "收麦幕间",
    day: "白天",
    nightB: "夜 B",
    backstage: "后台／材料回流",
    ending: "终局",
    other: "其他出声面"
  };
  const orderedPhases = Object.keys(phaseLabels);
  const profilesWithLines = new Set(lines.map((line) => line.profileId));
  const rhythmWarnings = findRhythmWarnings();
  out.push(`# 《${manifest.title}》按角色台词报告`, "");
  out.push("> 本文档由内容包自动生成。它把分散在夜 A、白天、夜 B、顾问回流和结案中的台词重新按人物聚合，供遮名辨人、知识边界和句长节奏审稿。请修改 JSON 真源后运行 `npm run content:dialogue-report`，不要手改本文档。", "");
  out.push("## 汇总", "");
  out.push(`- 固定人物卡：${profiles.length}`);
  out.push(`- 收录台词／玩家可见人物材料：${lines.length}`);
  out.push(`- 本包实际出声人物：${profilesWithLines.size}`);
  out.push(`- 句长节奏人工复核提示：${rhythmWarnings.length}`);
  out.push("- 构建时硬拦截：未归属说话人、越案人物 ID，以及“我现在想知道的是／本质上／更重要的是／一方面另一方面”高密度模板。", "");

  const shellProfileIds = profiles.filter((profile) => profile.caseIds.includes("*")).map((profile) => profile.id);
  const shellLines = lines.filter((line) => line.caseId === "_shell");
  if (shellLines.length) {
    out.push("# 全集外壳", "");
    for (const profileId of shellProfileIds) {
      const profile = profilesById.get(profileId);
      const profileLines = shellLines.filter((line) => line.profileId === profileId);
      if (!profile || !profileLines.length) continue;
      renderProfileSection(out, profile, profileLines, orderedPhases, phaseLabels);
    }
  }

  for (const packet of casePackets) {
    const item = sequenceByCaseId.get(packet.caseId) ?? {};
    out.push(`# ${packet.caseTitle?.title ?? packet.storyArcTitle ?? packet.label ?? packet.caseId}`, "");
    const orderedProfileIds = [...new Set(["host-lin-xuyang", ...(item.castProfileIds ?? []), ...shellProfileIds])];
    for (const profileId of orderedProfileIds) {
      const profile = profilesById.get(profileId);
      const profileLines = lines.filter((line) => line.caseId === packet.caseId && line.profileId === profileId);
      if (!profile || !profileLines.length) continue;
      renderProfileSection(out, profile, profileLines, orderedPhases, phaseLabels);
    }
  }

  const silentProfiles = profiles.filter((profile) => !profilesWithLines.has(profile.id));
  out.push("# 未在本报告捕获到台词的人物卡", "");
  if (!silentProfiles.length) out.push("无。", "");
  else silentProfiles.forEach((profile) => out.push(`- ${profile.name}（${profile.id}）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。`));
  out.push("");

  out.push("# 句长节奏人工复核", "");
  if (!rhythmWarnings.length) out.push("未发现连续三句长度高度接近的中句组。", "");
  else {
    out.push("以下只是朗读提醒，不自动判错。三句服务于不同防御动作时可以保留。", "");
    for (const warning of rhythmWarnings) out.push(`- ${warning}`);
    out.push("");
  }
  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function renderProfileSection(out, profile, profileLines, orderedPhases, phaseLabels) {
  out.push(`## ${profile.name}`, "");
  out.push(`- **固定性格：** ${profile.personality?.core ?? ""}`);
  out.push(`- **受压反应：** ${profile.personality?.stressResponse ?? ""}`);
  out.push(`- **防御动作：** ${profile.defense ?? ""}`);
  out.push(`- **知识边界：** ${profile.knowledgeBoundary ?? ""}`, "");
  for (const phase of orderedPhases) {
    const phaseLines = profileLines.filter((line) => line.phase === phase);
    if (!phaseLines.length) continue;
    out.push(`### ${phaseLabels[phase]}`, "");
    for (const line of phaseLines) out.push(`- \`${line.path}\` ${oneLine(line.text)}`);
    out.push("");
  }
}

function findRhythmWarnings() {
  const warnings = [];
  const groups = new Map();
  for (const line of lines) {
    const key = `${line.caseId}\u0000${line.profileId}\u0000${line.phase}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(line);
  }
  for (const group of groups.values()) {
    for (let index = 0; index <= group.length - 3; index += 1) {
      const sample = group.slice(index, index + 3);
      const lengths = sample.map((line) => oneLine(line.text).length);
      if (Math.min(...lengths) < 18 || Math.max(...lengths) > 58 || Math.max(...lengths) - Math.min(...lengths) > 4) continue;
      const profile = profilesById.get(sample[0].profileId);
      warnings.push(`${sample[0].caseId}／${profile?.name ?? sample[0].profileId}／${sample[0].phase}：${lengths.join("、")} 字（${sample.map((line) => line.path).join("；")}）`);
      if (warnings.length >= 24) return warnings;
    }
  }
  return warnings;
}

function oneLine(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}
