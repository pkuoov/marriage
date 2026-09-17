// These patterns locate passages to read, not sentences to reject or rewrite.
// Deliberate jargon, parody and repetition can be the point of a scene.
const candidates = [
  { id: "declared-question", label: "问话前的说明", regex: /我现在想知道的是/, consider: "是否在重复已经清楚的问题？故意抢回话题时可以保留。" },
  { id: "abstract-summary", label: "抽象总结", regex: /本质上/, consider: "是否由作者代人物总结？角色装懂、引用或反串时可以保留。" },
  { id: "ranked-summary", label: "替听众排列重点", regex: /更重要的是/, consider: "是否机械升级论点？人物故意抬高自己的小事时可以保留。" },
  { id: "balanced-list", label: "整齐的双面论述", regex: /一方面.{0,36}另一方面/, consider: "是否人人都像写报告？人物打官腔或模仿他人时可以保留。" }
];

export function dialogueStyleCandidates(text) {
  return candidates.filter((rule) => rule.regex.test(text)).map(({ id, label, consider }) => ({ id, label, consider, severity: "review" }));
}
