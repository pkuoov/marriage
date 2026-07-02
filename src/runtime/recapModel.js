import { dailyAccusationChoices } from "../dailyChoices.js?v=0.20.52";
import { expectedAccusationForCase } from "../caseRuntime.js?v=0.20.52";

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

function cleanBoundaryItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, 3);
}
