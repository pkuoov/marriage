function react(state, text) {
  state.lastReaction = text;
}

export function handleChapter2Choice(ctx, kind, value) {
  const { state, bumpFlag, applyCurrentCaseStage } = ctx;

  if (kind === "pay") {
    if (value === "treat") {
      bumpFlag("affection");
      react(state, "TA 接过你递出的账单时明显放松，嘴上说下次请你，眼神里却在重新估量你的付出边界。");
    }
    if (value === "aa") {
      bumpFlag("boundary");
      react(state, "服务员离开后，TA 笑着说“挺公平的”，但语气里有一瞬间的停顿。你知道这不是对错题，是筛选题。");
    }
    if (value === "decide") {
      bumpFlag("riskTolerance");
      react(state, "TA 很快替你们做了决定。你没有不舒服到想反驳，但也记下了：TA 习惯先占据节奏。");
    }
    if (value === "joke") {
      bumpFlag("reality");
      bumpFlag("suspicion");
      react(state, "TA 被你的玩笑逗笑了半秒，随后也试探回一句：“那要看你值不值得投。”空气忽然有了价格。");
    }
    state.scene = "shoppingGift";
  }
  if (kind === "gift") {
    if (value === "cheap") {
      bumpFlag("boundary");
      bumpFlag("affection");
      react(state, "TA 收下小礼物，说“这个刚好”。如果这句话是真心的，你们会轻松很多。");
    }
    if (value === "mid") {
      bumpFlag("giftPressure");
      bumpFlag("affection");
      react(state, "柜姐把包装袋递过来时，TA 的朋友笑着起哄。TA 没阻止，但也没有继续加码。");
    }
    if (value === "luxury") {
      bumpFlag("giftPressure", 2);
      bumpFlag("riskTolerance");
      react(state, "TA 说“太贵了吧”，手却没有把袋子推回来。你忽然分不清这是客气，还是训练有素的接受。");
    }
    if (value === "refuse") {
      bumpFlag("reality");
      bumpFlag("suspicion");
      react(state, "你说现在不适合送贵重礼物。TA 点头说理解，同行的朋友却安静了一下。");
    }
    state.scene = "valuesDate";
  }
  if (kind === "parents") {
    if (value === "smallFamily") {
      bumpFlag("boundary");
      react(state, "TA 低头搅了搅杯子，说“你把小家庭放前面，这点挺清楚的”。这句话像认可，也像记录。");
    }
    if (value === "urgent") {
      bumpFlag("reality");
      bumpFlag("parentDependency");
      react(state, "TA 立刻追问“那怎么判断谁家更急”。你们第一次意识到，公平不是一句话，是账本。");
    }
    if (value === "merge") {
      bumpFlag("parentDependency");
      react(state, "TA 听到“两个家庭融合”时明显顺了气，但你也看见未来的门被双方父母一起推开。");
    }
    if (value === "rules") {
      bumpFlag("reality");
      react(state, "TA 说你太理性，但没有回避这个话题。至少这一刻，问题被摆在了桌面上。");
    }
    state.scene = Math.random() < 0.45 ? "lifeShock" : "socialScene";
  }
  if (kind === "life") {
    if (value === "support") {
      bumpFlag("affection");
      bumpFlag("householdPressure");
      react(state, "TA 很快说谢谢，但也顺势把更多情绪放到你这边。你帮了忙，也承担了位置。");
    }
    if (value === "verify") {
      bumpFlag("reality");
      bumpFlag("suspicion");
      react(state, "你先问细节。TA 有点受伤，但还是补充了时间、金额和影响范围。真实生活开始露出颗粒。");
    }
    if (value === "boundary") {
      bumpFlag("boundary");
      react(state, "你表达关心，也拒绝立刻兜底。TA 沉默了一会儿，这个沉默比回答更有信息量。");
    }
    state.scene = "socialScene";
  }
  if (kind === "social") {
    if (value === "blend") {
      bumpFlag("affection");
      react(state, "TA 的朋友说你“挺给面子”。TA 笑得很自然，但你分不清 TA 开心的是你，还是你配合了场子。");
    }
    if (value === "observe") {
      bumpFlag("suspicion");
      react(state, "你少说多听，听见几句半开玩笑的话。TA 的圈子没有恶意，但边界感并不总在线。");
    }
    if (value === "refuse") {
      bumpFlag("boundary");
      react(state, "你拒绝继续加场。TA 说没关系，朋友却用“这么早就管上了？”把玩笑递了过来。");
    }
    if (value === "protect") {
      bumpFlag("boundary");
      bumpFlag("affection");
      react(state, "你没有扫兴，只是把不舒服说清楚。TA 如果接得住，这会是一次加分；接不住，就会开始扣分。");
    }
    state.scene = "communicationDate";
  }
  if (kind === "communication") {
    bumpFlag("communicationFriction");
    if (value === "direct") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你把消息频率和表达方式说清楚。TA 没有立刻高兴，但这次你们至少在谈同一个问题。");
    }
    if (value === "comfort") {
      bumpFlag("affection");
      bumpFlag("emotionalLabor");
      react(state, "你先安抚 TA 的不安，气氛很快软下来。只是你也感觉到，解释情绪的人好像总是你。");
    }
    if (value === "mirror") {
      bumpFlag("suspicion");
      react(state, "你用同样的冷淡回过去。TA 很快察觉到了，却把问题说成“你怎么也这样”。");
    }
    if (value === "delay") {
      bumpFlag("riskTolerance");
      bumpFlag("timeConflict");
      react(state, "你没有马上处理这件事。短期风平浪静，长期问题开始沉淀。");
    }
    state.scene = "timeConflict";
  }
  if (kind === "time") {
    if (value === "schedule") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你提出固定见面和独处时间。TA 说这很像排班，但也承认这样不容易互相消耗。");
    }
    if (value === "accommodate") {
      bumpFlag("affection");
      bumpFlag("emotionalLabor");
      bumpFlag("timeConflict");
      react(state, "你迁就了 TA 的时间表。TA 很感动，可你的生活开始被对方的空档切成碎片。");
    }
    if (value === "demand") {
      bumpFlag("boundary");
      bumpFlag("communicationFriction");
      react(state, "你要求对方也调整。TA 沉默了一会儿，说“我已经很忙了”，这句话背后藏着优先级。");
    }
    if (value === "test") {
      bumpFlag("suspicion");
      bumpFlag("riskTolerance");
      react(state, "你故意晚回消息观察反应。TA 反应比你预想中更大，你也知道这种试探会磨损信任。");
    }
    state.scene = "exBoundary";
  }
  if (kind === "ex") {
    if (value === "transparent") {
      bumpFlag("trust");
      bumpFlag("affection");
      react(state, "你们把前任和旧关系聊得不算舒服，但足够诚实。诚实不浪漫，却省下很多暗雷。");
    }
    if (value === "check") {
      bumpFlag("suspicion");
      bumpFlag("exBoundary");
      react(state, "你追问细节，TA 的回答开始变短。也许是累，也许是有些地方确实不想被照亮。");
    }
    if (value === "ignore") {
      bumpFlag("riskTolerance");
      react(state, "你决定不问。暧昧的和平保住了，但那个名字还留在你心里。");
    }
    if (value === "rule") {
      bumpFlag("boundary");
      bumpFlag("exBoundary");
      react(state, "你提出旧关系边界：不暧昧、不隐瞒、不借钱。TA 说你太具体，但没有反驳。");
    }
    state.scene = "pressureDate";
  }
  if (kind === "pressure") {
    if (value === "accept") {
      bumpFlag("affection");
      bumpFlag("riskTolerance");
      react(state, "TA 得到你的配合后明显亲近了一点。你也知道，亲近和让步有时长得很像。");
    }
    if (value === "reject") {
      bumpFlag("boundary");
      react(state, "TA 回了一个“好”。短短一个字，你看不出是尊重，还是把账记下了。");
    }
    if (value === "condition") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你没有拒绝，也没有白给。TA 开始认真听条件，关系终于从暧昧进入谈判。");
    }
    if (value === "confront") {
      bumpFlag("suspicion", 2);
      react(state, "你的质问让 TA 的表情变硬。真诚的人会解释，控制欲强的人会反过来说你想太多。");
    }
    if (value === "avoid") {
      bumpFlag("riskTolerance");
      bumpFlag("suspicion");
      react(state, "你把话题岔开，气氛保住了，问题也被顺手塞进了下一次争吵的抽屉。");
    }
    applyCurrentCaseStage("preParents");
    state.chapter = 3;
    state.scene = "chapter3Start";
  }
  return false;
}

export function handleChapter3Choice(ctx, kind, value) {
  const { state, bumpFlag } = ctx;

  if (kind === "meng") {
    if (value === "define") state.scene = "exclusiveTalk";
    if (value === "background") state.scene = "deepCheck";
    if (value === "slow") state.scene = "friendGroup";
    if (value === "other") state.scene = "friendGroup";
    return false;
  }

  if (kind === "exclusive") {
    if (value === "only") bumpFlag("affection");
    if (value === "honestTime") bumpFlag("boundary");
    if (value === "normal") bumpFlag("riskTolerance");
    if (value === "askBack") bumpFlag("suspicion");
    state.scene = "deepCheck";
  }

  if (kind === "check") {
    if (value === "mutual") {
      bumpFlag("boundary");
      bumpFlag("reality");
    }
    if (value === "secret") bumpFlag("suspicion");
    if (value === "tell") {
      bumpFlag("boundary");
      bumpFlag("affection");
    }
    if (value === "trust") bumpFlag("affection");
    state.scene = "friendGroup";
  }

  if (kind === "friend") {
    if (value === "blend") bumpFlag("affection");
    if (value === "observe") bumpFlag("suspicion");
    if (value === "pointOut") bumpFlag("boundary");
    if (value === "talkAfter") {
      bumpFlag("boundary");
      bumpFlag("affection");
    }
    if (value === "leave") bumpFlag("boundary", 2);
    state.scene = "publicRelationship";
  }

  if (kind === "public") {
    if (value === "post") {
      bumpFlag("publicPressure");
      bumpFlag("affection");
      react(state, "合照发出去以后，点赞来得很快。TA 很开心，但你也感觉关系被推到了更多人面前。");
    }
    if (value === "delay") {
      bumpFlag("boundary");
      react(state, "你说还想再等等。TA 表面说理解，手指却在屏幕上停了很久。");
    }
    if (value === "private") {
      bumpFlag("boundary");
      bumpFlag("suspicion");
      react(state, "你坚持关系先属于两个人。TA 问你是不是还没认定，问题突然从公开变成了忠诚。");
    }
    if (value === "askReason") {
      bumpFlag("reality");
      bumpFlag("communicationFriction");
      react(state, "你问 TA 为什么急着公开。TA 的答案里有爱，也有一点点给别人看的需要。");
    }
    state.scene = "intimacyBoundary";
  }

  if (kind === "intimacy") {
    if (value === "slow") {
      bumpFlag("boundary");
      react(state, "你说想慢一点。TA 如果真的尊重你，这句话不会降低关系温度。");
    }
    if (value === "follow") {
      bumpFlag("riskTolerance");
      bumpFlag("intimacyBoundary");
      react(state, "你顺着气氛往前走了一步。它不一定错，但你知道自己还没完全想清楚。");
    }
    if (value === "talk") {
      bumpFlag("reality");
      bumpFlag("affection");
      react(state, "你们把亲密、避孕、留宿和边界说得很具体。浪漫少了一点，安全感多了一点。");
    }
    if (value === "freeze") {
      bumpFlag("communicationFriction");
      bumpFlag("suspicion");
      react(state, "你没有说出口，只是变得僵硬。TA 察觉到了，却没有马上停下来问你。");
    }
    state.scene = "moneyEmotionHelp";
  }

  if (kind === "help") {
    if (value === "lend") {
      bumpFlag("riskTolerance");
      bumpFlag("emotionalLabor");
      react(state, "你帮了 TA。TA 很感激，但这种感激很快会变成下一次求助的先例。");
    }
    if (value === "contract") {
      bumpFlag("assetProtection");
      bumpFlag("reality");
      react(state, "你要求写清用途和归还时间。TA 有点尴尬，但真正可靠的人会明白这不是不爱。");
    }
    if (value === "refuse") {
      bumpFlag("boundary");
      bumpFlag("communicationFriction");
      react(state, "你拒绝了。TA 说“没事”，但语气里那点失望很真实，也很有用。");
    }
    if (value === "emotion") {
      bumpFlag("emotionalLabor", 2);
      bumpFlag("affection");
      react(state, "你没出钱，但花了很长时间陪 TA 消化情绪。你忽然意识到，情绪兜底也是一种转账。");
    }
    state.scene = "parentsShadow";
  }

  if (kind === "parents") {
    if (value === "boundary") bumpFlag("boundary");
    if (value === "pretty") bumpFlag("riskTolerance");
    if (value === "truth") bumpFlag("reality");
    if (value === "delegate") bumpFlag("parentDependency");
    state.scene = "package";
  }

  if (kind === "package") {
    if (value === "legal") bumpFlag("reality");
    if (value === "parents") bumpFlag("parentDependency");
    if (value === "market") {
      bumpFlag("reality");
      bumpFlag("weddingPressure");
    }
    if (value === "none") bumpFlag("boundary");
    if (value === "together") bumpFlag("affection");
    state.scene = "chapter3Pressure";
  }

  if (kind === "finalPressure") {
    if (value === "accept") bumpFlag("riskTolerance");
    if (value === "refuse") bumpFlag("boundary");
    if (value === "condition") {
      bumpFlag("boundary");
      bumpFlag("reality");
    }
    if (value === "askBack") {
      bumpFlag("boundary");
      bumpFlag("suspicion");
    }
    if (value === "pause") bumpFlag("suspicion", 2);
    state.scene = "chapter3End";
  }
  return false;
}

export function handleChapter4Choice(ctx, kind, value) {
  const {
    state,
    bumpFlag,
    applyCurrentCaseStage,
    shouldOfferSecondaryDecision,
    currentNpc,
    getSeed,
    clampBurst,
    addLog,
    endPrimaryRelationship
  } = ctx;

  if (kind === "brief") {
    if (value === "redLines") {
      bumpFlag("boundary");
      bumpFlag("reality");
    }
    if (value === "agency") bumpFlag("agencyControl");
    if (value === "private") bumpFlag("affection");
    if (value === "delay") bumpFlag("suspicion");
    applyCurrentCaseStage("marriageTalk");
    state.scene = shouldOfferSecondaryDecision() ? "secondaryMessage" : "bridePrice";
  }

  if (kind === "secondary") {
    const primary = currentNpc();
    const seed = primary ? getSeed(primary.id) : null;
    if (value === "reply") {
      bumpFlag("suspicion");
      if (seed) seed.motiveBurst = clampBurst((seed.motiveBurst ?? 0) + 10);
      addLog("你回复了观察对象，主线关系的排他压力上升。", "关系压力");
    }
    if (value === "ignore") {
      bumpFlag("boundary");
      if (seed) seed.motiveBurst = clampBurst((seed.motiveBurst ?? 0) + 3);
      addLog("你没有回复观察对象，但这条消息改变了你对选择的感受。", "关系压力");
    }
    if (value === "tell") {
      bumpFlag("reality");
      bumpFlag("affection");
      if (seed) seed.motiveBurst = clampBurst((seed.motiveBurst ?? 0) - 4);
      addLog("你把观察对象的消息告诉了当前对象，关系进入更清楚的谈判。", "坦白");
    }
    if (value === "switch") {
      endPrimaryRelationship("第四章谈婚论嫁开始前，你选择切换到观察对象。");
      return true;
    }
    state.secondaryMessageHandled = true;
    state.scene = "bridePrice";
  }

  if (kind === "bridePrice") {
    const npc = currentNpc();
    if (npc?.id === "he") bumpFlag("siblingPressure");
    if (npc?.id === "chen") {
      bumpFlag("phoenixAmbition");
      bumpFlag("povertyStress");
    }
    if (value === "market") {
      bumpFlag("reality");
      bumpFlag("weddingPressure");
      react(state, "孟姐把行情表投到屏幕上，双方父母都安静了些。数字让争吵变冷，也让感情变硬。");
    }
    if (value === "symbolic") {
      bumpFlag("boundary");
      bumpFlag("affection");
      react(state, "你提出彩礼象征化。TA 看向父母，又看向你，这一眼决定了 TA 是伴侣，还是传话筒。");
    }
    if (value === "high") {
      bumpFlag("parentConflict");
      bumpFlag("weddingPressure");
      react(state, "高规格让一边父母松了口气，另一边父母开始计算。婚事第一次像一场筹资会。");
    }
    if (value === "postpone") {
      bumpFlag("suspicion");
      react(state, "你暂缓数字。所有人嘴上说可以理解，但你能感觉到，他们开始各自回家做第二套方案。");
    }
    state.scene = "houseName";
  }

  if (kind === "house") {
    if (value === "contribution") {
      bumpFlag("assetProtection");
      bumpFlag("reality");
    }
    if (value === "both") {
      bumpFlag("affection");
      bumpFlag("weddingPressure");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
    }
    if (value === "rent") {
      bumpFlag("boundary");
      bumpFlag("assetProtection");
    }
    state.scene = "parentsMeeting";
  }

  if (kind === "meeting") {
    if (value === "partner") {
      bumpFlag("affection");
      bumpFlag("partnerParentApproval");
      react(state, "饭桌上，TA 终于替你挡了一句。对方父母没有立刻满意，但他们第一次看见你们是一个小队。");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("partnerParentApproval");
      react(state, "场面被安抚住了。父母觉得你“懂事”，但你也感觉小家庭的边界往后退了一步。");
    }
    if (value === "pause") {
      bumpFlag("boundary");
      bumpFlag("partnerParentApproval", -1);
      react(state, "你暂停了谈话。有人脸色不好看，但所有人都知道：你不是会被场面推着走的人。");
    }
    if (value === "mediate") {
      bumpFlag("agencyControl");
      react(state, "孟姐接过话头，场面好看了很多。只是你也意识到，婚介能调停气氛，不能替你过日子。");
    }
    if (value !== "pause" && value !== "mediate") bumpFlag("parentConflict");
    state.scene = "parentsSecond";
  }

  if (kind === "meeting2") {
    if (value === "clear") {
      bumpFlag("boundary");
      bumpFlag("reality");
      bumpFlag("partnerParentApproval");
      react(state, "第二次见面，你把话说得更具体。父母不一定喜欢，但他们开始知道你的规则在哪里。");
    }
    if (value === "yield") {
      bumpFlag("parentDependency");
      bumpFlag("partnerParentApproval", 2);
      react(state, "对方父母明显满意了。只是那种满意更像“这个人好商量”，而不一定是尊重。");
    }
    if (value === "counter") {
      bumpFlag("parentConflict", 2);
      bumpFlag("suspicion");
      react(state, "你反问回去以后，桌上安静了两秒。TA 的态度成了这一幕真正的答案。");
    }
    if (value === "partner") {
      bumpFlag("affection");
      bumpFlag("partnerParentApproval");
      react(state, "你要求 TA 出面。TA 如果愿意承担，婚姻才不是你一个人去闯对方家庭。");
    }
    state.scene = "agreement";
  }

  if (kind === "agreement") {
    if (value === "mutual") {
      bumpFlag("assetProtection");
      bumpFlag("reality");
    }
    if (value === "romance") bumpFlag("riskTolerance");
    if (value === "lawyer") {
      bumpFlag("assetProtection", 2);
      bumpFlag("suspicion");
    }
    if (value === "delay") bumpFlag("weddingPressure");
    state.scene = "motiveReveal";
  }

  if (kind === "reveal") {
    if (value === "accept") {
      bumpFlag("riskTolerance", 2);
      bumpFlag("affection");
    }
    if (value === "condition") {
      bumpFlag("boundary");
      bumpFlag("reality");
    }
    if (value === "confront") {
      bumpFlag("suspicion", 2);
      bumpFlag("parentConflict");
    }
    if (value === "break") {
      bumpFlag("boundary", 2);
      bumpFlag("suspicion");
    }
    state.scene = "chapter4End";
  }
  return false;
}

export function handleChapter5Choice(ctx, kind, value) {
  const { state, bumpFlag, applyCurrentCaseStage } = ctx;

  if (kind === "plan") {
    if (value === "simple") {
      bumpFlag("boundary");
      bumpFlag("assetProtection");
      react(state, "你提出小型婚礼后，婚庆报价立刻轻了不少，长辈的脸色却重了一点。");
    }
    if (value === "grand") {
      bumpFlag("weddingPressure", 2);
      bumpFlag("parentConflict");
      react(state, "大办的方案让双方父母都觉得体面，只有你们的预算表开始变得难看。");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("weddingPressure");
      react(state, "父母接过主导权后效率很高，也顺手把很多“你们自己决定”改成了“听我们的”。");
    }
    if (value === "private") {
      bumpFlag("affection");
      react(state, "你和 TA 先私下定原则。至少这一刻，婚礼还没有完全变成两个家庭的项目。");
    }
    applyCurrentCaseStage("wedding");
    state.scene = "guestList";
  }

  if (kind === "guest") {
    if (value === "rules") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你把宾客规则写进表格，亲戚开始抱怨“不近人情”，但名单终于停止膨胀。");
    }
    if (value === "face") {
      bumpFlag("weddingPressure");
      bumpFlag("parentConflict");
      react(state, "名单照顾了面子，桌数也照顾了酒店营收。TA 说热闹一点好，你只看见预算在发热。");
    }
    if (value === "cut") {
      bumpFlag("assetProtection");
      bumpFlag("parentConflict");
      react(state, "你砍掉超预算名单后，父母群沉默了一阵。沉默不是同意，是下一轮谈判的蓄力。");
    }
    if (value === "agency") {
      bumpFlag("agencyControl");
      react(state, "婚介和婚庆接手协调后，冲突被包装得更专业，费用也更专业地上涨。");
    }
    state.scene = "weddingCustoms";
  }

  if (kind === "customs") {
    if (value === "ban") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你提前禁止婚闹和低俗游戏。有人说你开不起玩笑，但真正爱你的人不会把羞辱包装成热闹。");
    }
    if (value === "redPacket") {
      bumpFlag("weddingPressure");
      bumpFlag("parentConflict");
      react(state, "红包金额被一层层加码，长辈说这是礼数。你听见的却是：体面正在用现金计价。");
    }
    if (value === "playAlong") {
      bumpFlag("riskTolerance");
      bumpFlag("publicPressure");
      react(state, "你选择配合热闹。场面很顺，但有些不舒服被笑声盖过去了。");
    }
    if (value === "partner") {
      bumpFlag("affection");
      bumpFlag("boundary");
      react(state, "你让 TA 去挡不合适的流程。TA 站出来的那一刻，比任何誓词都更像承诺。");
    }
    state.scene = "budget";
  }

  if (kind === "budget") {
    if (value === "split") {
      bumpFlag("reality");
      bumpFlag("assetProtection");
      react(state, "你要求费用写清楚。TA 没有反对，但双方父母第一次听见“婚礼也要算账”时都不太习惯。");
    }
    if (value === "loan") {
      bumpFlag("riskTolerance", 2);
      bumpFlag("weddingPressure");
      react(state, "借钱办婚礼让方案立刻漂亮起来。只是那种漂亮，是用婚后的现金流预支的。");
    }
    if (value === "downgrade") {
      bumpFlag("boundary");
      bumpFlag("parentConflict");
      react(state, "你降级了方案。婚庆说还能办得好看，亲戚说怕不好看。你终于听出谁在乎什么。");
    }
    if (value === "partner") {
      bumpFlag("affection");
      react(state, "你让 TA 一起面对父母。TA 如果只让你做坏人，这场婚礼就已经给出了答案。");
    }
    state.scene = "exMessage";
  }

  if (kind === "ex") {
    if (value === "ask") {
      bumpFlag("suspicion");
      react(state, "你直接问了。TA 的第一反应不是解释事实，而是问你为什么相信陌生人。");
    }
    if (value === "ignore") {
      bumpFlag("riskTolerance");
      react(state, "你把消息压下去，婚礼流程继续推进。那条消息却像一根针，留在你心里。");
    }
    if (value === "pause") {
      bumpFlag("boundary", 2);
      bumpFlag("suspicion");
      react(state, "你提出延期，父母和酒店都炸了。TA 看你的眼神里，第一次同时有害怕和不满。");
    }
    if (value === "verify") {
      bumpFlag("reality");
      bumpFlag("suspicion");
      react(state, "你开始核实消息来源。真相还没出来，但 TA 已经知道你不会在婚礼倒计时里自动放弃判断。");
    }
    state.scene = "weddingEve";
  }

  if (kind === "eve") {
    if (value === "continue") {
      bumpFlag("riskTolerance");
      bumpFlag("weddingPressure");
      react(state, "你决定继续。流程表没有被打乱，只有那些没说透的问题跟着你一起走向舞台。");
    }
    if (value === "condition") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你把条件写下来。TA 说你太清醒，可你知道清醒不是爱情的反义词。");
    }
    if (value === "delay") {
      bumpFlag("boundary", 2);
      bumpFlag("parentConflict");
      react(state, "延期像一颗石头扔进亲戚群。水花很大，但你终于看见水底到底有什么。");
    }
    if (value === "cancel") {
      bumpFlag("boundary", 3);
      bumpFlag("suspicion");
      react(state, "你取消婚礼。那一刻所有人都在谈损失，只有你在确认自己还没有损失一生。");
      state.scene = "weddingCancelledEnding";
      return false;
    }
    state.scene = "chapter5End";
  }
  return false;
}

export function handleChapter6Choice(ctx, kind, value) {
  const { state, bumpFlag, applyCurrentCaseStage } = ctx;

  if (kind === "account") {
    if (value === "clear") {
      bumpFlag("assetProtection");
      bumpFlag("reality");
      react(state, "账户规则写清后，钱没有变多，但吵架时少了一块最容易被拿来翻旧账的地方。");
    }
    if (value === "together") {
      bumpFlag("affection");
      bumpFlag("householdPressure");
      react(state, "工资放在一起让“我们是一家人”的感觉很强，也让每一笔私人消费都开始需要解释。");
    }
    if (value === "parent") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
      react(state, "父母帮你们规划得很细，细到你们像两个被托管的大人。");
    }
    if (value === "separate") {
      bumpFlag("boundary");
      react(state, "你坚持经济先分开。TA 说理解，但“你是不是还没把我当家人”这句话已经在空气里了。");
    }
    applyCurrentCaseStage("firstYear");
    state.scene = "chores";
  }

  if (kind === "chores") {
    if (value === "schedule") {
      bumpFlag("reality");
      bumpFlag("boundary");
      react(state, "家务表贴上冰箱后，浪漫少了点，但垃圾终于不再靠谁看不下去谁倒。");
    }
    if (value === "natural") {
      bumpFlag("riskTolerance");
      react(state, "自然磨合听起来温柔，执行起来却常常变成更能忍的人多做一点。");
    }
    if (value === "outsourcing") {
      bumpFlag("debtPressure");
      bumpFlag("householdPressure", -1);
      react(state, "外包让家里干净了，也让账单变厚了。你们买到了一点喘息。");
    }
    if (value === "endure") {
      bumpFlag("householdPressure", 2);
      react(state, "你忍了下来。房间表面安静，心里的脏衣篮却越堆越高。");
    }
    state.scene = "springFestival";
  }

  if (kind === "festival") {
    if (value === "alternate") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "轮流过年的规则让两边都不算满意，但至少不再每年重新打一场仗。");
    }
    if (value === "partnerHome") {
      bumpFlag("parentConflict");
      bumpFlag("parentDependency");
      react(state, "你去了 TA 家，TA 父母很高兴。你父母在电话里说没事，语气却不像没事。");
    }
    if (value === "ownHome") {
      bumpFlag("parentConflict");
      react(state, "你回了自己家。TA 嘴上说尊重，晚饭后却明显少说了几句话。");
    }
    if (value === "travel") {
      bumpFlag("boundary", 2);
      bumpFlag("parentConflict");
      react(state, "你们选择旅行过年。朋友圈照片很好看，双方父母的失落也很真实。");
    }
    state.scene = "parentsVisit";
  }

  if (kind === "visit") {
    if (value === "rules") {
      bumpFlag("boundary");
      bumpFlag("parentConflict");
      react(state, "探访规则一说出口，老人先委屈了。但你的家终于重新有了门。");
    }
    if (value === "welcome") {
      bumpFlag("parentDependency");
      bumpFlag("householdPressure");
      react(state, "你热情接待，家里很热闹。热闹到你开始怀念只有两个人的安静。");
    }
    if (value === "partner") {
      bumpFlag("affection");
      react(state, "你让 TA 去沟通。TA 愿不愿意把话说在自己父母面前，是婚后边界的硬指标。");
    }
    if (value === "moveOut") {
      bumpFlag("assetProtection");
      bumpFlag("boundary");
      react(state, "搬出去的念头一出现，关系里的真实问题就不再能被一句“忍忍”压住。");
    }
    state.scene = "intimacyChild";
  }

  if (kind === "child") {
    if (value === "plan") {
      bumpFlag("reality");
      bumpFlag("boundary");
      react(state, "你把孩子问题拆成钱、身体、职业和照护。TA 第一次意识到“想要”不是计划。");
    }
    if (value === "now") {
      bumpFlag("riskTolerance");
      bumpFlag("householdPressure");
      react(state, "顺其自然让长辈很开心，也让你们把很多具体问题留给了运气。");
    }
    if (value === "delay") {
      bumpFlag("boundary");
      bumpFlag("parentConflict");
      react(state, "你明确暂缓。亲戚的声音变大了，但你终于把身体和人生重新拿回自己手里。");
    }
    if (value === "avoid") {
      bumpFlag("suspicion");
      react(state, "你回避了话题。和平保住了几天，焦虑却没有真正离开。");
    }
    state.scene = "firstCrisis";
  }

  if (kind === "crisis") {
    if (value === "repair") {
      bumpFlag("affection", 2);
      bumpFlag("reality");
      react(state, "你们坐下来复盘。吵架没有变少，但第一次有了修复路径。");
    }
    if (value === "silent") {
      bumpFlag("householdPressure", 2);
      bumpFlag("riskTolerance");
      react(state, "冷处理让当晚过去了，也让下一次爆发多了一层旧账。");
    }
    if (value === "parents") {
      bumpFlag("parentConflict", 2);
      bumpFlag("parentDependency");
      react(state, "父母评理很快变成两家评理。你们的问题被放大成了两个家庭的输赢。");
    }
    if (value === "separate") {
      bumpFlag("boundary", 2);
      bumpFlag("suspicion");
      react(state, "短暂分居让你喘了一口气。TA 终于意识到，你不是只能留在原地吵。");
    }
    state.scene = "chapter6End";
  }
  return false;
}

export function handleChapter7Choice(ctx, kind, value) {
  const { state, bumpFlag, applyCurrentCaseStage } = ctx;

  if (kind === "route") {
    if (value === "rent") {
      bumpFlag("boundary");
      bumpFlag("assetProtection");
      react(state, "你选择继续租房。父母觉得你们不稳定，但现金流终于没有被月供锁死。");
    }
    if (value === "secondHand") {
      bumpFlag("reality");
      bumpFlag("debtPressure");
      react(state, "二手房看得见摸得着，价格也实实在在压上来。你们买的是确定性，也买了压力。");
    }
    if (value === "newBuild") {
      bumpFlag("riskTolerance", 2);
      bumpFlag("debtPressure", 2);
      react(state, "期房沙盘很漂亮，合同很厚。你知道这一步是在和未来对赌。");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
      react(state, "父母出了首付，也自然带来了意见。钱进入小家庭时，很少只是一笔钱。");
    }
    applyCurrentCaseStage("housingDebt");
    state.scene = "downPayment";
  }

  if (kind === "down") {
    if (value === "contract") {
      bumpFlag("assetProtection", 2);
      bumpFlag("reality");
      react(state, "你把出资、还贷和产权写清。销售催你们快点签，你却第一次不怕慢。");
    }
    if (value === "trust") {
      bumpFlag("riskTolerance");
      bumpFlag("debtPressure");
      react(state, "你选择不算太细。气氛温柔了，未来争议也被温柔地埋进了合同外。");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
      react(state, "父母开始讨论楼层、朝向和房本名字。你们像买家，又像被安排的执行人。");
    }
    if (value === "pause") {
      bumpFlag("boundary");
      bumpFlag("suspicion");
      react(state, "你暂停签字。TA 有点急，销售也有点急。急的人越多，你越知道这一步不能糊涂。");
    }
    state.scene = "incomeShock";
  }

  if (kind === "income") {
    if (value === "cut") {
      bumpFlag("reality");
      bumpFlag("assetProtection");
      react(state, "你重做现金流，砍掉很多消费。生活变窄了，但风险终于有了边界。");
    }
    if (value === "borrow") {
      bumpFlag("debtPressure", 2);
      bumpFlag("parentConflict");
      react(state, "父母愿意借钱，却也开始更频繁地问房子和你们的生活。债务带来了关心，也带来了入口。");
    }
    if (value === "hide") {
      bumpFlag("suspicion", 2);
      bumpFlag("householdPressure");
      react(state, "你选择自己扛。表面上没有争吵，关系里却多了一块不能被碰的压力。");
    }
    if (value === "sell") {
      bumpFlag("boundary");
      bumpFlag("parentConflict");
      react(state, "你提出止损，所有人第一反应都是“都到这一步了”。沉没成本开始替他们说话。");
    }
    state.scene = "relativesLoan";
  }

  if (kind === "relative") {
    if (value === "refuse") {
      bumpFlag("boundary");
      bumpFlag("parentConflict");
      react(state, "你拒绝亲戚借钱。对方说你变了，你心里清楚：你只是终于知道自己背着月供。");
    }
    if (value === "lend") {
      bumpFlag("debtPressure");
      bumpFlag("riskTolerance");
      react(state, "你借了一部分。亲戚关系保住了，家庭现金流又薄了一层。");
    }
    if (value === "contract") {
      bumpFlag("reality");
      bumpFlag("assetProtection");
      react(state, "借条写出来以后，亲情忽然有点尴尬。但尴尬总比未来翻脸便宜。");
    }
    if (value === "partner") {
      bumpFlag("affection");
      react(state, "你让 TA 一起出面。共同债务里的共同，不该只在签字时出现。");
    }
    state.scene = "deliveryRisk";
  }

  if (kind === "delivery") {
    if (value === "rights") {
      bumpFlag("reality");
      bumpFlag("assetProtection");
      react(state, "你开始收集证据和合同条款。焦虑没有立刻消失，但你不再只靠情绪等消息。");
    }
    if (value === "endure") {
      bumpFlag("debtPressure", 2);
      bumpFlag("riskTolerance");
      react(state, "你们决定再等等。等待看似没有成本，实际上每天都在消耗现金流和信心。");
    }
    if (value === "parents") {
      bumpFlag("parentConflict", 2);
      bumpFlag("parentDependency");
      react(state, "父母加入后，信息多了，声音也多了。每个人都想帮忙，每个人都在扩大压力场。");
    }
    if (value === "exit") {
      bumpFlag("boundary", 2);
      bumpFlag("suspicion");
      react(state, "你准备退出方案。TA 觉得你悲观，你觉得这是成年人对最坏结果的尊重。");
    }
    state.scene = "debtTalk";
  }

  if (kind === "debt") {
    if (value === "clear") {
      bumpFlag("assetProtection", 2);
      bumpFlag("reality");
      react(state, "你拒绝模糊债务。那一刻感情没有消失，只是终于不能替合同背书。");
    }
    if (value === "together") {
      bumpFlag("affection");
      bumpFlag("debtPressure");
      react(state, "你们选择一起扛。这个决定很亲密，也很沉重，因为债务不会因为相爱就少算利息。");
    }
    if (value === "avoid") {
      bumpFlag("suspicion");
      bumpFlag("debtPressure");
      react(state, "你们暂时不谈。账单不会催你们沟通，但它会准时扣款。");
    }
    if (value === "separate") {
      bumpFlag("boundary", 2);
      bumpFlag("assetProtection");
      react(state, "你把资产和债务分开。TA 说你在准备退路，你想：没有退路的人才最容易被困住。");
    }
    state.scene = "chapter7End";
  }
  return false;
}

export function handleChapter8Choice(ctx, kind, value) {
  const { state, bumpFlag, applyCurrentCaseStage } = ctx;

  if (kind === "plan") {
    if (value === "checkup") {
      bumpFlag("reality");
      bumpFlag("boundary");
      react(state, "你把备孕变成检查和预算，而不是一句祝福。TA 有些紧张，但终于开始面对现实。");
    }
    if (value === "natural") {
      bumpFlag("riskTolerance");
      bumpFlag("childPressure");
      react(state, "顺其自然让话题轻松了很多，也把真正困难的分工留给了以后。");
    }
    if (value === "delay") {
      bumpFlag("boundary", 2);
      bumpFlag("parentConflict");
      react(state, "你明确暂缓。长辈说你想太多，但你的身体、职业和关系都不是他们替你承担。");
    }
    if (value === "refuse") {
      bumpFlag("boundary", 3);
      bumpFlag("suspicion");
      react(state, "你坦白不想被时间表推着走。TA 第一次意识到，孩子不是默认选项。");
    }
    applyCurrentCaseStage("child");
    state.scene = "prenatalCheck";
  }

  if (kind === "check") {
    if (value === "together") {
      bumpFlag("affection");
      bumpFlag("reality");
      react(state, "TA 陪你一起听医生解释。共同面对报告，比任何“我支持你”都更实在。");
    }
    if (value === "solo") {
      bumpFlag("householdPressure");
      bumpFlag("childPressure");
      react(state, "你自己扛下检查和复查。没人吵你，但孤独感也没有人替你分担。");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
      react(state, "父母很快安排了医生、偏方和经验。帮助来了，控制也跟着来了。");
    }
    if (value === "pause") {
      bumpFlag("boundary");
      bumpFlag("suspicion");
      react(state, "你暂停备孕。TA 沉默很久，这个沉默里有担心，也有不甘。");
    }
    state.scene = "careerInterrupt";
  }

  if (kind === "career") {
    if (value === "protect") {
      bumpFlag("assetProtection");
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你要求职业保护和补偿。TA 说你太现实，但生育后被现实追债的人往往不是说这话的人。");
    }
    if (value === "sacrifice") {
      bumpFlag("childPressure", 2);
      bumpFlag("householdPressure");
      react(state, "你接受阶段性牺牲。所有人都说你伟大，只有你的简历安静地空了一段。");
    }
    if (value === "partner") {
      bumpFlag("affection");
      bumpFlag("reality");
      react(state, "你要求 TA 同等调整职业计划。TA 愣了一下，仿佛第一次发现父母身份不是单人职业风险。");
    }
    if (value === "unclear") {
      bumpFlag("riskTolerance");
      bumpFlag("childPressure");
      react(state, "你们先把计划放到以后。以后这个词很柔软，也很会欠债。");
    }
    state.scene = "postpartumCare";
  }

  if (kind === "postpartum") {
    if (value === "center") {
      bumpFlag("debtPressure");
      bumpFlag("householdPressure", -1);
      react(state, "月子中心很贵，但你终于得到专业照护。钱花出去了，身体也被当成了需要恢复的系统。");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict", 2);
      react(state, "老人来帮忙后，家里多了手，也多了标准。每个人都说为孩子好。");
    }
    if (value === "rules") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "你先写清边界和分工。长辈不太舒服，但你知道产后最怕的就是临场讲道理。");
    }
    if (value === "endure") {
      bumpFlag("childPressure", 2);
      bumpFlag("householdPressure", 2);
      react(state, "你选择忍。忍耐被夸成懂事，疲惫却没有因此减少。");
    }
    state.scene = "grandparentCare";
  }

  if (kind === "care") {
    if (value === "contract") {
      bumpFlag("boundary");
      bumpFlag("reality");
      react(state, "照护表让夜醒、奶瓶、接送和家务终于有了名字。没有名字的劳动，最容易消失。");
    }
    if (value === "elder") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
      react(state, "老人带娃让你们能喘口气，也让育儿观念每天都在家里开会。");
    }
    if (value === "nursery") {
      bumpFlag("debtPressure");
      bumpFlag("assetProtection");
      react(state, "托育费很疼，但它换回了成年人的工作时间和一点点自我。");
    }
    if (value === "quit") {
      bumpFlag("childPressure", 2);
      bumpFlag("householdPressure");
      react(state, "一方退出职场后，家庭短期稳定了。长期风险也从桌面下伸出了手。");
    }
    state.scene = "schoolPressure";
  }

  if (kind === "school") {
    if (value === "routine") {
      bumpFlag("reality");
      bumpFlag("affection");
      react(state, "稳定日程让家终于像系统一样运行。它不浪漫，但救命。");
    }
    if (value === "race") {
      bumpFlag("childPressure", 2);
      bumpFlag("debtPressure");
      react(state, "你们进入起跑线竞赛。孩子还小，账单和焦虑已经先长大了。");
    }
    if (value === "parents") {
      bumpFlag("parentConflict", 2);
      bumpFlag("parentDependency");
      react(state, "继续依赖父母换来了喘息，也让你们的小家庭边界再一次被打开。");
    }
    if (value === "self") {
      bumpFlag("boundary", 2);
      bumpFlag("assetProtection");
      react(state, "你先保护自己。有人会说你自私，但一个被榨干的大人很难给孩子稳定的爱。");
    }
    state.scene = "chapter8End";
  }
  return false;
}

export function handleChapter9Choice(ctx, kind, value) {
  const { state, bumpFlag } = ctx;

  if (kind === "night") {
    if (value === "schedule") {
      bumpFlag("reality");
      bumpFlag("affection");
    }
    if (value === "endure") {
      bumpFlag("midlifePressure", 2);
      bumpFlag("householdPressure");
    }
    if (value === "outsource") {
      bumpFlag("debtPressure");
      bumpFlag("childPressure", -1);
    }
    if (value === "escape") {
      bumpFlag("suspicion");
      bumpFlag("midlifePressure", 2);
    }
    state.scene = "intimacyFade";
  }

  if (kind === "intimacy") {
    if (value === "talk") {
      bumpFlag("affection", 2);
      bumpFlag("boundary");
    }
    if (value === "pretend") {
      bumpFlag("midlifePressure", 2);
      bumpFlag("riskTolerance");
    }
    if (value === "check") {
      bumpFlag("suspicion");
      bumpFlag("reality");
    }
    if (value === "separate") {
      bumpFlag("boundary", 2);
      bumpFlag("assetProtection");
    }
    state.scene = "careerGap";
  }

  if (kind === "career") {
    if (value === "restart") {
      bumpFlag("assetProtection");
      bumpFlag("boundary");
    }
    if (value === "family") {
      bumpFlag("childPressure");
      bumpFlag("midlifePressure");
    }
    if (value === "partner") {
      bumpFlag("reality");
      bumpFlag("affection");
    }
    if (value === "resent") {
      bumpFlag("suspicion");
      bumpFlag("midlifePressure", 2);
    }
    state.scene = "oldParents";
  }

  if (kind === "elder") {
    if (value === "rule") {
      bumpFlag("boundary");
      bumpFlag("reality");
    }
    if (value === "take") {
      bumpFlag("parentDependency");
      bumpFlag("householdPressure");
    }
    if (value === "money") {
      bumpFlag("debtPressure");
      bumpFlag("parentConflict");
    }
    if (value === "refuse") {
      bumpFlag("boundary", 2);
      bumpFlag("parentConflict");
    }
    state.scene = "sevenYearTalk";
  }

  if (kind === "seven") {
    if (value === "repair") {
      bumpFlag("affection", 2);
      bumpFlag("reality");
    }
    if (value === "roommates") {
      bumpFlag("midlifePressure", 2);
    }
    if (value === "trial") {
      bumpFlag("boundary", 2);
      bumpFlag("suspicion");
    }
    if (value === "lawyer") {
      bumpFlag("assetProtection", 2);
      bumpFlag("boundary");
    }
    state.scene = "chapter9End";
  }
  return false;
}

export function handleChapter10Choice(ctx, kind, value) {
  const { state, bumpFlag } = ctx;

  if (kind === "school") {
    if (value === "nearby") {
      bumpFlag("reality");
      bumpFlag("boundary");
    }
    if (value === "district") {
      bumpFlag("debtPressure", 2);
      bumpFlag("educationPressure", 2);
    }
    if (value === "private") {
      bumpFlag("debtPressure");
      bumpFlag("educationPressure");
    }
    if (value === "parents") {
      bumpFlag("parentDependency");
      bumpFlag("parentConflict");
    }
    state.scene = "parentGroup";
  }

  if (kind === "group") {
    if (value === "mute") {
      bumpFlag("boundary");
      bumpFlag("educationPressure", -1);
    }
    if (value === "active") {
      bumpFlag("educationPressure");
      bumpFlag("householdPressure");
    }
    if (value === "compare") {
      bumpFlag("educationPressure", 2);
      bumpFlag("midlifePressure");
    }
    if (value === "partner") {
      bumpFlag("affection");
      bumpFlag("reality");
    }
    state.scene = "interestClass";
  }

  if (kind === "class") {
    if (value === "one") {
      bumpFlag("reality");
      bumpFlag("boundary");
    }
    if (value === "full") {
      bumpFlag("educationPressure", 2);
      bumpFlag("debtPressure");
    }
    if (value === "none") {
      bumpFlag("boundary", 2);
      bumpFlag("parentConflict");
    }
    if (value === "child") {
      bumpFlag("affection");
      bumpFlag("educationPressure", -1);
    }
    state.scene = "tenYearMirror";
  }

  if (kind === "mirror") {
    if (value === "together") {
      bumpFlag("affection", 2);
      bumpFlag("reality");
    }
    if (value === "separate") {
      bumpFlag("boundary", 2);
      bumpFlag("assetProtection");
    }
    if (value === "endure") {
      bumpFlag("midlifePressure", 2);
      bumpFlag("riskTolerance");
    }
    if (value === "restart") {
      bumpFlag("boundary", 3);
      bumpFlag("assetProtection");
    }
    state.scene = "chapter10End";
  }
  return false;
}
