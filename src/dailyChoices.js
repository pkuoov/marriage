export function dailyAccusationChoices(brief) {
  const respondent = brief.respondentId;
  const complainant = brief.complainantId;
  if (brief.plotId === "lost-job-hidden-credit") {
    return [
      { label: "“我只是怕你知道我失业后就离开我。”", accuse: respondent, response: "怕你离开可以是真的，但最低还款为什么马上转到你这里？" },
      { label: "“我也怕别人觉得我找了个撑不住场面的人。”", accuse: complainant, response: "这句把她自己的面子也放进来了。她不是只被催债，也不想承认自己被体面吸引过。" },
      { label: "“账单其实还有三天才到期。”", accuse: "noPremeditated", response: "这句要停一下。说急了可能是慌，也可能是怕你有时间把账单看清楚。" },
      { label: "“以后他可能就不敢跟我谈结婚了。”", accuse: "both", response: "这句听着像怕丢脸，但一落到转钱，就不能只按感情话听了。" }
    ];
  }
  if (brief.plotId === "house-name-security-test") {
    return [
      { label: "“买受人写的是对方父母。”", accuse: respondent, response: "这句单独没问题，但旁边那张共同账户支出表要一起看。" },
      { label: "“最好能有个位置。”", accuse: complainant, response: "这句才是她开头没说出的愿望。说出来不等于抢房，藏起来会让投入确认听着像绕话。" },
      { label: "“正常夫妻不会算这么细。”", accuse: "noPremeditated", response: "夫妻可以不天天算小账，但房贷和装修不是小账。" },
      { label: "“不写才像一家人。”", accuse: "both", response: "越说像一家人，越别让一个人把钱打进去以后没名分。" }
    ];
  }
  if (brief.plotId === "tony-multi-dating") {
    return [
      { label: "“只有我能接住 TA 的情绪。”", accuse: respondent, response: "如果只对你一个人这么说，是暧昧；同样的话复制出去，味道就变了。" },
      { label: "“他说我像店里自己人。”", accuse: complainant, response: "这句要承认。她不是错在帮忙，是她也不想太早拆穿那个位置到底算不算关系。" },
      { label: "“我从来没说只有你一个。”", accuse: "noPremeditated", response: "他确实留了口子，但“老板娘”这种话也不是随便听听就算了。" },
      { label: "“以后店开起来，你就是老板娘。”", accuse: "both", response: "这句甜不甜先放一边，后面有没有接办卡、投店，才是关键。" }
    ];
  }
  if (brief.plotId === "education-income-fake-profile") {
    return [
      { label: "“他一直说名校毕业，细问才说是 MBA。”", accuse: respondent, response: "学校不是假的，但这句话让别人往更好听的方向理解了。" },
      { label: "“我只说他学校那边确实是真的。”", accuse: complainant, response: "你这句也没说全。前面话说满了，后面就很难自己拆台。" },
      { label: "“再问下去，是不是工资卡也要交出来？”", accuse: "both", response: "这句刺耳，但它碰到的不是学历，是婚后钱怎么管。" },
      { label: "“结婚以后钱最好放一起管。”", accuse: complainant, response: "这句才是流水后面那半句话。不是只验真假，是在试婚后钱归谁管。" }
    ];
  }
  if (brief.plotId === "workplace-reimbursement-screenshot") {
    return [
      { label: "“报销审批通过了。”", accuse: respondent, response: "这句只能证明审批到过那一步，不能证明钱已经打给谁。" },
      { label: "“我也确实想要这个主责。”", accuse: complainant, response: "这句要承认。她想要机会是真的，同事拿这个机会让她先刷卡也是真的。" },
      { label: "“返款统一打给对接人。”", accuse: "both", response: "这句和审批截图放一起看，钱为什么一直回不来就有方向了。" },
      { label: "“先私下把事办成，复盘再补流程。”", accuse: respondent, response: "这句是入口。流程先被挪到私下，后面截图再漂亮，也补不了垫款风险。" }
    ];
  }
  return [
    { label: "“对方这句话没说全。”", accuse: respondent, response: "先接这句，对方少说的半句最影响判断。" },
    { label: "“我这句话也没说全。”", accuse: complainant, response: "这句要留住，来电人的版本也可能只讲了对自己顺的那半截。" },
    { label: "“两边都有停顿。”", accuse: "both", response: "那今晚就别按一边倒收麦，两边没说完的地方都得摊开。" }
  ];
}
