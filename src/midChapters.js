import { CHAPTERS } from "./story.js?v=0.14.0";

export function createMidChapterRenderers(ctx) {
  const {
    state,
    currentNpc,
    currentSeed,
    motiveForCurrent,
    storyFrame,
    currentCaseLine,
    getNpc,
    chapter4Choice,
    chapter5Choice,
    chapter6Choice,
    chapter7Choice,
    chapter8Choice,
    saveState,
    render,
    setScreen,
    canStopLoss,
    endPrimaryRelationship,
    settleRunExperience,
    totalPoints,
    choiceBtn
  } = ctx;

function bindChapter4Buttons() {
  document.querySelectorAll("[data-ch4]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch4.split(":");
      chapter4Choice(kind, value);
    });
  });
}

function lateStopLossChoice(label = "止损，结束这段关系") {
  return canStopLoss() ? `<button data-late-stop-loss type="button">${label}</button>` : "";
}

function bindLateStopLoss(reason) {
  document.querySelector("[data-late-stop-loss]")?.addEventListener("click", () => {
    endPrimaryRelationship(reason, { allowSwitch: false, scene: "lateStopLossEnding" });
  });
}

function renderLateStopLossEnding() {
  const settleButton = state.runSettled
    ? `<button class="primary" data-title type="button">回到标题</button>`
    : `<button class="primary" data-settle-run type="button">结算止损经验</button>`;
  storyFrame({
    chapter: "后期止损",
    text: `
      <p>你没有继续把关系往下一关推进。</p>
      <p class="hint">${state.lastStopLossReason ?? "你选择在代价继续扩大前停下来。"}</p>
      <p>这一次的代价更重：亲戚、账单、父母、孩子计划，甚至已经形成的共同生活。但能在更深处停下，也是一种能力。</p>
      ${state.runSettled ? `<p class="hint">本周目已结算。下一次新周目将拥有 ${totalPoints()} 点机动点。</p>` : `<p class="hint">结算后会获得本轮判断带来的永久机动点。</p>`}
    `,
    choices: settleButton
  });
  document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
  document.querySelector("[data-settle-run]")?.addEventListener("click", settleRunExperience);
}

function parentApprovalText(score = 0) {
  if (score >= 4) return "对方父母目前很满意：他们说话明显柔和，开始把你当成“可以进入家门的人”。";
  if (score >= 2) return "对方父母目前一般满意：大方向能接受，但会偶尔挑小问题确认你是否好说话。";
  if (score >= 0) return "对方父母目前不太满意：他们没有明说反对，却开始反复确认钱、房、父母资源和未来分工。";
  return "对方父母目前很不满意：他们开始频繁找茬，所有小问题都会被放大成“不合适”。";
}

function familyPressureText(npc) {
  if (npc.id === "chen") return "饭后，TA 的亲戚提到“年轻人事业要互相扶持”。你听出来，这句话背后是凤凰男式的事业起飞期待。";
  if (npc.id === "he") return "TA 家里人反复提到弟弟和家里开销，彩礼被说成“不是卖女儿，是给家里一个交代”。";
  if (npc.id === "xu") return "TA 的父母没有直接要求你什么，但每一句“我们家不缺这个”都在确认你能不能配得上他们的生活方式。";
  if (npc.id === "lin") return "TA 的父母很客气，却不断问你的职业上限、城市规划和父母能提供多少支持。";
  return "这一次，父母没有只看你们相不相爱，而是在评估这段婚姻能不能服务各自家庭的安全感。";
}

function majorRevealText(npc, motive) {
  if (!motive) {
    return `${npc.name} 把一张写得很乱的清单推给你：房子、婚礼、双方父母、孩子计划。TA 说：“我没有标准答案，但我想和你一起把这些事说清楚。”`;
  }

  const revealMap = {
    money: `${npc.name} 希望你先承担装修和婚礼定金。“反正以后都是一家人，谁先出都一样。”`,
    familyResource: `${npc.name} 的父母反复询问你的户口、父母资源和学区资格，甚至绕过你给你父母发了消息。`,
    display: `${npc.name} 把订婚宴说成一次社交亮相，要求你配合服装、照片和朋友圈文案。`,
    care: `${npc.name} 的父母提出婚后最好住近一点，孩子三年内要，老人身体也需要有人照看。`,
    emotionalSupply: `${npc.name} 在谈判前夜崩溃，说如果你还要谈条件，就是在逼 TA 一个人面对全世界。`,
    classJump: `${npc.name} 把订婚宴名单写得很长，重点标注了你能介绍的老板、亲戚和同学。`,
    cover: `${npc.name} 坚持先订婚再补资料，理由是“查来查去太伤感情”，但背调记录里还有一项未确认债务。`,
    control: `${npc.name} 要求婚后工资、社交和节假日安排都提前统一，说“婚姻里不能各过各的”。`,
    kpi: `${npc.name} 拿出一张时间表：本月见父母，下月订婚，三个月领证，半年备孕。`,
    content: `${npc.name} 已经拟好了订婚标题和短视频脚本，甚至想让双方父母也出镜。`
  };

  return revealMap[currentSeed().motive];
}

function marriagePressureText(npc, motive) {
  if (!motive) {
    return `${npc.name} 把一张写得很乱的清单推给你：房子、婚礼、双方父母、孩子计划。TA 说：“我没有标准答案，但我想和你一起把这些事说清楚。”`;
  }
  return `${npc.name} 的某个需求变得越来越明显：${motive.pressure} 你还不能断定这就是 TA 的真实目的，但它已经足够影响婚姻谈判。`;
}

function chapter4Outcome() {
  const boundary = state.flags.boundary ?? 0;
  const suspicion = state.flags.suspicion ?? 0;
  const parentConflict = state.flags.parentConflict ?? 0;
  const assetProtection = state.flags.assetProtection ?? 0;
  const riskTolerance = state.flags.riskTolerance ?? 0;

  if (boundary >= 9 && assetProtection >= 2) {
    return "你没有让现实问题吞掉感情，也没有让感情吞掉规则。关系进入订婚观察期。";
  }
  if (suspicion >= 5 || parentConflict >= 4) {
    return "谈判没有彻底破裂，但你已经看见了某种未来：每一次亲密，都可能变成两家人的拉扯。";
  }
  if (riskTolerance >= 4) {
    return "关系推进得很快，快到很多问题都被暂时塞进了抽屉。抽屉没有消失，只是还没打开。";
  }
  return "你们勉强把婚事推到下一步。没有人完全满意，但每个人都觉得自己已经让步。";
}

function weddingPressureText(npc, motive) {
  if (!motive) {
    return `${npc.name} 看起来也很累，但 TA 没有把压力都推给你。TA 说：“婚礼可以乱一点，我们别乱。”`;
  }

  const lines = {
    money: `${npc.name} 开始反复计算礼金和回本，婚礼像一场财务压力测试。`,
    familyResource: `${npc.name} 的父母希望多请几桌“以后用得上的人”，名单越来越像资源地图。`,
    display: `${npc.name} 对舞台、灯光、服装和宾客评价异常在意，像是在完成一次公开展示。`,
    care: `${npc.name} 的亲戚在饭桌上提前讨论孩子和老人，仿佛婚礼当天就要交接责任。`,
    emotionalSupply: `${npc.name} 一边说自己快撑不住，一边要求你负责让所有人满意。`,
    classJump: `${npc.name} 把婚礼宾客名单当成机会清单，反复确认你能不能介绍某些人。`,
    cover: `${npc.name} 对某条婚礼前夕的陌生消息反应过激，急着让你别查了。`,
    control: `${npc.name} 要求你按 TA 的流程走，连敬酒顺序和说话内容都要提前确认。`,
    kpi: `${npc.name} 把婚礼、领证、备孕排成一张不可更改的时间表。`,
    content: `${npc.name} 说婚礼素材只有一次，要求你配合拍摄和发布节奏。`
  };

  return lines[currentSeed().motive];
}

function chapter5Outcome() {
  const pressure = state.flags.weddingPressure ?? 0;
  const conflict = state.flags.parentConflict ?? 0;
  const boundary = state.flags.boundary ?? 0;
  const suspicion = state.flags.suspicion ?? 0;

  if (boundary >= 12 && suspicion >= 4) {
    return "你把婚礼从命运里拿了下来，重新放回选择里。有人说你任性，但你知道自己是在止损。";
  }
  if (pressure >= 5 || conflict >= 5) {
    return "婚礼没有取消，但它已经不再只是你们两个人的事。它像一辆载满亲戚、面子和账单的车，继续往前开。";
  }
  if (boundary >= 9) {
    return "你们保住了婚礼，也保住了一部分小家庭边界。不是完美胜利，但足够让下一步不那么狼狈。";
  }
  return "婚礼继续推进。你不确定这是因为爱足够坚定，还是因为所有人都已经付了定金。";
}

function firstYearPressureText(npc, motive) {
  if (!motive) {
    return `${npc.name} 也有不成熟的地方，但 TA 至少愿意承认：“共同生活比我想的难，我们得重新分工。”`;
  }

  const lines = {
    money: `${npc.name} 对共同账户格外积极，却对自己的旧支出解释得很慢。`,
    familyResource: `${npc.name} 的父母越来越频繁地参与你们的小家安排，理由是“都是为了你们好”。`,
    display: `${npc.name} 在外人面前维持完美婚姻，回到家却不愿处理真实问题。`,
    care: `${npc.name} 默认你会承担更多家务、老人探访和未来育儿准备。`,
    emotionalSupply: `${npc.name} 把工作、家庭和父母压力都倒给你，像你是婚后的情绪缓冲垫。`,
    classJump: `${npc.name} 仍在通过你的圈子寻找机会，婚姻成了进入新关系网的通行证。`,
    cover: `${npc.name} 婚前没说清的旧事，开始以账单、消息或亲戚口风的形式冒出来。`,
    control: `${npc.name} 开始要求你报备下班、聚会和消费，说这是已婚人士的自觉。`,
    kpi: `${npc.name} 把领证、装修、备孕、买车、见亲戚排成不可拖延的进度表。`,
    content: `${npc.name} 想把婚后生活也做成内容，连争吵都被说成“可以匿名分享”。`
  };

  return lines[currentSeed().motive];
}

function chapter6Outcome() {
  const household = state.flags.householdPressure ?? 0;
  const boundary = state.flags.boundary ?? 0;
  const affection = state.flags.affection ?? 0;
  const parentConflict = state.flags.parentConflict ?? 0;
  const suspicion = state.flags.suspicion ?? 0;

  if (boundary >= 14 && affection >= 5) {
    return "你们没有把婚后第一年过成童话，但把很多问题从情绪里拿出来，放到了桌面上。";
  }
  if (household >= 6 || parentConflict >= 7) {
    return "婚后的日子没有爆炸，却像持续漏水的天花板。你开始明白，日常才是最长的压力测试。";
  }
  if (suspicion >= 5) {
    return "第一年结束时，你们还住在同一个屋檐下，但有些问题已经不再适合用“磨合”解释。";
  }
  return "婚后第一年过去了。你们学会了一点点过日子，也留下一些还没来得及处理的裂缝。";
}

function housingDebtText(npc, motive) {
  if (!motive) {
    return `${npc.name} 看着月供表沉默了很久，说：“我们先把最坏的情况也算进去，别只算买得起的时候。”`;
  }

  const lines = {
    money: `${npc.name} 希望你承担更多首付和装修，理由是“以后都是共同资产”。`,
    familyResource: `${npc.name} 的父母不断介入选房、贷款和学区判断，像他们才是共同买家。`,
    display: `${npc.name} 更在意房子能不能成为对外展示的生活升级。`,
    care: `${npc.name} 把老人同住、带娃和省钱一起打包进买房方案。`,
    emotionalSupply: `${npc.name} 一谈月供就崩溃，把压力变成你必须安抚的情绪。`,
    classJump: `${npc.name} 想通过房子进入更好的圈层，哪怕月供已经压到极限。`,
    cover: `${npc.name} 的征信和旧债问题开始影响贷款，却迟迟没有完整解释。`,
    control: `${npc.name} 用房贷压力要求你减少社交、消费和职业冒险。`,
    kpi: `${npc.name} 把买房、装修、备孕和换车排进同一张进度表。`,
    content: `${npc.name} 把买房装修拍成生活升级故事，却不愿展示真实债务。`
  };

  return lines[currentSeed().motive];
}

function chapter7Outcome() {
  const debt = state.flags.debtPressure ?? 0;
  const asset = state.flags.assetProtection ?? 0;
  const boundary = state.flags.boundary ?? 0;
  const suspicion = state.flags.suspicion ?? 0;
  const parent = state.flags.parentConflict ?? 0;

  if (asset >= 8 && boundary >= 12) {
    return "你们没有把房子当成爱情证明，而是把它当成一项需要共同风控的长期项目。";
  }
  if (debt >= 7 || suspicion >= 6) {
    return "房子还没完全成为家，债务已经先成为了第三个家庭成员。";
  }
  if (parent >= 8) {
    return "买房让双方父母重新拥有了入场券。你们的小家还没入住，边界已经被反复敲门。";
  }
  return "第七章结束时，你们离一个具体的家更近了一点，也离长期债务更近了一点。";
}

function childPressureText(npc, motive) {
  if (!motive) {
    return `${npc.name} 没有把“要不要孩子”说成考题。TA 只是问：“如果要，我们能不能先把谁照顾谁、谁牺牲什么说清楚？”`;
  }

  const lines = {
    money: `${npc.name} 对育儿预算格外敏感，却总希望你先承担“眼前这一笔”。`,
    familyResource: `${npc.name} 的父母开始关心户口、学区和你父母能不能帮忙带娃。`,
    display: `${npc.name} 更在意亲子形象和外人评价，像孩子也会成为家庭体面的证明。`,
    care: `${npc.name} 默认你会承担更多怀孕、照护、夜醒和老人沟通。`,
    emotionalSupply: `${npc.name} 把育儿焦虑不断交给你处理，仿佛你必须先稳定 TA。`,
    classJump: `${npc.name} 关心孩子能进入怎样的圈层，也关心你能不能为此调动资源。`,
    cover: `${npc.name} 对一个会影响生育计划的旧问题仍然含糊其辞。`,
    control: `${npc.name} 开始用孩子规划要求你调整工作、社交和消费。`,
    kpi: `${npc.name} 把备孕、产检、出生、入托、入学排成一张家庭进度表。`,
    content: `${npc.name} 已经想好亲子内容的风格，却还没想好凌晨三点谁起来。`
  };

  return lines[currentSeed().motive];
}

function chapter8Outcome() {
  const child = state.flags.childPressure ?? 0;
  const boundary = state.flags.boundary ?? 0;
  const affection = state.flags.affection ?? 0;
  const parent = state.flags.parentConflict ?? 0;
  const household = state.flags.householdPressure ?? 0;

  if (boundary >= 18 && affection >= 6) {
    return "你们没有把孩子当成修复婚姻的工具，也没有把牺牲包装成理所当然。第八章结束时，小家庭终于学会了先保护人，再安排事。";
  }
  if (child >= 8 || household >= 8) {
    return "孩子让生活变得更具体，也让分工不公变得更难遮掩。你开始明白，育儿不是爱情的续集，而是婚姻系统的压力峰值。";
  }
  if (parent >= 10) {
    return "双方父母以爱和经验为名重新入场。孩子还小，但三个家庭的边界已经先长出了牙齿。";
  }
  return "第八章结束时，你们仍在学习如何做父母，也仍在学习如何不把自己完全交给父母这个身份。";
}

function renderChapter4() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "chapter4Start") {
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>孟姐把一份《谈婚论嫁沟通清单》放在桌上。</p>
        <p>彩礼、嫁妆、婚房、房本、婚礼预算、婚后住哪、孩子什么时候要。</p>
        <p><b>孟姐</b>：“恋爱里可以说以后再看。结婚前，‘以后’会坐到你们对面。”</p>
        ${currentCaseLine("marriageTalk") ? `<p class="hint">${currentCaseLine("marriageTalk")}</p>` : ""}
      `,
      choices: `
        <button data-ch4="brief:redLines" type="button">先和 ${npc.name} 说清底线</button>
        <button data-ch4="brief:agency" type="button">让婚介安排正式谈判</button>
        <button data-ch4="brief:private" type="button">私下温和推进</button>
        <button data-ch4="brief:delay" type="button">暂缓，感觉太快了</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "secondaryMessage") {
    const secondary = getNpc(state.secondaryNpcId);
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>谈婚论嫁清单刚打开，你的手机亮了一下。</p>
        <p class="side-signal">${secondary.name}：“最近还好吗？如果你还没完全确定，我想再认真和你聊一次。”</p>
        <p>这条消息没有越界，却足够改变空气。它提醒你：选择一个人，也意味着放弃其他可能。</p>
      `,
      choices: `
        <button data-ch4="secondary:reply" type="button">私下回复，先听听 TA 怎么说</button>
        <button data-ch4="secondary:ignore" type="button">不回复，把注意力留在当前关系</button>
        <button data-ch4="secondary:tell" type="button">把消息告诉 ${npc.name}，关系需要透明</button>
        <button data-ch4="secondary:switch" type="button">暂停当前关系，转向观察对象</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "bridePrice") {
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>第一轮谈的是彩礼、嫁妆和婚礼预算。</p>
        <p>孟姐的平板上有地区行情表，也有“体面婚礼套餐”。你忽然明白，面子也是一种支出。</p>
        <p><b>${npc.name}</b>：“我不想让父母难看，但也不希望我们为了别人掏空自己。”</p>
      `,
      choices: `
        <button data-ch4="bridePrice:market" type="button">按地区行情谈，别让父母太难看</button>
        <button data-ch4="bridePrice:symbolic" type="button">彩礼象征化，把钱留给小家庭</button>
        <button data-ch4="bridePrice:high" type="button">坚持高规格，婚礼必须体面</button>
        <button data-ch4="bridePrice:postpone" type="button">先不谈数字，继续观察态度</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "houseName") {
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>第二轮谈到婚房。空气明显变硬。</p>
        <p>首付谁出，贷款谁还，房本写谁名。每个问题都像一枚小小的印章，盖在未来十年的生活上。</p>
      `,
      choices: `
        <button data-ch4="house:contribution" type="button">按出资和还贷贡献写清楚</button>
        <button data-ch4="house:both" type="button">为了安全感，尽量写双方名字</button>
        <button data-ch4="house:parents" type="button">听父母安排，毕竟他们出钱</button>
        <button data-ch4="house:rent" type="button">暂不买房，先租房独立生活</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "parentsMeeting") {
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>双方父母第一次正式见面。</p>
        <p>菜上得很慢，话却上得很快。有人问收入，有人问房子，有人问孩子，有人说“我们不是要钱，是要态度”。</p>
        <p class="hint">${motive ? motive.light : "你注意到，真正让你安定的是：TA 没有把所有问题都推给你回答。"}</p>
        ${currentCaseLine("marriageTalk") ? `<p class="hint">${currentCaseLine("marriageTalk")}</p>` : ""}
      `,
      choices: `
        <button data-ch4="meeting:partner" type="button">优先保护你和 ${npc.name} 的小家庭</button>
        <button data-ch4="meeting:parents" type="button">先安抚父母，别让场面难看</button>
        <button data-ch4="meeting:pause" type="button">当场暂停，问题太多需要整理</button>
        <button data-ch4="meeting:mediate" type="button">让孟姐介入调停</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "agreement") {
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>婚前财产咨询室里，律师把话说得很平。</p>
        <p>“感情归感情。房产、债务、赠与、共同还贷、婚礼支出，最好不要靠记忆保存。”</p>
        <p>${npc.name} 看着你，像是在等你先表态。</p>
      `,
      choices: `
        ${choiceBtn('data-ch4="agreement:mutual"', '双方都签清楚，保护彼此')}
        ${choiceBtn('data-ch4="agreement:romance"', '不签，谈协议太伤感情')}
        ${choiceBtn('data-ch4="agreement:lawyer"', '找独立律师再看一遍', { education: 6 })}
        ${choiceBtn('data-ch4="agreement:delay"', '先订婚，协议以后再补')}
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "parentsSecond") {
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>双方父母第二次见面，比第一次更具体，也更难装客气。</p>
        <p class="message">${parentApprovalText(state.flags.partnerParentApproval)}</p>
        <p class="hint">${npc.familyProfile ?? "每个家庭都带着自己的账本、恐惧和期待进场。"}</p>
        <p>${familyPressureText(npc)}</p>
      `,
      choices: `
        <button data-ch4="meeting2:clear" type="button">把彩礼、房本、住处和探访频率逐条说清</button>
        <button data-ch4="meeting2:yield" type="button">为了顺利推进，先满足对方父母几个要求</button>
        <button data-ch4="meeting2:counter" type="button">反问对方家庭能承担什么，而不是只提要求</button>
        <button data-ch4="meeting2:partner" type="button">要求 ${npc.name} 当场表态并承担沟通责任</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "motiveReveal") {
    const seed = currentSeed();
    const revealed = seed?.motiveRevealed;
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>谈判进入最后一晚，${npc.name} 的需求从缝里露出来。</p>
        <p class="message">${revealed ? majorRevealText(npc, motive) : marriagePressureText(npc, motive)}</p>
        <p>${revealed ? "这一次不是重复揭示，而是你必须决定如何处理已经看见的事实。" : "它还不是动机摊牌，但足够证明：婚姻不是只看甜的时候。"}</p>
      `,
      choices: `
        <button data-ch4="reveal:accept" type="button">接受，现实婚姻总要妥协</button>
        <button data-ch4="reveal:condition" type="button">继续，但必须写清条件</button>
        <button data-ch4="reveal:confront" type="button">当面质问真实动机</button>
        <button data-ch4="reveal:break" type="button">暂停或结束这段关系</button>
      `
    });
    bindChapter4Buttons();
    return;
  }

  if (state.scene === "chapter4End") {
    const stopLossChoice = canStopLoss()
      ? `<button data-stop-loss type="button">${state.secondaryNpcId ? "止损，转向观察对象" : "止损，不再推进这段关系"}</button>`
      : "";
    storyFrame({
      chapter: CHAPTERS[3].title,
      text: `
        <p>第四章结束。</p>
        <p>${chapter4Outcome()}</p>
        <p>下一章将进入婚礼战役：订婚宴、酒店、伴郎伴娘、份子钱、前任消息和双方父母的第二轮较量。</p>
      `,
      choices: `
        ${stopLossChoice}
        <button class="primary" data-next-chapter type="button">进入第五章</button>
      `
    });
    document.querySelector("[data-stop-loss]")?.addEventListener("click", () => {
      endPrimaryRelationship("第四章结束时，你选择不再走进婚礼。");
    });
    document.querySelector("[data-next-chapter]").addEventListener("click", () => {
      state.chapter = 5;
      state.scene = "chapter5Start";
      saveState();
      render();
    });
  }
}

function bindChapter5Buttons() {
  document.querySelectorAll("[data-ch5]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch5.split(":");
      chapter5Choice(kind, value);
    });
  });
}

function renderChapter5() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "lateStopLossEnding") return renderLateStopLossEnding();

  if (state.scene === "chapter5Start") {
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>订婚之后，婚礼像一张自动生成的待办清单扑面而来。</p>
        <p>酒店档期、司仪、摄影、伴郎伴娘、婚车、座次、份子钱、朋友圈官宣。</p>
        <p><b>孟姐</b>：“婚礼最难的不是办得漂亮，是办完以后两个人还愿意一起回家。”</p>
      `,
      choices: `
        <button data-ch5="plan:simple" type="button">小型婚礼，优先保住预算和边界</button>
        <button data-ch5="plan:grand" type="button">体面大办，不能让双方父母丢脸</button>
        <button data-ch5="plan:parents" type="button">让父母主导，他们更懂礼数</button>
        <button data-ch5="plan:private" type="button">先和 ${npc.name} 私下定共同原则</button>
      `
    });
    bindChapter5Buttons();
    return;
  }

  if (state.scene === "guestList") {
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>宾客名单越改越长。亲戚、同事、领导、同学、客户，还有一些你根本没见过的人。</p>
        <p class="hint">${currentCaseLine("wedding") || weddingPressureText(npc, motive)}</p>
        <p>座次表上每一个名字，都像在提醒你：婚礼是公开关系，也是一场社会排序。</p>
      `,
      choices: `
        <button data-ch5="guest:rules" type="button">制定规则：只请真正亲近的人</button>
        <button data-ch5="guest:face" type="button">照顾面子，重要关系都安排上</button>
        <button data-ch5="guest:cut" type="button">砍掉超预算名单</button>
        <button data-ch5="guest:agency" type="button">交给婚介和婚庆协调</button>
      `
    });
    bindChapter5Buttons();
    return;
  }

  if (state.scene === "budget") {
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>婚庆报价比第一次沟通多了三成。摄影升级、灯光升级、甜品台升级，连“体面”也有套餐。</p>
        <p><b>${npc.name}</b>：“就这一次，要不要咬咬牙？”</p>
      `,
      choices: `
        <button data-ch5="budget:split" type="button">费用写清楚，双方按能力分担</button>
        <button data-ch5="budget:loan" type="button">先借钱办，婚后慢慢还</button>
        <button data-ch5="budget:downgrade" type="button">降级方案，不为一天掏空几年</button>
        <button data-ch5="budget:partner" type="button">要求 ${npc.name} 一起面对父母</button>
      `
    });
    bindChapter5Buttons();
    return;
  }

  if (state.scene === "weddingCustoms") {
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>婚庆群里开始讨论接亲流程：堵门红包、伴郎伴娘游戏、敬茶改口、谁背谁下楼。</p>
        <p>有人说“结婚就图个热闹”，有人说“老一辈都这样”。</p>
        <p>你看着那些玩笑截图，突然明白：边界最容易在热闹里被要求让路。</p>
      `,
      choices: `
        ${choiceBtn('data-ch5="customs:ban"', '提前禁止低俗婚闹和羞辱性游戏', { eq: 6 })}
        ${choiceBtn('data-ch5="customs:redPacket"', '按地方规矩准备堵门红包和改口费')}
        ${choiceBtn('data-ch5="customs:playAlong"', '配合热闹，别扫大家兴')}
        ${choiceBtn('data-ch5="customs:partner"', '让 ${npc.name} 出面挡掉不合适流程')}
      `
    });
    bindChapter5Buttons();
    return;
  }

  if (state.scene === "exMessage") {
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>婚礼前两周，你收到一条陌生消息。</p>
        <p class="message">“你真的了解 TA 吗？有些事，不该等到婚礼当天才知道。”</p>
        <p>${npc.name} 看到消息时，表情有一瞬间空白。</p>
      `,
      choices: `
        <button data-ch5="ex:ask" type="button">直接问清楚</button>
        <button data-ch5="ex:ignore" type="button">不理会，婚前有人搅局很正常</button>
        <button data-ch5="ex:verify" type="button">暂停流程，核实来源和内容</button>
        <button data-ch5="ex:pause" type="button">延期婚礼，先处理信任问题</button>
      `
    });
    bindChapter5Buttons();
    return;
  }

  if (state.scene === "weddingEve") {
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>婚礼前夜，你们坐在酒店房间里。楼下正在布置花门，手机里全是明天的流程。</p>
        <p class="hint">${weddingPressureText(npc, motive)}</p>
        <p>你突然意识到，明天真正要走上台的，不只是你们两个人，还有之前所有没解决的问题。</p>
      `,
      choices: `
        ${choiceBtn('data-ch5="eve:continue"', '继续婚礼，明天以后再说')}
        ${choiceBtn('data-ch5="eve:condition"', '继续，但把关键条件写下来')}
        ${choiceBtn('data-ch5="eve:delay"', '延期婚礼，先把问题处理完')}
        ${choiceBtn('data-ch5="eve:cancel"', '取消婚礼，承受代价也要止损')}
      `
    });
    bindChapter5Buttons();
    return;
  }

  if (state.scene === "chapter5End") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-next-chapter type="button">进入第六章</button>`;
    storyFrame({
      chapter: CHAPTERS[4].title,
      text: `
        <p>第五章结束。</p>
        <p>${chapter5Outcome()}</p>
        <p>下一章将进入婚后第一年：工资卡、春节去哪家、家务分配、亲密频率、父母探访和第一次共同生活危机。</p>
      `,
      choices: `
        ${lateStopLossChoice("止损，不把婚礼推进成婚姻")}
        ${settleButton}
      `
    });
    bindLateStopLoss("第五章结束时，你选择不把婚礼惯性推进成婚姻。");
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-next-chapter]")?.addEventListener("click", () => {
      state.chapter = 6;
      state.scene = "chapter6Start";
      saveState();
      render();
    });
  }

  if (state.scene === "weddingCancelledEnding") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-settle-run type="button">结算止损经验</button>`;
    storyFrame({
      chapter: "婚礼前的止损",
      text: `
        <p>婚礼前夕，你取消了一切。</p>
        <p>退款、亲戚、父母、对方的眼神——代价不会小。但有些门，走进去之前还可以不走。</p>
        <p>你没有进入那段婚姻。这不是失败，是一次看见了再停下来的能力。</p>
        ${state.runSettled ? `<p class="hint">本周目已结算。下一次新周目将拥有 ${totalPoints()} 点机动点。</p>` : `<p class="hint">结算后会获得本轮判断带来的永久机动点。</p>`}
      `,
      choices: settleButton
    });
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-settle-run]")?.addEventListener("click", settleRunExperience);
  }
}

function bindChapter6Buttons() {
  document.querySelectorAll("[data-ch6]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch6.split(":");
      chapter6Choice(kind, value);
    });
  });
}

function renderChapter6() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "lateStopLossEnding") return renderLateStopLossEnding();

  if (state.scene === "chapter6Start") {
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>婚礼过去一个月，鲜花撤掉，滤镜消失。</p>
        <p>你们开始面对真正的共同生活：谁做饭，谁洗碗，钱放哪，周末去哪家，晚上几点回消息。</p>
        <p>恋爱像剧情，婚姻像系统。系统每天都要运行。</p>
      `,
      choices: `
        <button data-ch6="account:clear" type="button">共同账户写清规则，各自保留私人账户</button>
        <button data-ch6="account:together" type="button">工资放一起，先建立一家人的感觉</button>
        <button data-ch6="account:parent" type="button">让父母帮忙规划大额支出</button>
        <button data-ch6="account:separate" type="button">经济先分开，磨合后再谈</button>
      `
    });
    bindChapter6Buttons();
    return;
  }

  if (state.scene === "chores") {
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>同住第三周，垃圾袋、碗、衣服和外卖盒开始拥有自己的脾气。</p>
        <p class="hint">${currentCaseLine("firstYear") || firstYearPressureText(npc, motive)}</p>
        <p>你发现家务不是小事。它只是太日常，所以更容易被装作没发生。</p>
      `,
      choices: `
        ${choiceBtn('data-ch6="chores:schedule"', '列清家务表，谁空谁做不再靠默契')}
        ${choiceBtn('data-ch6="chores:natural"', '先自然磨合，别太像合租')}
        ${choiceBtn('data-ch6="chores:outsourcing"', '能外包就外包，用钱换时间', { wealth: 5 })}
        ${choiceBtn('data-ch6="chores:endure"', '先忍一忍，别刚结婚就吵')}
      `
    });
    bindChapter6Buttons();
    return;
  }

  if (state.scene === "springFestival") {
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>第一个春节来了。两边父母都说“你们自己决定”，但每个人都在等答案。</p>
        <p><b>${npc.name}</b>：“要不今年先去我家？我爸妈会想多。”</p>
      `,
      choices: `
        <button data-ch6="festival:alternate" type="button">提前约定轮流，一年一家</button>
        <button data-ch6="festival:partnerHome" type="button">今年先去 TA 家，稳住局面</button>
        <button data-ch6="festival:ownHome" type="button">今年回自己家，别委屈父母</button>
        <button data-ch6="festival:travel" type="button">两边都不去，旅行过年</button>
      `
    });
    bindChapter6Buttons();
    return;
  }

  if (state.scene === "parentsVisit") {
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>父母第一次来你们家住了三天。</p>
        <p>冰箱被重新整理，沙发套被换掉，厨房里多了你不熟悉的调料。</p>
        <p>一句“我都是为你们好”，让你的家突然不像你的家。</p>
      `,
      choices: `
        <button data-ch6="visit:rules" type="button">定探访规则，住几天、做什么都说清楚</button>
        <button data-ch6="visit:welcome" type="button">热情接待，老人不容易</button>
        <button data-ch6="visit:partner" type="button">要求 ${npc.name} 出面沟通</button>
        <button data-ch6="visit:moveOut" type="button">如果边界失守，就考虑搬出去</button>
      `
    });
    bindChapter6Buttons();
    return;
  }

  if (state.scene === "intimacyChild") {
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>婚后第八个月，亲戚开始问孩子。父母开始发育儿视频。朋友圈里同龄人的宝宝照越来越多。</p>
        <p>${npc.name} 问你：“我们是不是也该计划一下？”</p>
      `,
      choices: `
        <button data-ch6="child:plan" type="button">先谈职业、身体、钱和谁带娃</button>
        <button data-ch6="child:now" type="button">顺其自然，有了就要</button>
        <button data-ch6="child:delay" type="button">明确暂缓，至少等关系稳定</button>
        <button data-ch6="child:avoid" type="button">回避这个话题，太容易吵</button>
      `
    });
    bindChapter6Buttons();
    return;
  }

  if (state.scene === "firstCrisis") {
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>婚后第一年快结束时，你们爆发了第一次真正意义上的大吵。</p>
        <p class="message">${firstYearPressureText(npc, motive)}</p>
        <p>争吵的内容像家务、钱、父母和孩子。真正吵的，也许是：谁的生活被默认牺牲。</p>
      `,
      choices: `
        <button data-ch6="crisis:repair" type="button">坐下来复盘，重新分工和修复关系</button>
        <button data-ch6="crisis:silent" type="button">冷处理，等情绪过去</button>
        <button data-ch6="crisis:parents" type="button">让父母评理</button>
        <button data-ch6="crisis:separate" type="button">短暂分居，先保住自己</button>
      `
    });
    bindChapter6Buttons();
    return;
  }

  if (state.scene === "chapter6End") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-next-chapter type="button">进入第七章</button>`;
    storyFrame({
      chapter: CHAPTERS[5].title,
      text: `
        <p>第六章结束。</p>
        <p>${chapter6Outcome()}</p>
        <p>下一章将进入买房与债务：期房、月供、装修、降薪、父母借钱和城市生活的长期压力。</p>
      `,
      choices: `
        ${lateStopLossChoice("止损，结束这段婚后磨损")}
        ${settleButton}
      `
    });
    bindLateStopLoss("第六章结束时，你不再把长期不适解释成磨合。");
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-next-chapter]")?.addEventListener("click", () => {
      state.chapter = 7;
      state.scene = "chapter7Start";
      saveState();
      render();
    });
  }
}

function bindChapter7Buttons() {
  document.querySelectorAll("[data-ch7]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch7.split(":");
      chapter7Choice(kind, value);
    });
  });
}

function renderChapter7() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "lateStopLossEnding") return renderLateStopLossEnding();

  if (state.scene === "chapter7Start") {
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>婚后第二年，房子从“以后再说”变成了每天都被提起的话题。</p>
        <p>租房不稳定，二手房太贵，期房有风险。每一种选择都像在向未来借钱。</p>
        <p><b>${npc.name}</b>：“我们是不是该有个真正属于自己的家？”</p>
      `,
      choices: `
        <button data-ch7="route:rent" type="button">继续租房，先保住现金流和自由</button>
        <button data-ch7="route:secondHand" type="button">买二手房，贵一点但看得见</button>
        <button data-ch7="route:newBuild" type="button">买期房，赌未来交付和升值</button>
        <button data-ch7="route:parents" type="button">听父母建议，他们出一部分首付</button>
      `
    });
    bindChapter7Buttons();
    return;
  }

  if (state.scene === "downPayment") {
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>首付、装修、贷款年限和房本名字被列成表格。</p>
        <p class="hint">${currentCaseLine("housingDebt") || housingDebtText(npc, motive)}</p>
        <p>房子让未来变具体，也让风险变具体。</p>
      `,
      choices: `
        <button data-ch7="down:contract" type="button">所有出资、还贷、装修都写清楚</button>
        <button data-ch7="down:trust" type="button">别算太细，夫妻还是要互相信任</button>
        <button data-ch7="down:parents" type="button">父母出钱，就接受父母意见</button>
        <button data-ch7="down:pause" type="button">先暂停，压力超出预期</button>
      `
    });
    bindChapter7Buttons();
    return;
  }

  if (state.scene === "incomeShock") {
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>贷款批下来后，公司宣布降薪。你的手机屏幕亮着，月供数字也亮着。</p>
        <p><b>${npc.name}</b>：“先撑过去吧，大家都是这么过来的。”</p>
      `,
      choices: `
        <button data-ch7="income:cut" type="button">立刻削减预算，重做现金流</button>
        <button data-ch7="income:borrow" type="button">先向父母借钱缓一缓</button>
        <button data-ch7="income:hide" type="button">暂时不说，自己扛过去</button>
        <button data-ch7="income:sell" type="button">考虑止损，卖掉或退掉</button>
      `
    });
    bindChapter7Buttons();
    return;
  }

  if (state.scene === "relativesLoan") {
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>一个亲戚开口借钱。理由很急，金额不小，还款时间很含糊。</p>
        <p>对方说：“你们都买房了，手里肯定宽裕一点。”</p>
      `,
      choices: `
        ${choiceBtn('data-ch7="relative:refuse"', '拒绝，房贷期不做人情贷款', { eq: 7 })}
        ${choiceBtn('data-ch7="relative:lend"', '借一部分，保住亲戚关系')}
        ${choiceBtn('data-ch7="relative:contract"', '可以借，但必须写借条和期限')}
        ${choiceBtn('data-ch7="relative:partner"', '让 ${npc.name} 一起出面处理')}
      `
    });
    bindChapter7Buttons();
    return;
  }

  if (state.scene === "deliveryRisk") {
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>如果你们选择的是期房，交付日期开始变得暧昧；如果是二手房，装修预算开始失控；如果继续租房，房东又一次提出涨租。</p>
        <p>生活没有给你们一个完美选项，只给了一堆需要承担的后果。</p>
      `,
      choices: `
        <button data-ch7="delivery:rights" type="button">收集证据，走维权或合同流程</button>
        <button data-ch7="delivery:endure" type="button">继续忍耐，先别把事情闹大</button>
        <button data-ch7="delivery:parents" type="button">让双方父母加入处理</button>
        <button data-ch7="delivery:exit" type="button">准备退出方案，减少沉没成本</button>
      `
    });
    bindChapter7Buttons();
    return;
  }

  if (state.scene === "debtTalk") {
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>第七章的最后，你们终于坐下来谈债务。</p>
        <p class="message">${housingDebtText(npc, motive)}</p>
        <p>这一次问题不再是爱不爱，而是：谁签字，谁还钱，谁承担未来十年的风险。</p>
      `,
      choices: `
        <button data-ch7="debt:clear" type="button">明确债务边界，不清楚就不签字</button>
        <button data-ch7="debt:together" type="button">共同承担，婚姻就是一起扛</button>
        <button data-ch7="debt:avoid" type="button">先别谈太细，压力太大</button>
        <button data-ch7="debt:separate" type="button">分开资产和债务，必要时分居止损</button>
      `
    });
    bindChapter7Buttons();
    return;
  }

  if (state.scene === "chapter7End") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-next-chapter type="button">进入第八章</button>`;
    storyFrame({
      chapter: CHAPTERS[6].title,
      text: `
        <p>第七章结束。</p>
        <p>${chapter7Outcome()}</p>
        <p>下一章将进入生育决策：备孕、产检、职业中断、月子中心、老人带娃和二胎压力。</p>
      `,
      choices: `
        ${lateStopLossChoice("止损，不继续扩大共同债务")}
        ${settleButton}
      `
    });
    bindLateStopLoss("第七章结束时，你选择不让债务继续绑定人生。");
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-next-chapter]")?.addEventListener("click", () => {
      state.chapter = 8;
      state.scene = "chapter8Start";
      saveState();
      render();
    });
  }
}

function bindChapter8Buttons() {
  document.querySelectorAll("[data-ch8]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch8.split(":");
      chapter8Choice(kind, value);
    });
  });
}

function renderChapter8() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "lateStopLossEnding") return renderLateStopLossEnding();

  if (state.scene === "chapter8Start") {
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>婚后第三年，医院候诊区的灯很白。屏幕上跳着号码，但你更在意手机里亲戚发来的消息。</p>
        <p>“年龄也不小了。” “房子有了，该要孩子了。” “早点生，老人还能帮。”</p>
        <p><b>${npc.name}</b>：“我们是不是该认真谈一次孩子？”</p>
      `,
      choices: `
        <button data-ch8="plan:checkup" type="button">先做检查和预算，再决定是否备孕</button>
        <button data-ch8="plan:natural" type="button">顺其自然，不把生活计划得太死</button>
        <button data-ch8="plan:delay" type="button">明确暂缓，等债务和关系更稳定</button>
        <button data-ch8="plan:refuse" type="button">坦白自己不想被生育时间表推着走</button>
      `
    });
    bindChapter8Buttons();
    return;
  }

  if (state.scene === "prenatalCheck") {
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>检查报告不是坏消息，却也不是童话。医生说要复查，要调整作息，也要考虑压力。</p>
        <p class="hint">${currentCaseLine("child") || childPressureText(npc, motive)}</p>
        <p>走廊里有人沉默，有人哭，有人打电话报喜。你突然意识到，生育从来不是一句“想要就要”。</p>
      `,
      choices: `
        <button data-ch8="check:together" type="button">要求 ${npc.name} 一起参与检查和沟通</button>
        <button data-ch8="check:solo" type="button">自己先扛下来，别让家里担心</button>
        <button data-ch8="check:parents" type="button">告诉双方父母，让他们帮忙安排</button>
        <button data-ch8="check:pause" type="button">暂停备孕，先处理身体和关系压力</button>
      `
    });
    bindChapter8Buttons();
    return;
  }

  if (state.scene === "careerInterrupt") {
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>公司开始新一轮调整。一个同事休完产假回来，工位已经被换到角落。</p>
        <p><b>${npc.name}</b>：“工作可以再找，孩子错过时间就错过了。”</p>
        <p>你听见这句话里的关心，也听见里面没有被计算的代价。</p>
      `,
      choices: `
        <button data-ch8="career:protect" type="button">写清职业保护、经济补偿和分工</button>
        <button data-ch8="career:sacrifice" type="button">接受阶段性牺牲，以家庭为先</button>
        <button data-ch8="career:partner" type="button">要求 ${npc.name} 同等调整职业计划</button>
        <button data-ch8="career:unclear" type="button">先怀上再说，计划赶不上变化</button>
      `
    });
    bindChapter8Buttons();
    return;
  }

  if (state.scene === "postpartumCare") {
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>月子中心、育儿嫂、老人来住、自己硬扛，每个方案都有人支持，也都有人反对。</p>
        <p>父母说：“别人都是这么过来的。”账单说：“不是每个人都过得起。”</p>
      `,
      choices: `
        ${choiceBtn('data-ch8="postpartum:center"', '选择月子中心或育儿嫂，用钱换恢复', { wealth: 6 })}
        ${choiceBtn('data-ch8="postpartum:parents"', '让老人来帮忙，省钱也安心')}
        ${choiceBtn('data-ch8="postpartum:rules"', '老人可以来，但先写清边界和分工')}
        ${choiceBtn('data-ch8="postpartum:endure"', '先忍一忍，大家都是为了孩子')}
      `
    });
    bindChapter8Buttons();
    return;
  }

  if (state.scene === "grandparentCare") {
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>孩子出生后，家里多了一种新的声音：哭声、奶瓶声、门铃声，还有长辈小声但密集的建议。</p>
        <p class="message">${childPressureText(npc, motive)}</p>
        <p>爱变得很忙，忙到每个人都觉得自己付出最多。</p>
      `,
      choices: `
        ${choiceBtn('data-ch8="care:contract"', '建立固定照护表，夜醒、接送、家务全写清')}
        ${choiceBtn('data-ch8="care:elder"', '主要依赖老人带娃，先过最难的一年')}
        ${choiceBtn('data-ch8="care:nursery"', '尽早托育，保住成年人的工作和边界', { eq: 7 })}
        ${choiceBtn('data-ch8="care:quit"', '一方退出职场，家庭系统先稳定')}
      `
    });
    bindChapter8Buttons();
    return;
  }

  if (state.scene === "schoolPressure") {
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>时间被压缩成接送表、疫苗本、托育费、兴趣班和入学材料。</p>
        <p>你开始意识到，孩子越长大，家庭系统越不只是吃饱穿暖，而是时间、钱、精力和情绪的长期调度。</p>
        <p>你没法提前知道每一次发烧、请假、账单和争吵会落在哪一天，但你可以决定自己还要保留多少力气。</p>
      `,
      choices: `
        <button data-ch8="school:routine" type="button">建立稳定日程，让家变成可运行系统</button>
        <button data-ch8="school:race" type="button">投入学区和培训，别让孩子输在起点</button>
        <button data-ch8="school:parents" type="button">继续依赖双方父母，换取喘息空间</button>
        <button data-ch8="school:self" type="button">先保护自己，孩子不该吞掉全部人生</button>
      `
    });
    bindChapter8Buttons();
    return;
  }

  if (state.scene === "chapter8End") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-next-chapter type="button">进入第九章</button>`;
    storyFrame({
      chapter: CHAPTERS[7].title,
      text: `
        <p>第八章结束。</p>
        <p>${chapter8Outcome()}</p>
        <p>下一章将进入更长的磨损：夜醒后的工作日、亲密消退、老人变老和七年之痒。</p>
      `,
      choices: `
        ${lateStopLossChoice("止损，不把育儿压力继续拖长")}
        ${settleButton}
      `
    });
    bindLateStopLoss("第八章结束时，你不再让育儿压力吞掉自己的边界。");
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-next-chapter]")?.addEventListener("click", () => {
      state.chapter = 9;
      state.scene = "chapter9Start";
      saveState();
      render();
    });
  }
}


  return { renderChapter4, renderChapter5, renderChapter6, renderChapter7, renderChapter8 };
}
