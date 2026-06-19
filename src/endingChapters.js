import { CHAPTERS } from "./story.js?v=0.14.0";

export function chapter9Outcome(state) {
  const midlife = state.flags.midlifePressure ?? 0;
  const affection = state.flags.affection ?? 0;
  const boundary = state.flags.boundary ?? 0;
  const household = state.flags.householdPressure ?? 0;
  const suspicion = state.flags.suspicion ?? 0;

  if (affection >= 10 && boundary >= 18) {
    return "七年不是痒，是重新签一次生活合约。你们没有回到热恋，但学会了把疲惫说出来，而不是拿沉默互相惩罚。";
  }
  if (midlife >= 7 || household >= 9) {
    return "婚姻没有突然坏掉，它只是被每天一点点挤压。等你回头时，很多温柔已经变成了流程。";
  }
  if (suspicion >= 8) {
    return "第九章结束时，你们还共享一个家，却不再共享全部生活。很多问题开始等待一个更大的节点。";
  }
  return "第九章结束时，你们没有完美修复，也没有彻底散场。日子继续往前，像一台有杂音但仍在运转的机器。";
}

export function chapter10Outcome(state) {
  const education = state.flags.educationPressure ?? 0;
  const midlife = state.flags.midlifePressure ?? 0;
  const affection = state.flags.affection ?? 0;
  const boundary = state.flags.boundary ?? 0;
  const asset = state.flags.assetProtection ?? 0;

  if (affection >= 12 && boundary >= 20) {
    return "十年以后，你们没有成为完美夫妻，但成为了能一起处理问题的人。孩子上学那天，你终于感觉婚姻不是奖惩，而是一套被不断调试的生存系统。";
  }
  if (asset >= 10 && boundary >= 20) {
    return "十年以后，你保住了自己的边界和退路。关系未必体面圆满，但你没有把人生全部押在别人会变好这件事上。";
  }
  if (education >= 7 || midlife >= 9) {
    return "十年以后，孩子上学，婚姻也进入另一所学校。你们学会了如何安排孩子，却还没完全学会如何安放自己。";
  }
  return "十年以后，你站在校门口。人生不是通关，而是带着上一轮留下的经验，继续选择下一步怎么活。";
}

function bindChapter9Buttons(ctx) {
  document.querySelectorAll("[data-ch9]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch9.split(":");
      ctx.chapter9Choice(kind, value);
    });
  });
}

function bindChapter10Buttons(ctx) {
  document.querySelectorAll("[data-ch10]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch10.split(":");
      ctx.chapter10Choice(kind, value);
    });
  });
}

export function renderChapter9(ctx) {
  const { state, currentNpc, storyFrame, saveState, render, choiceBtn } = ctx;
  const npc = currentNpc();

  if (state.scene === "chapter9Start") {
    storyFrame({
      chapter: CHAPTERS[8].title,
      text: `
        <p>孩子两岁以后，日子不再像剧情，而像不断重复的任务栏。</p>
        <p>夜醒、发烧、请假、绩效、老人腰疼、房贷扣款。每件事都不致命，但每件事都要有人接住。</p>
        <p><b>${npc.name}</b>：“再忍忍，等孩子大一点就好了。”</p>
      `,
      choices: `
        ${choiceBtn('data-ch9="night:schedule"', '重做家庭排班，不再靠谁更能忍')}
        ${choiceBtn('data-ch9="night:endure"', '先熬过去，孩子小都这样')}
        ${choiceBtn('data-ch9="night:outsource"', '托育、保洁、临时看护，能买服务就买', { wealth: 6 })}
        ${choiceBtn('data-ch9="night:escape"', '用加班和手机逃离家庭噪音')}
      `
    });
    bindChapter9Buttons(ctx);
    return;
  }

  if (state.scene === "intimacyFade") {
    storyFrame({
      chapter: CHAPTERS[8].title,
      text: `
        <p>你们很久没有好好约会了。不是不爱，而是每次想靠近，都先想起明天要早起。</p>
        <p>某个深夜，${npc.name} 说：“我们是不是变成室友了？”</p>
      `,
      choices: `
        ${choiceBtn('data-ch9="intimacy:talk"', '认真谈亲密和疲惫，而不是互相指责', { eq: 7 })}
        ${choiceBtn('data-ch9="intimacy:pretend"', '装作没事，大家都很累')}
        ${choiceBtn('data-ch9="intimacy:check"', '追问是不是外面有人或有事瞒着')}
        ${choiceBtn('data-ch9="intimacy:separate"', '短期分房/分居，先恢复呼吸空间')}
      `
    });
    bindChapter9Buttons(ctx);
    return;
  }

  if (state.scene === "careerGap") {
    storyFrame({
      chapter: CHAPTERS[8].title,
      text: `
        <p>孩子上托班后，被中断的职业、收入差距和谁为家庭降速的问题重新浮出水面。</p>
        <p>以前说“以后会补偿”，但以后到了，补偿却没有自动发生。</p>
      `,
      choices: `
        <button data-ch9="career:restart" type="button">重启自己的职业和收入系统</button>
        <button data-ch9="career:family" type="button">继续以家庭为先，等更合适的时机</button>
        <button data-ch9="career:partner" type="button">要求 ${npc.name} 调整工作承担家庭</button>
        <button data-ch9="career:resent" type="button">翻旧账，把这几年的不公平说出来</button>
      `
    });
    bindChapter9Buttons(ctx);
    return;
  }

  if (state.scene === "oldParents") {
    storyFrame({
      chapter: CHAPTERS[8].title,
      text: `
        <p>双方父母也老了。带娃的人开始需要被照顾，曾经插手生活的人现在拿出体检单。</p>
        <p>养老、带娃、还贷和工作挤在同一个月历上，像四辆车同时挤进一条窄路。</p>
      `,
      choices: `
        <button data-ch9="elder:rule" type="button">制定养老和带娃边界，钱和时间分开算</button>
        <button data-ch9="elder:take" type="button">先接过来住，现实比边界更急</button>
        <button data-ch9="elder:money" type="button">用钱解决一部分养老和照护</button>
        <button data-ch9="elder:refuse" type="button">拒绝无限兜底，小家庭不能被拖垮</button>
      `
    });
    bindChapter9Buttons(ctx);
    return;
  }

  if (state.scene === "sevenYearTalk") {
    storyFrame({
      chapter: CHAPTERS[8].title,
      text: `
        <p>七年以后，婚姻的裂缝很少像电视剧那样响亮。它更像忘记回复的消息、分开的被子和越来越少的解释。</p>
        <p>你们终于坐下来，谈这段关系到底还要怎么继续。</p>
      `,
      choices: `
        <button data-ch9="seven:repair" type="button">修复关系，重新分工、重新约会、重新谈规则</button>
        <button data-ch9="seven:roommates" type="button">维持室友式婚姻，孩子稳定最重要</button>
        <button data-ch9="seven:trial" type="button">试行分居，观察彼此是否还愿意回来</button>
        <button data-ch9="seven:lawyer" type="button">咨询律师，准备最坏情况下的资产和抚养安排</button>
      `
    });
    bindChapter9Buttons(ctx);
    return;
  }

  if (state.scene === "chapter9End") {
    storyFrame({
      chapter: CHAPTERS[8].title,
      text: `
        <p>第九章结束。</p>
        <p>${chapter9Outcome(state)}</p>
        <p>下一章，孩子走到校门口。教育、学区、家长群和十年婚姻，会一起迎来最后一次清算。</p>
      `,
      choices: `<button class="primary" data-next-chapter type="button">进入第十章</button>`
    });
    document.querySelector("[data-next-chapter]")?.addEventListener("click", () => {
      state.chapter = 10;
      state.scene = "chapter10Start";
      saveState();
      render();
    });
  }
}

export function renderChapter10(ctx) {
  const { state, currentNpc, storyFrame, setScreen, settleRunExperience, totalPoints, choiceBtn } = ctx;
  const npc = currentNpc();

  if (state.scene === "chapter10Start") {
    storyFrame({
      chapter: CHAPTERS[9].title,
      text: `
        <p>第十年，孩子真的站在校门口了。</p>
        <p>你原以为上学意味着轻松一点，后来才发现，新的系统刚刚启动：学区、接送、家长群、兴趣班、同伴比较。</p>
        <p><b>${npc.name}</b>：“我们不能让孩子输在起点。”</p>
      `,
      choices: `
        ${choiceBtn('data-ch10="school:nearby"', '就近入学，家庭节奏比排名更重要')}
        ${choiceBtn('data-ch10="school:district"', '换学区/学位房，为孩子再赌一轮', { wealth: 6 })}
        ${choiceBtn('data-ch10="school:private"', '考虑民办或国际路线，用钱换资源', { wealth: 7 })}
        ${choiceBtn('data-ch10="school:parents"', '听双方父母建议，他们更懂本地规则')}
      `
    });
    bindChapter10Buttons(ctx);
    return;
  }

  if (state.scene === "parentGroup") {
    storyFrame({
      chapter: CHAPTERS[9].title,
      text: `
        <p>家长群比闹钟更准时。作业、接龙、截图、比较、提醒、表扬、批评。</p>
        <p>你发现教育焦虑不是从孩子开始的，而是从成年人互相看见开始的。</p>
      `,
      choices: `
        <button data-ch10="group:mute" type="button">降低群消息权重，不让焦虑接管家庭</button>
        <button data-ch10="group:active" type="button">积极参与，不能错过任何信息</button>
        <button data-ch10="group:compare" type="button">观察别人怎么鸡娃，再调整策略</button>
        <button data-ch10="group:partner" type="button">要求 ${npc.name} 共同处理家长群和作业</button>
      `
    });
    bindChapter10Buttons(ctx);
    return;
  }

  if (state.scene === "interestClass") {
    storyFrame({
      chapter: CHAPTERS[9].title,
      text: `
        <p>周末不再属于周末。钢琴、英语、编程、游泳、围棋、体能课，每一种选择都像未来保险。</p>
        <p>孩子问：“我今天可以不去吗？”</p>
      `,
      choices: `
        ${choiceBtn('data-ch10="class:one"', '只保留一个真正喜欢的项目')}
        ${choiceBtn('data-ch10="class:full"', '先报满，长大后会感谢我们')}
        ${choiceBtn('data-ch10="class:none"', '什么都不报，让孩子先拥有童年')}
        ${choiceBtn('data-ch10="class:child"', '让孩子参与决定，承担选择后果', { eq: 7 })}
      `
    });
    bindChapter10Buttons(ctx);
    return;
  }

  if (state.scene === "tenYearMirror") {
    storyFrame({
      chapter: CHAPTERS[9].title,
      text: `
        <p>孩子走进校门以后，你和 ${npc.name} 站在原地，忽然都不知道手该放在哪里。</p>
        <p>十年里，你们谈过爱，谈过钱，谈过父母，谈过债务，谈过孩子。最后剩下的问题很简单：你还要不要这样过下去？</p>
      `,
      choices: `
        <button data-ch10="mirror:together" type="button">继续一起过，但重新签生活规则</button>
        <button data-ch10="mirror:separate" type="button">和平分开，优先保护孩子和各自人生</button>
        <button data-ch10="mirror:endure" type="button">维持现状，至少外面看起来稳定</button>
        <button data-ch10="mirror:restart" type="button">不再等别人改变，先重启自己的人生</button>
      `
    });
    bindChapter10Buttons(ctx);
    return;
  }

  if (state.scene === "chapter10End") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-settle-run type="button">结算周目经验</button>`;
    storyFrame({
      chapter: CHAPTERS[9].title,
      text: `
        <p>第十章结束。</p>
        <p>${chapter10Outcome(state)}</p>
        <p>孩子上学的那天，十年像一张长长的账单，也像一张不断重开的地图。</p>
        ${state.runSettled ? `<p class="hint">本周目已结算。下一次新周目将拥有 ${totalPoints()} 点机动点。</p>` : `<p class="hint">结算后会根据本周目压力和随机经验，获得 2-3 点永久机动点。</p>`}
      `,
      choices: settleButton
    });
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-settle-run]")?.addEventListener("click", settleRunExperience);
  }
}
