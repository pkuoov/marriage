import { dailyAccusationChoices } from "../dailyChoices.js?v=0.20.68";
import { truthBoundaryPromptLimitForCase } from "../difficulty.js?v=0.20.68";
import { expectedAccusationForCase } from "../caseRuntime.js?v=0.20.68";
import { routeAxisLabel } from "./routeLog.js?v=0.20.68";

const TRUTH_BOUNDARY_PROMPT_LIMIT = 5;

export function issueLine(issue = {}) {
  if (issue.badge) return "该问的几句都问到了，弹幕要吵也只能换个吵法。";
  if (issue.percent >= 75) return "开场那套说法已经站不稳了，还差一两句没问穿。";
  if (issue.percent >= 50) return "有几处不对劲已经露出来了，后半截还压着。";
  if (issue.percent > 0) return "你抓到了一处别扭，麦里还有话没出来。";
  return "这轮还停在表层，别扭的地方没露头。";
}

export function issueResultLine(issue = {}) {
  if (issue.badge) return "这边可以挂麦，剩下的交给弹幕吵。";
  if (issue.percent >= 75) return "主要几句已经翻出来了，边角还会被继续追。";
  if (issue.percent >= 50) return "这段有几处别扭浮上来了，适合发给朋友一起吵。";
  if (issue.percent > 0) return "你听出了一处不对，麦里还有话没出来。";
  return "像是只听了个开头，后面的东西还压着。";
}

export function recapRankLabel(issue = {}) {
  if (issue.badge) return "能挂麦";
  if (issue.percent >= 75) return "差一句";
  if (issue.percent >= 50) return "问到一半";
  if (issue.percent > 0) return "抓到一处";
  return "刚开口";
}

export function dailyRouteProfile(brief = {}, result = {}, { issue = {}, axisProfile = {} } = {}) {
  const percent = Number(result.issuePercent ?? issue.percent ?? 0);
  const quoteHit = Boolean(result.quoteHit);
  const routeLabel = percent >= 100 && quoteHit
    ? "收得住"
    : percent >= 100 ? "问到底" : percent >= 75 ? "差一句" : percent >= 50 ? "问到一半" : "刚开口";
  const playerType = dailyPlayerType({ percent, quoteHit, accused: result.accused, axis: axisProfile.axis });
  const picked = result.dailyAccuseLabel ? `你最后接住了${result.dailyAccuseLabel}。` : "";
  const firstReveal = result.issueRevealed?.[0] ? `你先接住的是：${result.issueRevealed[0]}。` : "";
  return {
    label: routeLabel,
    playerType,
    shareTitle: brief.dailyShareTitle ?? "今日来电有点东西",
    shareBody: firstReveal || picked || brief.dailyShareBody || "我听到了那句没说完的话。",
    shareQuestion: brief.dailyShareQuestion ?? "你会从哪一句开始追？"
  };
}

export function dailyPlayerType({ percent, quoteHit, accused, axis } = {}) {
  if (percent >= 100 && quoteHit) return "收麦很准";
  if (percent >= 75 && axis === "caller-credibility") return "反向追问主播";
  if (percent >= 75 && axis === "document-edge") return "截图拆边主播";
  if (percent >= 75 && axis === "money-flow") return "钱流雷达主播";
  if (percent >= 100) return "会听但爱绕";
  if (percent >= 75) return "差一句主播";
  if (percent >= 50 && accused === "both") return "灰区雷达";
  if (percent >= 50) return "听到一半";
  if (percent > 0) return "抓到一处";
  return "弹幕带跑型";
}

export function finalQuoteComparison(brief = {}, result = {}) {
  const choices = dailyAccusationChoices(brief);
  const expected = expectedAccusationForCase(brief);
  const best = choices.find((choice) => choice.accuse === expected) ?? choices.find((choice) => choice.accuse === "both") ?? choices[0];
  if (!best) return null;
  const pickedLabel = result.dailyAccuseLabel ?? "";
  const sameQuote = pickedLabel === best.label;
  return {
    pickedLabel: pickedLabel || "还没选最后那句",
    pickedResponse: result.dailyResponse ?? "",
    bestLabel: best.label,
    bestResponse: best.response ?? "",
    sameQuote
  };
}

export function dailyConclusionModel(brief = {}, result = {}, issue = {}, { pickedQuestions = [], deepFollowup = null } = {}) {
  void result;
  const deep = issue.badge ? deepFollowup : null;

  if (issue.badge && brief.conclusionWhenCleared) {
    return {
      ...brief.conclusionWhenCleared,
      deepQuestion: deep?.question ?? brief.conclusionWhenCleared.deepQuestion ?? ""
    };
  }

  const branch = conclusionBranchFor(brief, pickedQuestions);
  if (branch) {
    return {
      summary: branch.summary ?? "",
      deepQuestion: branch.deepQuestion ?? "",
      followup: branch.followup ?? "",
      truth: branch.truth ?? brief.truth ?? ""
    };
  }

  if (issue.badge) {
    return {
      summary: brief.stageJudgement ?? "这一轮几个别扭点都问到了。",
      deepQuestion: deep?.question ?? "",
      followup: brief.followupTwist ?? "后续回拨里，咨询者愿意把刚才没说出口的部分补上。",
      truth: brief.truth ?? "别急着站一边，先把双方没说全的地方补齐。"
    };
  }

  return {
    summary: issue.revealed?.length ? `这轮摆到台面上的是：${issue.revealed.join(" / ")}。` : "这一轮听到了委屈，别扭的地方还没上桌。",
    deepQuestion: "",
    followup: issue.revealed?.length ? "后续回拨里，话还没完，评论区会继续抓着没说出口的地方吵。" : brief.followupTwist ?? "",
    truth: brief.truth ?? "这案不能只按第一印象走，得看每个人少说了哪半截。"
  };
}

export function conclusionBranchFor(brief = {}, pickedQuestions = []) {
  const text = pickedQuestions.join(" ");
  return (brief.conclusionBranches ?? []).find((branch) => {
    const pattern = branch.match ?? branch.pattern ?? "";
    if (!pattern) return false;
    try {
      return new RegExp(pattern).test(text);
    } catch {
      return text.includes(pattern);
    }
  }) ?? null;
}

export function truthBoundaryReview(brief = {}) {
  const boundary = brief.truthBoundary ?? {};
  const columns = [
    { key: "true", label: "能确认", items: cleanBoundaryItems(boundary.true) },
    { key: "edited", label: "被修剪", items: cleanBoundaryItems(boundary.edited) },
    { key: "unknown", label: "今晚定不了", items: cleanBoundaryItems(boundary.unknown) }
  ].filter((column) => column.items.length);
  const prompts = boundaryPrompts(columns, truthBoundaryPromptLimitForCase(brief, TRUTH_BOUNDARY_PROMPT_LIMIT));
  return {
    title: "事实边界",
    line: columns.length
      ? "这几句话，哪句能落，哪句还缺半边。"
      : "这通还没留下足够边界。",
    columns,
    prompts,
    choices: columns.map(({ key, label }) => ({ key, label }))
  };
}

function boundaryPrompts(columns = [], limit = TRUTH_BOUNDARY_PROMPT_LIMIT) {
  const prompts = [];
  const maxItems = Math.max(0, ...columns.map((column) => column.items.length));
  for (let itemIndex = 0; itemIndex < maxItems && prompts.length < limit; itemIndex += 1) {
    for (const column of columns) {
      const text = column.items[itemIndex];
      if (!text) continue;
      prompts.push({
        id: `${column.key}:${itemIndex}`,
        expected: column.key,
        label: column.label,
        text
      });
      if (prompts.length >= limit) break;
    }
  }
  return prompts;
}

export function truthBoundaryAftertaste(review = {}, picks = {}, misses = {}) {
  if (!(review.prompts ?? []).length) return "";
  const prompts = review.prompts ?? [];
  const placed = prompts.filter((prompt) => picks[prompt.id]);
  const wrong = prompts.filter((prompt) => picks[prompt.id] && picks[prompt.id] !== prompt.expected).length;
  const totalMisses = Math.max(wrong, prompts.reduce((sum, prompt) => sum + Number(misses[prompt.id] ?? 0), 0));
  const settled = prompts.every((prompt) => picks[prompt.id] === prompt.expected);
  if (placed.length < prompts.length) return "还有话没归位，先别急着收。";
  if (!settled) return totalMisses > 1 ? "有几句还撑不住，今晚不能这么定。" : "有句还悬着，先别替人把话补上。";
  return "这几句能说清：有证据的放住，没证据的先空着。";
}

export function truthBoundaryPackProfile(rows = []) {
  const items = rows
    .map((row) => {
      const prompts = row.review?.prompts ?? [];
      const placedCount = prompts.filter((prompt) => row.picks?.[prompt.id]).length;
      const wrongCount = prompts.filter((prompt) => row.picks?.[prompt.id] && row.picks[prompt.id] !== prompt.expected).length;
      const settled = prompts.length > 0 && prompts.every((prompt) => row.picks?.[prompt.id] === prompt.expected);
      const misses = Math.max(wrongCount, prompts.reduce((sum, prompt) => sum + Number(row.misses?.[prompt.id] ?? 0), 0));
      return {
        label: row.label ?? "",
        promptCount: prompts.length,
        placedCount,
        settled,
        misses
      };
    })
    .filter((item) => item.promptCount > 0);
  const total = items.length;
  const settledCount = items.filter((item) => item.settled).length;
  const missCount = items.reduce((sum, item) => sum + item.misses, 0);
  const unsettled = items.filter((item) => !item.settled);
  return {
    total,
    settledCount,
    missCount,
    unsettledLabel: unsettled[0]?.label ?? "",
    label: boundaryPackLabel({ total, settledCount, missCount }),
    line: boundaryPackLine({ total, settledCount, missCount, unsettledLabel: unsettled[0]?.label ?? "" }),
    comment: boundaryPackComment({ total, settledCount, missCount, unsettledLabel: unsettled[0]?.label ?? "" })
  };
}

export function storyMaterialProfile(rows = []) {
  const items = rows.map((row) => ({
    label: row.label ?? "",
    picks: Array.isArray(row.picks) ? row.picks.filter(Boolean) : []
  }));
  const picks = items.flatMap((item) => item.picks.map((pick) => ({ ...pick, caseLabel: item.label })));
  const total = picks.length;
  const hits = picks.filter((pick) => pick.correct).length;
  const misses = picks.filter((pick) => pick.correct === false).length;
  const firstMiss = picks.find((pick) => pick.correct === false);
  return {
    total,
    hits,
    misses,
    label: materialPackLabel({ total, hits, misses }),
    line: materialPackLine({ total, hits, misses, firstMiss }),
    comment: materialPackComment({ total, hits, misses })
  };
}

export function storyQuoteProfile(results = []) {
  const items = (Array.isArray(results) ? results : []).filter(Boolean);
  const total = items.length;
  const hits = items.filter((item) => item.quoteHit).length;
  const picked = items.filter((item) => item.dailyAccuseLabel && item.dailyAccuseLabel !== "还没选最后那句").length;
  return {
    total,
    hits,
    picked,
    label: quotePackLabel({ total, hits, picked }),
    line: quotePackLine({ total, hits, picked }),
    comment: quotePackComment({ total, hits, picked })
  };
}

export function storyObjectProfile(briefs = []) {
  const objects = (Array.isArray(briefs) ? briefs : [])
    .map((brief) => brief?.storyObjectLabel ?? brief?.weeklyObjectLabel ?? brief?.storyClueObject ?? brief?.clueObject ?? "")
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  const unique = [...new Set(objects)];
  const objectText = unique.slice(0, 4).join("、");
  return {
    total: unique.length,
    objects: unique,
    label: unique.length ? "物件串起来了" : "物件没落地",
    line: unique.length
      ? `这一晚翻过的不是目录，是${objectText}。每件东西都有人想让它只证明对自己有利的那半句。`
      : "今晚没有留下能串起故事包的物件。",
    comment: unique.length
      ? `「${objectText}放一起看，比单听谁委屈更有意思。」`
      : ""
  };
}

export function storyThemeProfile(briefs = []) {
  const first = briefs.find(Boolean) ?? {};
  return {
    title: first.storyThemeTitle ?? first.weeklyThemeTitle ?? "今晚收麦",
    thesis: first.storyThemeThesis ?? first.weeklyThemeThesis ?? "几通来电听完，别只听谁声音大，要看最后谁被叫去买单。",
    commentPrompt: first.storyThemeCommentPrompt ?? first.weeklyThemeCommentPrompt ?? "评论区吵到后半夜，吵的都是每个人没说完的半句。",
    hiddenThread: first.storyHiddenThread ?? first.weeklyHiddenThread ?? null,
    commentSeeds: Array.isArray(first.storyCommentSeeds) ? first.storyCommentSeeds : [],
    lowRevealTone: first.storyLowRevealTone ?? "",
    highRevealTone: first.storyHighRevealTone ?? ""
  };
}

export function storyHiddenThreadProfile({ theme = {}, avgPercent = 0, objectProfile = {} } = {}) {
  const thread = theme.hiddenThread;
  const beats = (Array.isArray(thread?.beats) ? thread.beats : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  if (!thread?.title && !thread?.reveal && beats.length === 0) {
    return { total: 0, label: "", title: "", line: "", beats: [], comment: "" };
  }
  const revealed = Number(avgPercent ?? 0) >= 65 || Number(objectProfile.total ?? 0) >= 4;
  return {
    total: beats.length || 1,
    title: thread.title ?? "今晚暗线",
    label: revealed ? thread.label ?? "暗线露头" : "暗线没收全",
    line: revealed ? thread.reveal ?? "" : thread.lowReveal ?? thread.reveal ?? "",
    beats,
    comment: thread.comment ?? ""
  };
}

export function storyPackAxes(routeProfiles = []) {
  const counts = {};
  routeProfiles.forEach((route = {}) => {
    const axis = route.axis ?? "live-instinct";
    counts[axis] = Number(counts[axis] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([axis, count]) => ({ axis, count, label: routeAxisLabel(axis) }))
    .sort((a, b) => b.count - a.count);
}

export function storyPackBestAxis(avgPercent = 0, axes = []) {
  const best = axes[0] ?? { axis: "live-instinct", label: "现场听感线", count: 0 };
  if (Number(avgPercent) < 40) return { axis: "live-instinct", count: best.count, label: "外围听感线" };
  return best;
}

export function storyPlayerType(avgPercent, best = {}) {
  if (avgPercent >= 90 && best.axis === "caller-credibility") return "反向追问型主播";
  if (avgPercent >= 90) return "收麦很稳的主播";
  if (avgPercent < 40) return "外围听感主播";
  if (avgPercent < 65) return "现场反应型主播";
  if (best.axis === "money-flow") return "钱流雷达主播";
  if (best.axis === "document-edge") return "截图拆边主播";
  if (best.axis === "process-control") return "入口控制型主播";
  return "稳扎稳打型主播";
}

export function storyShareTitle(avgPercent, best = {}) {
  if (avgPercent >= 90) return "今晚几路麦，基本都被我问到硬处了。";
  if (avgPercent < 40) return "今晚几路麦，我听到的是表层那阵吵。";
  if (avgPercent < 65) return "这集问出几处别扭，但最要紧的话还没出来。";
  if (best.axis === "caller-credibility") return "我这一集最常回头问来电人：你自己还有哪句没说？";
  return `我这一集最常盯${best.label}，几路麦越听越不一样。`;
}

export function storyPackAftertaste(avgPercent, caseCount = 0) {
  const callText = storyCallCountText(caseCount);
  if (avgPercent >= 90) return `${callText}都压到了后半句。`;
  if (avgPercent < 40) return "今晚麦里热，话却没完全落地。";
  if (avgPercent < 65) return "有几句话浮上来了。";
  return "几条线都露了头。";
}

export function storyPackClosingLine(avgPercent, best = {}, caseCount = 0) {
  const callText = storyCallCountText(caseCount);
  if (avgPercent >= 90) return `这晚问得紧，${callText}里那些省掉的钱、边界和责任都露了面。`;
  if (avgPercent < 40) return "这晚你更多接住的是现场情绪，几路麦省掉的那半句还压在里面。";
  if (best.axis === "document-edge") return "你这一晚总爱回头看图，看截图里少了哪一页、哪一边。";
  if (best.axis === "money-flow") return "你这一晚总盯钱最后落到谁身上。";
  return "这晚有几处接住了，也有几句还卡在原话里。";
}

export function storyCallCountText(caseCount = 0) {
  const count = Math.max(0, Math.floor(Number(caseCount) || 0));
  if (count <= 0) return "这几路麦";
  if (count === 1) return "这一路麦";
  return `这 ${count} 路麦`;
}

export function storyCommentWall({
  briefs = [],
  results = [],
  routes = [],
  best = {},
  avgPercent = 0,
  theme = storyThemeProfile(briefs),
  boundaryProfile = {},
  pressureProfile = {},
  materialProfile = {},
  quoteProfile = {},
  objectProfile = storyObjectProfile(briefs),
  hiddenThreadProfile = storyHiddenThreadProfile({ theme, avgPercent, objectProfile })
} = {}) {
  const rows = briefs.map((brief, index) => {
    const result = results[index] ?? {};
    const route = routes[index] ?? {};
    return { brief, result, route };
  });
  const strongest = [...rows].sort((a, b) => Number(b.result.issuePercent ?? 0) - Number(a.result.issuePercent ?? 0))[0];
  const weakest = [...rows].sort((a, b) => Number(a.result.issuePercent ?? 0) - Number(b.result.issuePercent ?? 0))[0];
  const strongestPercent = Number(strongest?.result.issuePercent ?? 0);
  const seededComments = cleanCommentSeeds(theme.commentSeeds);
  const comments = [
    `「${theme.commentPrompt}」`
  ];
  if (seededComments[0]) comments.push(wrapComment(seededComments[0]));
  comments.push(avgPercent < 40
    ? wrapComment(theme.lowRevealTone || "主播今晚更像在压场，几路麦都还没露到底。")
    : wrapComment(theme.highRevealTone || `主播今晚老往${best.label}上拽，不是站队，是看谁最后接了成本。`));
  if (seededComments.length) {
    comments.push(...seededComments.slice(1).map(wrapComment));
  }
  if (comments.length < 4 && strongest?.brief && strongestPercent > 0) {
    comments.push(`「${strongest.brief.label}那路问得最稳，${strongest.route.label}一出来，前面那些好听话就变味了。」`);
  } else if (comments.length < 4) {
    comments.push("「今晚热闹是真的，材料、钱和责任那几条线还压着。」");
  }
  if (comments.length < 4 && avgPercent < 40) {
    comments.push("「这不是站队，今晚几路麦都留了半句话。」");
  } else if (comments.length < 4 && weakest?.brief && Number(weakest.result.issuePercent ?? 0) < 100) {
    comments.push(`「${weakest.brief.label}还差一点，没问到的那半句才是评论区会继续吵的地方。」`);
  } else if (comments.length < 4 && avgPercent >= 90) {
    comments.push(boundaryProfile.comment || "「这几路都问到硬处了，不靠吼，靠把原话顶回去。」");
  } else if (comments.length < 4) {
    comments.push(boundaryProfile.comment || "「好看在它没急着判好坏，谁少说了话、谁转了成本，都得一条条摊开。」");
  }
  replaceOrAppendComment(comments, boundaryProfile.comment, 3);
  replaceOrAppendComment(comments, pressureProfile.comment, 2);
  [materialProfile.comment, quoteProfile.comment].filter(Boolean).forEach((comment, index) => {
    replaceOrAppendComment(comments, comment, Math.min(3, index + 2));
  });
  appendCommentIfRoom(comments, objectProfile.comment);
  appendCommentIfRoom(comments, hiddenThreadProfile.comment);
  return comments.slice(0, 4);
}

function cleanCommentSeeds(seeds = []) {
  return (Array.isArray(seeds) ? seeds : [])
    .map((seed) => String(seed ?? "").trim())
    .filter(Boolean);
}

function wrapComment(text = "") {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return "";
  if (/^「.*」$/.test(trimmed)) return trimmed;
  return `「${trimmed}」`;
}

export function investigationBackflowProfile(picks = []) {
  const items = (Array.isArray(picks) ? picks : []).filter(Boolean);
  const total = items.length;
  const hits = items.filter((pick) => pick.correct).length;
  const misses = items.filter((pick) => pick.correct === false).length;
  return {
    total,
    hits,
    misses,
    label: backflowLabel({ total, hits, misses }),
    line: backflowLine({ total, hits, misses }),
    reaction: backflowReaction({ total, hits, misses })
  };
}

export function investigationPickReaction(outcome = {}, hook = {}) {
  void hook;
  if (outcome.correct) {
    return "";
  }
  if (/截图|图|表|账/.test(outcome.pick?.label ?? "")) return "这一块圈偏了，弹幕又吵到旁边去了。";
  return "这一下圈偏了，评论区开始翻另一边。";
}

function materialPackLabel({ total, hits, misses }) {
  if (!total) return "没看材料";
  if (hits > 0 && misses === 0) return "圈得准";
  if (hits >= misses && hits > 0) return "圈回来了";
  if (misses > 0) return "圈偏过";
  return "材料没落地";
}

function materialPackLine({ total, hits, misses, firstMiss }) {
  if (!total) return "今晚没有留下能被圈住的材料动作。";
  if (hits > 0 && misses === 0) return `${hits} 处材料都圈在要害上，几通麦没有只靠听感往前冲。`;
  if (hits >= misses && hits > 0) return `${hits} 处圈住了，${misses} 处跑偏过，材料最后还是把话拉回台面。`;
  if (misses > 0) return `${firstMiss?.caseLabel || "有一通"}那块材料圈偏过，弹幕会抓着这一下继续吵。`;
  return "材料看过了，但还没圈到本案缺口。";
}

function materialPackComment({ total, hits, misses }) {
  if (!total) return "「今晚像是只听电话，后台材料没真用起来。」";
  if (hits > 0 && misses === 0) return "「材料圈得准，比空口判断有劲。」";
  if (hits >= misses && hits > 0) return "「有几下圈偏了，但后面还是靠材料拉回来了。」";
  return "「材料还没圈准，现场那股热闹盖过了图上的缺口。」";
}

function quotePackLabel({ total, hits, picked }) {
  if (!picked) return "没收住";
  if (hits === total && total > 0) return "原话收住";
  if (hits > 0) return "接住几句";
  return "口子偏了";
}

function quotePackLine({ total, hits, picked }) {
  if (!picked) return "今晚还没留下能被观众记住的收麦原话。";
  if (hits === total && total > 0) return "几通麦最后都接在原话上，收麦没有变成立场宣告。";
  if (hits > 0) return `${hits} 句原话接准了，剩下几句更像换了个角度收尾。`;
  return "原话都接了，但没有完全接到最能让现场停下来的那一句。";
}

function quotePackComment({ total, hits, picked }) {
  if (!picked) return "「没选原话就挂麦，总觉得少了一口气。」";
  if (hits === total && total > 0) return "「最后都接原话，这比直接讲道理好看。」";
  if (hits > 0) return "「有几句收得准，有几句还能再换个口子。」";
  return "「话都听到了，但最后接哪句还差点意思。」";
}

function replaceOrAppendComment(comments, comment, preferredIndex) {
  if (!comment || comments.includes(comment)) return;
  if (comments.length >= 4) {
    comments[preferredIndex] = comment;
  } else {
    comments.push(comment);
  }
}

function appendCommentIfRoom(comments, comment) {
  if (!comment || comments.includes(comment) || comments.length >= 4) return;
  comments.push(comment);
}

function backflowLabel({ total, hits, misses }) {
  if (!total) return "未回流";
  if (hits > 0 && misses === 0) return "私信补上";
  if (hits > 0) return "补回来了";
  return "被带偏";
}

function backflowLine({ total, hits, misses }) {
  if (!total) return "";
  if (hits > 0 && misses === 0) return "后台补来的那页，把刚才麦里的缺口又钉了一下。";
  if (hits > 0) return "私信里有噪音，也有一块补上了前面的矛盾。";
  return "后台那页没圈到要害，弹幕又把话题带回了表面。";
}

function backflowReaction({ total, hits, misses }) {
  if (!total) return "";
  if (hits > 0 && misses === 0) return "弹幕有人把前面那句重新翻出来。";
  if (hits > 0) return "弹幕先跑偏了一下，又被那块缺口拉回来。";
  return "弹幕吵得更散，刚才那通麦没完全落地。";
}

function boundaryPackLabel({ total, settledCount, missCount }) {
  if (!total) return "边界未开";
  if (missCount > 0 && settledCount < total) return "定急了";
  if (settledCount < total) return "还压着";
  if (missCount > 0) return "收回来了";
  return "挂得住";
}

function boundaryPackLine({ total, settledCount, missCount, unsettledLabel }) {
  if (!total) return "今晚没有留下可回看的事实边界。";
  if (missCount > 0 && settledCount < total) return `${unsettledLabel || "有一通"}有几句还撑不住，证据到不了那里。`;
  if (settledCount < total) return `${unsettledLabel || "有一通"}还有几句没归位，评论区还会继续吵。`;
  if (missCount > 0) return "有几句一开始放偏了，最后还是收回到证据能撑住的位置。";
  return "该钉的钉了，定不了的没替人补完。";
}

function boundaryPackComment({ total, settledCount, missCount, unsettledLabel }) {
  if (!total) return "「今晚没留下几句能复盘的边界，像听了个热闹。」";
  if (missCount > 0 && settledCount < total) return `「${unsettledLabel || "有一通"}那几句说满了，问题不是不敢判，是证据没到。」`;
  if (settledCount < total) return `「${unsettledLabel || "有一通"}那几句话还没摆平，现在替谁下句号都早。」`;
  if (missCount > 0) return "「刚才有几句差点说满了，收回来那一下才像主播。」";
  return "「该钉的钉了，钉不住的没硬钉，这集才挂得住。」";
}

function cleanBoundaryItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, 3);
}
