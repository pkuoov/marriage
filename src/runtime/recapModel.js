import { dailyAccusationChoices } from "../dailyChoices.js?v=0.20.55";
import { expectedAccusationForCase } from "../caseRuntime.js?v=0.20.55";

export function issueLine(issue = {}) {
  if (issue.badge) return "该问的几句都问到了，弹幕要吵也只能换个吵法。";
  if (issue.percent >= 75) return "开场那套说法已经站不稳了，还差一两句没问穿。";
  if (issue.percent >= 50) return "有几处不对劲已经露出来了，后半截还压着。";
  if (issue.percent > 0) return "你抓到了一处别扭，麦里还有话没出来。";
  return "这轮还停在表层，真正别扭的地方没露头。";
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
  if (brief.plotId === "education-income-fake-profile") {
    return {
      label: routeLabel,
      playerType,
      shareTitle: "存款证明都发了，怎么反而更怪？",
      shareBody: firstReveal || picked || "他不是全假，她也不是只想求安心，流水后面还藏着工资怎么管。",
      shareQuestion: "你听完会觉得是包装，是筛选，还是两边都在试探婚后的钱？"
    };
  }
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

export function truthBoundaryReview(brief = {}) {
  const boundary = brief.truthBoundary ?? {};
  const columns = [
    { key: "true", label: "能确认", items: cleanBoundaryItems(boundary.true) },
    { key: "edited", label: "被修剪", items: cleanBoundaryItems(boundary.edited) },
    { key: "unknown", label: "今晚定不了", items: cleanBoundaryItems(boundary.unknown) }
  ].filter((column) => column.items.length);
  const prompts = columns
    .map((column) => ({
      id: `${column.key}:0`,
      expected: column.key,
      label: column.label,
      text: column.items[0] ?? ""
    }))
    .filter((prompt) => prompt.text);
  return {
    title: "事实边界",
    line: columns.length
      ? "能摊开的先摊开，没证据的别替任何人补完。"
      : "这通还没留下足够边界。",
    columns,
    prompts,
    choices: columns.map(({ key, label }) => ({ key, label }))
  };
}

export function truthBoundaryAftertaste(review = {}, picks = {}, misses = {}) {
  if (!(review.prompts ?? []).length) return "";
  const totalMisses = (review.prompts ?? []).reduce((sum, prompt) => sum + Number(misses[prompt.id] ?? 0), 0);
  const settled = (review.prompts ?? []).every((prompt) => picks[prompt.id] === prompt.expected);
  if (!settled) return "这几句还没放稳，收话先压一压。";
  if (totalMisses > 0) return "刚才有句差点放早了，收回来以后，这通才没变成替人判案。";
  return "这几句边界放稳了：能确认的钉住，定不了的不替人补。";
}

export function truthBoundaryPackProfile(rows = []) {
  const items = rows
    .map((row) => {
      const prompts = row.review?.prompts ?? [];
      const settled = prompts.length > 0 && prompts.every((prompt) => row.picks?.[prompt.id] === prompt.expected);
      const misses = prompts.reduce((sum, prompt) => sum + Number(row.misses?.[prompt.id] ?? 0), 0);
      return {
        label: row.label ?? "",
        promptCount: prompts.length,
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
  if (outcome.correct) {
    if (/私信|后台|补/.test(hook.surface ?? "")) return "后台这页咬住了，弹幕短暂安静。";
    return "这块圈住了，麦里的话往回收了一点。";
  }
  if (/截图|图|表|账/.test(outcome.pick?.label ?? "")) return "弹幕被这块带跑，麦温往下掉了一格。";
  return "这一下没咬住，评论区开始翻另一边。";
}

function backflowLabel({ total, hits, misses }) {
  if (!total) return "未回流";
  if (hits > 0 && misses === 0) return "私信咬住";
  if (hits > 0) return "补回来了";
  return "被带偏";
}

function backflowLine({ total, hits, misses }) {
  if (!total) return "";
  if (hits > 0 && misses === 0) return "后台补来的那页，把刚才麦里的缺口又钉了一下。";
  if (hits > 0) return "私信里有噪音，也有一块真正咬住了前面的矛盾。";
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
  if (settledCount < total) return "还压着";
  if (missCount > 0) return "收回来了";
  return "挂得住";
}

function boundaryPackLine({ total, settledCount, missCount, unsettledLabel }) {
  if (!total) return "今晚没有留下可回看的事实边界。";
  if (settledCount < total) return `${unsettledLabel || "有一通"}还有几句没归位，评论区会咬着不放。`;
  if (missCount > 0) return "有几句差点放早，最后还是收回到了证据能撑住的位置。";
  return "该钉的钉了，定不了的没替人补完。";
}

function boundaryPackComment({ total, settledCount, missCount, unsettledLabel }) {
  if (!total) return "「今晚没留下几句能复盘的边界，像听了个热闹。」";
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
