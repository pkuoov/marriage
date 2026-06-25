import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateCasesForMode } from "../src/caseModes.js?v=0.19.36";
import { explanationForExpected } from "../src/caseNarration.js?v=0.19.36";
import { expectedAccusationForCase } from "../src/caseRuntime.js?v=0.19.36";
import { NPCS } from "../src/story.js?v=0.19.36";

const attrs = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const defaultKeys = [
  "2026-06-24",
  "2026-06-25",
  "2026-06-26",
  "2026-06-27",
  "2026-06-28",
  "2026-06-29",
  "2026-06-30",
  "2026-07-01"
];
const keys = parseKeys(process.argv.slice(2));
const reportPath = resolve("docs/generated/narrative-flow-report.md");

function parseKeys(args) {
  const keyArg = args.find((arg) => arg.startsWith("--keys="));
  if (!keyArg) return defaultKeys;
  const values = keyArg.replace("--keys=", "").split(",").map((item) => item.trim()).filter(Boolean);
  return values.length ? values : defaultKeys;
}

function generateBrief(key) {
  return generateCasesForMode("daily", NPCS, attrs, { dailyKey: key })[0];
}

function extractFlow(brief, key) {
  return {
    key,
    id: brief.id,
    plotId: brief.plotId,
    label: brief.label,
    stance: brief.stance,
    respondentId: brief.respondentId,
    opening: (brief.openingDialogue ?? []).map((line, index) => ({
      id: `opening-${index + 1}`,
      speakerId: line.speakerId ?? null,
      speaker: speakerLabel(brief, line),
      text: line.text ?? ""
    })),
    scenes: (brief.sceneVersions ?? []).map((scene, index) => ({
      id: `scene-${index + 1}`,
      speakerId: scene.speakerId ?? null,
      speaker: speakerLabel(brief, scene),
      text: scene.version ?? "",
      doubt: scene.doubt ?? "",
      contradiction: scene.contradiction ?? "",
      options: (scene.questionOptions ?? []).map((option, optionIndex) => ({
        id: `scene-${index + 1}-q${optionIndex + 1}`,
        question: option.question ?? "",
        answer: option.answer ?? "",
        contradiction: option.contradiction ?? "",
        correct: option.correct !== false
      }))
    })),
    testimony: (brief.testimony ?? []).map((item, index) => ({
      id: `testimony-${index + 1}`,
      speakerId: item.speakerId ?? null,
      speaker: speakerLabel(brief, item),
      text: item.line ?? "",
      kind: item.kind ?? "",
      surface: item.surface ?? "",
      hint: item.hint ?? "",
      followups: (item.followups ?? []).map((followup, followupIndex) => ({
        id: `testimony-${index + 1}-f${followupIndex + 1}`,
        question: followup.question ?? "",
        result: followup.result ?? "",
        contradiction: followup.contradiction ?? "",
        correct: followup.correct !== false
      }))
    })),
    evidenceCards: brief.evidenceCards ?? [],
    stageJudgement: brief.stageJudgement ?? "",
    followupTwist: brief.followupTwist ?? "",
    truth: brief.truth ?? "",
    expected: expectedAccusationForCase(brief),
    expectedWhy: explanationForExpected(brief, expectedAccusationForCase(brief))
  };
}

function speakerLabel(brief, item = {}) {
  if (item.role === "host" || item.speaker === "你") return "你";
  if (item.role === "caller") return "咨询者";
  if (item.speakerId === brief.complainantId) return "咨询者";
  if (item.speakerId === brief.respondentId) return "咨询者转述";
  return item.speaker ?? "材料";
}

function validateFlow(flow) {
  const issues = [];
  const allText = flattenText(flow);
  const openingText = flow.opening.map((line) => line.text).join(" ");
  const sceneText = flow.scenes.map((scene) => `${scene.text} ${scene.doubt} ${scene.contradiction}`).join(" ");
  const playerQuestions = flow.scenes.flatMap((scene) => scene.options.map((option) => option.question)).join(" ");
  const allAnswers = flow.scenes.flatMap((scene) => scene.options.map((option) => option.answer)).join(" ");
  const testimonyText = flow.testimony.map((item) => `${item.text} ${item.hint} ${item.followups.map((followup) => `${followup.question} ${followup.result}`).join(" ")}`).join(" ");

  check(flow.opening.every((line) => line.speakerId !== flow.respondentId), "SINGLE_CALLER_OPENING", "每日直播间开场不能让另一方直接在场。");
  check(flow.scenes.every((scene) => scene.speakerId !== flow.respondentId), "SINGLE_CALLER_SCENE", "每日 sceneReview 只能和咨询者对话，另一方只能由咨询者转述或材料呈现。");
  check(flow.testimony.every((item) => item.speakerId !== flow.respondentId), "SINGLE_CALLER_TESTIMONY", "每日 testimony 不能出现另一方接麦。");
  check(flow.scenes.every((scene) => scene.speaker === "咨询者"), "CALLER_SCENE_ONLY", "每日 sceneReview 的材料必须由咨询者说出，不能由后台/回拨/系统段落直接插入。");
  check(flow.testimony.every((item) => item.speaker === "咨询者"), "CALLER_TESTIMONY_ONLY", "每日 testimony 的材料必须由咨询者说出，不能由后台/主播记事直接插入。");
  check(!hasRealNpcName(allText), "NO_REAL_NAMES", "每日直播间文本不能出现 NPC 真名。");
  check(!hasCallerPerspectiveLeak(allText), "CALLER_PERSPECTIVE", "咨询者语境下的反馈应使用第一人称或直接引语，不能写成第三人称旁白。");
  check(Boolean(flow.opening.length >= 2 && flow.opening.length <= 5), "OPENING_LENGTH", "开场应控制在 2-5 句，适合手机首屏。");
  check(flow.opening[0]?.speaker === "咨询者", "CALLER_FIRST", "第一句必须由咨询者开口。");
  check(flow.opening.some((line) => line.speaker === "你"), "HOST_AFTER_CALLER", "开场必须有主播接话，但不能抢在咨询者之前。");
  check(!hasRedundantHostOpening(flow.opening), "HOST_REDUNDANT_OPENING", "主播不能重复询问咨询者刚刚已经说过的信息。");
  check(!hasOpeningTurnMismatch(flow.opening), "HOST_ANSWER_MISMATCH", "主播问句必须和咨询者下一句回答接上，不能缺少中间桥。");
  check(hasRelationshipContext(openingText), "RELATIONSHIP_CONTEXT", "开场必须交代关系阶段或关系来源。");
  check(hasSuspiciousMaterialOrEvent(allText), "SUSPICIOUS_TRIGGER", "案子必须有自然出现的可疑材料、话术或事件。");
  check(hasDramaticAnchor(allText), "DRAMATIC_ANCHOR", "每日案必须有具体戏剧物件、原话或动作，不能只是抽象核验。");
  check(hasGrayZoneMotivation(allText), "GRAY_ZONE_MOTIVE", "每日案必须有灰区动机或不明确推手，例如父母、面子、转述、平台、朋友或双方压力。");
  check(hasPurposeSignal(allText), "MOTIVE_CHAIN", "隐藏/裁切/改口必须有目的：推进、过关、借钱、见父母、面子、资源或退路。");
  check(hasRiskIfExposed(allText), "RISK_IF_EXPOSED", "必须能看出完整说清后会失去什么或被谁追问。");
  check(flow.scenes.length >= 2 && flow.scenes.length <= 3, "SCENE_COUNT", "每日案 sceneReview 应为 2-3 段。");
  flow.scenes.forEach((scene) => {
    check(Boolean(scene.text && scene.contradiction), "SCENE_HAS_GAP", `${scene.id} 必须同时有叙述和矛盾。`);
    check(scene.options.length >= 2 && scene.options.length <= 3, "CHOICE_COUNT", `${scene.id} 选项应为 2-3 个。`);
    scene.options.forEach((option) => {
      check(isHostLikeQuestion(option.question), "HOST_LIKE_CHOICE", `${option.id} 必须像主播会问的话：${option.question}`);
      check(!isNoClickChoice(option.question), "NO_CLICK_CHOICE", `${option.id} 不能是没人会点的无脑选项：${option.question}`);
      check(!hasUnsupportedHostLeap(option.question), "HOST_LOGIC_LEAP", `${option.id} 主播追问不能从证明/说服直接跳到推进后续事件：${option.question}`);
      check(Boolean(option.answer), "CHOICE_FEEDBACK", `${option.id} 必须有反馈。`);
    });
  });
  check(!revealsFinalAnswerTooEarly(openingText), "NO_EARLY_SPOILER", "开场不能直接说出最终责任或答案。");
  check(hasQuestionPathToContradiction(playerQuestions, allAnswers, sceneText), "QUESTION_TO_CLUE", "玩家追问必须能自然导向矛盾，而不是凭空揭示。");
  check(flow.testimony.length >= 2, "TESTIMONY_COUNT", "必须有至少 2 条后续原话/材料摘录。");
  check(testimonyReferencesScene(testimonyText, sceneText, allAnswers), "TESTIMONY_CONTINUITY", "后续原话必须承接前面已出现的事实或反馈。");
  check(recapUsesFoundLogic(flow), "RECAP_CONTINUITY", "结案/回拨/真相必须承接前面出现过的动机或矛盾。");
  check(!hasPreachyCopy(allText), "NO_PREACHY_COPY", "文本不应像教程、法律讲义或明示提示。");
  check(!hasGenericDebugCopy(allText), "NO_GENERIC_LEFTOVER", "不应出现后台、阶段判断、核验清单等泛用代码残留。");
  buildWalkthroughs(flow).forEach((walkthrough) => {
    validateWalkthrough(walkthrough).forEach((issue) => {
      issues.push({
        code: `WALKTHROUGH_${issue.code}`,
        message: `${walkthrough.id} ${issue.message}`
      });
    });
  });

  function check(ok, code, message) {
    if (!ok) issues.push({ code, message });
  }
  return issues;
}

function flattenText(flow) {
  return [
    ...flow.opening.map((line) => line.text),
    ...flow.scenes.flatMap((scene) => [
      scene.text,
      scene.doubt,
      scene.contradiction,
      ...scene.options.flatMap((option) => [option.question, option.answer, option.contradiction])
    ]),
    ...flow.testimony.flatMap((item) => [
      item.text,
      item.hint,
      ...item.followups.flatMap((followup) => [followup.question, followup.result, followup.contradiction])
    ]),
    ...flow.evidenceCards.flatMap((card) => [card.title, card.front, card.detail, card.contradiction]),
    flow.stageJudgement,
    flow.followupTwist,
    flow.truth,
    flow.expectedWhy
  ].filter(Boolean).join(" ");
}

function hasRelationshipContext(text) {
  return /相亲|男朋友|女朋友|对象|结婚|见父母|婚前|同居|恋爱|家里|父母|前任|伴侣/.test(text);
}

function hasSuspiciousMaterialOrEvent(text) {
  return /截图|账单|合同|协议|草稿|排班表|聊天|社保|转账|房本|账户|饭局|借钱|还贷|分期|备注|原话|回拨/.test(text);
}

function hasDramaticAnchor(text) {
  return /存款证明|证明|截图|账单|合同|协议|草稿|排班表|聊天|社保|转账|房本|账户|饭局|借钱|还贷|分期|备注|原话|回拨|录音|余额|受益人|礼物|年卡/.test(text);
}

function hasGrayZoneMotivation(text) {
  return /说不清|不确定|可能|像在要|转述|父母|家里|妈妈|朋友|平台|面子|体面|松了一口气|被问住|借.*嘴|双方|一边|一半|误会|不信任|被筛|表演|试探/.test(text);
}

function hasPurposeSignal(text) {
  return /为了|想先|先把|推进|催|定下来|过关|筛掉|放心|误会|诚意|面子|家里|父母|资源|还款|周转|投店|带客|见面|饭局|好印象|好感|不信任|安全感/.test(text);
}

function hasRiskIfExposed(text) {
  return /怕|不想|筛掉|误会|离开|丢脸|打脸|不稳定|不信任|被问|追问|短板|筛|撑|爆雷|失去|来不及|成本/.test(text);
}

function isHostLikeQuestion(question) {
  return /你|他|她|TA|对方|这|那|怎么|为什么|哪|有没有|是不是|先|说|问|补全|原话|发来|算什么|见父母|钱|图|饭局|还贷|账/.test(question);
}

function isNoClickChoice(question) {
  return /是真的.*相信|先相信|别纠结|别聊僵|不重要|无所谓|条件.*够强|已经够强/.test(question);
}

function hasUnsupportedHostLeap(question) {
  return /(?:图|截图|材料|资料).*(?:推进|推动)|(?:推进|推动).*哪件事/.test(question);
}

function hasRedundantHostOpening(opening) {
  const callerBeforeHost = [];
  for (const line of opening) {
    if (line.speaker === "你") {
      const prior = callerBeforeHost.join(" ");
      const host = line.text ?? "";
      if (/相亲认识/.test(prior) && /怎么认识/.test(host)) return true;
      if (/见父母/.test(prior) && /是不是.*见父母/.test(host)) return true;
      return false;
    }
    callerBeforeHost.push(line.text ?? "");
  }
  return false;
}

function hasOpeningTurnMismatch(opening) {
  for (let index = 0; index < opening.length - 1; index += 1) {
    const host = opening[index];
    const next = opening[index + 1];
    if (host.speaker !== "你" || next.speaker !== "咨询者") continue;
    if (hasTurnBridgeMismatch(host.text ?? "", next.text ?? "", opening.slice(0, index).map((line) => line.text).join(" "))) return true;
  }
  return false;
}

function buildWalkthroughs(flow) {
  const prefix = flow.opening.map((line) => ({ speaker: line.speaker, text: line.text, source: line.id }));
  const walkthroughs = [];
  flow.scenes.forEach((scene) => {
    scene.options.forEach((option) => {
      walkthroughs.push({
        id: `${scene.id}/${option.id}`,
        lines: [
          ...prefix,
          { speaker: scene.speaker, text: scene.text, source: scene.id },
          { speaker: "你", text: option.question, source: option.id },
          { speaker: "咨询者", text: option.answer, source: option.id }
        ]
      });
    });
  });
  flow.testimony.forEach((item) => {
    item.followups.forEach((followup) => {
      walkthroughs.push({
        id: `${item.id}/${followup.id}`,
        lines: [
          ...prefix,
          { speaker: item.speaker, text: item.text, source: item.id },
          { speaker: "你", text: followup.question, source: followup.id },
          { speaker: "咨询者", text: followup.result, source: followup.id }
        ]
      });
    });
  });
  return walkthroughs;
}

function validateWalkthrough(walkthrough) {
  const issues = [];
  const text = walkthrough.lines.map((line) => line.text).join(" ");
  if (/undefined|null|暂无/.test(text)) {
    issues.push({ code: "BROKEN_TEXT", message: "串读文本里出现占位或空文本。" });
  }
  for (let index = 0; index < walkthrough.lines.length - 1; index += 1) {
    const current = walkthrough.lines[index];
    const next = walkthrough.lines[index + 1];
    if (current.speaker !== "你" || next.speaker !== "咨询者") continue;
    const prior = walkthrough.lines.slice(0, index).map((line) => line.text).join(" ");
    if (hasTurnBridgeMismatch(current.text, next.text, prior)) {
      issues.push({ code: "TURN_BRIDGE", message: `问句和回答没有接上：你「${current.text}」/ 咨询者「${next.text}」` });
    }
  }
  return issues;
}

function hasTurnBridgeMismatch(question, answer, priorText = "") {
  const q = String(question ?? "");
  const a = String(answer ?? "");
  const prior = String(priorText ?? "");
  if (/怎么介绍.*条件/.test(q) && /听说以后|第二天主动发/.test(a)) return true;
  if (/具体问了什么|怎么跟他说/.test(q) && !/我.*跟他说|我妈.*问|想确认|转述/.test(a)) return true;
  if (/发.*图|截图/.test(a) && /听说以后|第二天/.test(a) && !/(跟他说|告诉|转述|想确认|问了|多问)/.test(`${prior} ${a}`)) return true;
  if (/为什么.*发|发.*为什么/.test(q) && !/因为|想|说|为了|怕|不想/.test(a)) return true;
  if (/谁.*放心|说服谁/.test(q) && !/我|爸妈|父母|家里|妈妈|TA|对方|他/.test(a)) return true;
  if (!/为什么/.test(q) && /少了哪|哪一边|补全|边上/.test(q) && !/学制|合同|主体|收入|绩效|右边|下面|完整|边/.test(a)) return true;
  return false;
}

function revealsFinalAnswerTooEarly(text) {
  return /答案是|幕后黑手|就是骗|明显骗|一定是|已经构成|关系层|结构层|关键矛盾是/.test(text);
}

function hasQuestionPathToContradiction(questions, answers, sceneText) {
  const combined = `${questions} ${answers} ${sceneText}`;
  return /为什么|哪|怎么|原话|补全|之前|以后|时间|谁|钱|图|账|发来|推进|算什么|见父母|饭局|还贷|责任|目的/.test(combined);
}

function testimonyReferencesScene(testimonyText, sceneText, answers) {
  const source = `${sceneText} ${answers}`;
  const tokens = importantTokens(source);
  if (!tokens.length) return true;
  const hitCount = tokens.filter((token) => testimonyText.includes(token)).length;
  return hitCount >= Math.min(2, tokens.length);
}

function recapUsesFoundLogic(flow) {
  const recap = `${flow.stageJudgement} ${flow.followupTwist} ${flow.truth}`;
  const source = `${flow.scenes.map((scene) => `${scene.contradiction} ${scene.options.map((option) => option.answer).join(" ")}`).join(" ")} ${flow.testimony.map((item) => item.followups.map((followup) => followup.result).join(" ")).join(" ")}`;
  const tokens = importantTokens(source);
  if (!tokens.length) return true;
  const hitCount = tokens.filter((token) => recap.includes(token)).length;
  return hitCount >= Math.min(2, tokens.length);
}

function importantTokens(text) {
  const matches = String(text).match(/见父母|截图|饭局|信用卡|社保|断缴|还款|债务|房本|产权|还贷|共同账户|协议|补偿|排班表|备注|投店|带客|专属|学制|合同主体|收入|父母|好印象|好感|周转|分期|包装|裁切|先过这一关|完整信息|匹配判断/g);
  return [...new Set(matches ?? [])];
}

function hasPreachyCopy(text) {
  return /你需要|你必须|本课|教学|技巧|法条|法律建议|心理诊断|正确答案|标准答案/.test(text);
}

function hasGenericDebugCopy(text) {
  return /内容提示|资料真伪核验|身份｜学历｜时间线|财务专长|后台资料|手边资料：还没拿|第 \d+\/\d+ 段材料/.test(text);
}

function hasCallerPerspectiveLeak(text) {
  return /她开始|她停|她低声|她一张张|咨询者\s+顺着|咨询者\s+开始|对方顺着/.test(text);
}

function hasRealNpcName(text) {
  const names = NPCS.map((npc) => npc.name).filter(Boolean);
  return new RegExp(names.join("|")).test(text);
}

function renderReport(entries) {
  const totalIssues = entries.reduce((sum, entry) => sum + entry.issues.length, 0);
  const lines = [
    "# Narrative Flow Validation Report",
    "",
    `Generated at: ${new Date().toISOString()}`,
    `Cases checked: ${entries.length}`,
    `Issues: ${totalIssues}`,
    "",
    "## Summary",
    "",
    ...entries.map((entry) => `- ${entry.flow.key} ${entry.flow.label} (${entry.flow.plotId}): ${entry.issues.length ? `${entry.issues.length} issue(s)` : "pass"}`),
    ""
  ];
  entries.forEach((entry) => {
    lines.push(`## ${entry.flow.key}｜${entry.flow.label}｜${entry.flow.plotId}`);
    lines.push("");
    lines.push(`- stance: ${entry.flow.stance}`);
    lines.push(`- expected: ${entry.flow.expected}`);
    lines.push("");
    if (entry.issues.length) {
      lines.push("### Issues");
      entry.issues.forEach((issue) => lines.push(`- **${issue.code}** ${issue.message}`));
      lines.push("");
    }
    lines.push("### Extracted Flow");
    lines.push("");
    lines.push("Opening:");
    entry.flow.opening.forEach((line) => lines.push(`- ${line.speaker}: ${line.text}`));
    lines.push("");
    entry.flow.scenes.forEach((scene) => {
      lines.push(`${scene.id}: ${scene.speaker}: ${scene.text}`);
      lines.push(`- doubt: ${scene.doubt}`);
      lines.push(`- contradiction: ${scene.contradiction}`);
      scene.options.forEach((option) => {
        lines.push(`- Q${option.id.split("-q")[1]} ${option.correct ? "useful" : "detour"}: ${option.question}`);
        lines.push(`  - feedback: ${option.answer}`);
      });
      lines.push("");
    });
    lines.push("Testimony:");
    entry.flow.testimony.forEach((item) => {
      lines.push(`- ${item.speaker}: ${item.text}`);
      item.followups.forEach((followup) => {
        lines.push(`  - ${followup.correct ? "useful" : "detour"}: ${followup.question}`);
        lines.push(`    - result: ${followup.result}`);
      });
    });
    lines.push("");
    lines.push("### Branch Walkthroughs");
    buildWalkthroughs(entry.flow).forEach((walkthrough) => {
      lines.push("");
      lines.push(`${walkthrough.id}:`);
      walkthrough.lines.forEach((line) => {
        lines.push(`- ${line.speaker}: ${line.text}`);
      });
    });
    lines.push("");
    lines.push(`Recap: ${entry.flow.stageJudgement} ${entry.flow.followupTwist} ${entry.flow.truth}`.trim());
    lines.push("");
  });
  return lines.join("\n");
}

const entries = keys.map((key) => {
  const flow = extractFlow(generateBrief(key), key);
  return { flow, issues: validateFlow(flow) };
});

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, renderReport(entries));

const failed = entries.filter((entry) => entry.issues.length);
if (failed.length) {
  failed.forEach((entry) => {
    console.error(`✗ ${entry.flow.key} ${entry.flow.label} (${entry.flow.plotId})`);
    entry.issues.forEach((issue) => console.error(`  - ${issue.code}: ${issue.message}`));
  });
  console.error(`Narrative flow report written to ${reportPath}`);
  process.exit(1);
}

entries.forEach((entry) => console.log(`✓ ${entry.flow.key} ${entry.flow.label} (${entry.flow.plotId})`));
console.log(`narrative flow validation passed: ${entries.length} cases`);
console.log(`Narrative flow report written to ${reportPath}`);
