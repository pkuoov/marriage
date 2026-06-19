import {
  CHAPTERS,
  HIDDEN_TYPES,
  MOTIVES,
  NPCS,
  PACKAGING_CHOICES,
  QUESTIONNAIRE
} from "./story.js?v=0.14.0";

export function createEarlyChapterRenderers(ctx) {
  const {
    state,
    storyFrame,
    saveState,
    render,
    choosePackaging,
    answerQuestion,
    toggleFirstDate,
    startFirstDates,
    completeFirstDates,
    selectPrimary,
    selectSecondary,
    getNpc,
    getSeed,
    visibleCaseLine,
    currentNpc,
    motiveForCurrent,
    currentCaseLine,
    chapter2Choice,
    chapter3Choice,
    canStopLoss,
    endPrimaryRelationship,
    setScreen,
    settleRunExperience,
    totalPoints,
    choiceBtn
  } = ctx;

function renderChapter1() {
  if (state.scene === "intro") {
    storyFrame({
      chapter: CHAPTERS[0].title,
      text: `
        <p>你二十九岁那年，手机里同时出现了三条消息。</p>
        <p>妈妈：周末回家一趟，有个条件不错的。</p>
        <p>朋友：我给你推个婚介，别笑，真有人结婚了。</p>
        <p>公司群：本季度组织架构调整，请相关同事保持电话畅通。</p>
        <p>你盯着屏幕，忽然意识到：人生不是没有选项，是每个选项都像在催你签字。</p>
      `,
      choices: `<button class="primary" data-next="packaging" type="button">走进良缘算法</button>`
    });
    document.querySelector("[data-next]").addEventListener("click", () => {
      state.scene = "packaging";
      saveState();
      render();
    });
    return;
  }

  if (state.scene === "packaging") {
    storyFrame({
      chapter: CHAPTERS[0].title,
      text: `
        <p><b>孟姐</b>：“先别紧张，我们不是逼你结婚。”</p>
        <p><b>孟姐</b>：“我们只是帮你把适合结婚的人，从不适合的人里面筛出来。”</p>
        <p>她把你的资料夹放到桌上，问你希望如何被展示。</p>
      `,
      choices: PACKAGING_CHOICES.map((choice) => `<button data-package="${choice.id}" type="button">${choice.label}<small>${choice.effect}</small></button>`).join("")
    });
    document.querySelectorAll("[data-package]").forEach((button) => {
      button.addEventListener("click", () => choosePackaging(PACKAGING_CHOICES.find((choice) => choice.id === button.dataset.package)));
    });
    return;
  }

  if (state.scene === "questionnaire") {
    const current = QUESTIONNAIRE.find((q) => !state.questionnaire[q.id]);
    storyFrame({
      chapter: CHAPTERS[0].title,
      text: `
        <p>婚恋问卷弹出在平板上。孟姐说：“答案没有对错，只是每个人迟早都要为自己的排序付钱。”</p>
        <h2>${current.text}</h2>
      `,
      choices: current.choices.map(([id, label]) => `<button data-answer="${id}" type="button">${label}</button>`).join("")
    });
    document.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => answerQuestion(current.id, button.dataset.answer));
    });
    return;
  }

  if (state.scene === "recommendations") {
    const candidates = candidateNpcs();
    const selectedIds = selectedCandidateIds();
    storyFrame({
      chapter: CHAPTERS[0].title,
      text: `
        <p><b>孟姐</b>：“第一批给您看 ${candidates.length} 位。”</p>
        <p><b>孟姐</b>：“都不是完美的人，但都有人愿意为他们买单。”</p>
        <p>请选择 ${Math.min(3, candidates.length)} 位初见对象。</p>
        <div class="npc-grid">
          ${candidates.map((npc) => npcCard(npc, selectedIds.includes(npc.id))).join("")}
        </div>
      `,
      choices: `<button class="primary" data-start-dates ${selectedIds.length !== Math.min(3, candidates.length) ? "disabled" : ""} type="button">开始三场初见</button>`
    });
    document.querySelectorAll("[data-npc]").forEach((button) => {
      button.addEventListener("click", () => toggleFirstDate(button.dataset.npc));
    });
    document.querySelector("[data-start-dates]")?.addEventListener("click", () => {
      state.selectedFirstDates = selectedCandidateIds();
      startFirstDates();
    });
    return;
  }

  if (state.scene === "firstDates") {
    storyFrame({
      chapter: CHAPTERS[0].title,
      text: `
        <p>三场 20 分钟初见像三次短暂面试。有人问你为什么来婚介，有人问你介不介意婚前财产协议，也有人把“父母意见”说得像天气一样自然。</p>
        <div class="scene-list">
          ${state.selectedFirstDates.map((id) => {
            const npc = getNpc(id);
            const seed = getSeed(id);
            const motive = seed.motive ? MOTIVES[seed.motive] : null;
            const visibleLine = seed.hiddenType === "sincere" ? HIDDEN_TYPES.sincere.signal : motive.light;
            const caseText = visibleCaseLine(id, "screening");
            return `<p><b>${npc.name}</b>：${visibleLine}${caseText ? `<br><span>${caseText}</span>` : ""}</p>`;
          }).join("")}
        </div>
      `,
      choices: `
        <button data-first-action="continue" type="button">继续了解</button>
        <button data-first-action="background" type="button">申请基础背调</button>
        <button data-first-action="redLady" type="button">问孟姐真实评价</button>
      `
    });
    document.querySelectorAll("[data-first-action]").forEach((button) => {
      button.addEventListener("click", () => completeFirstDates(button.dataset.firstAction));
    });
    return;
  }

  if (state.scene === "speedDatingNight") {
    const selectedIds = selectedCandidateIds();
    storyFrame({
      chapter: CHAPTERS[0].title,
      text: `
        <p>七分钟速配夜，候选人陆续出现。孟姐端着咖啡站在你旁边。</p>
        <p><b>孟姐</b>：“单独聊天看的是对你怎么样。公开场合看的是 TA 对世界怎么样。”</p>
        <p>你需要选定一个主要推进对象，也可以勾选一个继续观察对象。</p>
        <div class="npc-grid">
          ${selectedIds.map((id) => {
            const npc = getNpc(id);
            return `
              <article class="npc-card">
                <h3>${npc.name}</h3>
                <p>${npc.intro}</p>
                <button data-primary="${npc.id}" type="button">锁定深入</button>
                <button data-secondary="${npc.id}" class="${state.secondaryNpcId === npc.id ? "selected" : ""}" type="button">设为观察</button>
              </article>
            `;
          }).join("")}
        </div>
      `,
      choices: ""
    });
    document.querySelectorAll("[data-primary]").forEach((button) => {
      button.addEventListener("click", () => selectPrimary(button.dataset.primary));
    });
    document.querySelectorAll("[data-secondary]").forEach((button) => {
      button.addEventListener("click", () => selectSecondary(button.dataset.secondary));
    });
  }
}

function candidateNpcs() {
  if (!state.gender) return NPCS;
  return NPCS.filter((npc) => npc.gender !== state.gender);
}

function selectedCandidateIds() {
  const candidateIds = candidateNpcs().map((npc) => npc.id);
  return state.selectedFirstDates.filter((id) => candidateIds.includes(id));
}

function chapterVariant(key, variants) {
  if (!state.chapterVariants[key]) {
    state.chapterVariants[key] = variants[Math.floor(Math.random() * variants.length)];
    saveState();
  }
  return state.chapterVariants[key];
}

function npcCard(npc, selected) {
  return `
    <button class="npc-card ${selected ? "selected" : ""}" data-npc="${npc.id}" type="button">
      <span>${npc.name}</span>
      <strong>${npc.archetype}</strong>
      <small>${npc.tags.join(" / ")}</small>
      <em>${npc.intro}</em>
    </button>
  `;
}

function renderChapter2() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "freeLoveIntro") {
    storyFrame({
      chapter: "自由恋爱",
      text: `
        <p>你不是从婚介桌前开始的。</p>
        <p>你和 ${npc.name} 已经交往了一段时间：可能是朋友介绍，可能是同事慢慢靠近，也可能是某个深夜聊出来的关系。</p>
        <p>自由恋爱看起来少了筛选流程，但人不会因为不是相亲认识，就自动变得更适合婚姻。</p>
      `,
      choices: `<button class="primary" data-free-love-start type="button">开始复盘这段关系</button>`
    });
    document.querySelector("[data-free-love-start]").addEventListener("click", () => {
      state.scene = "dailyDate";
      saveState();
      render();
    });
    return;
  }

  if (state.scene === "routeSwitchTransition") {
    storyFrame({
      chapter: "换线",
      text: `
        <p>你没有把上一段关系拖到更深处。</p>
        <p class="hint">你带走的教训：${state.lastRouteLesson ?? "不舒服本身就是信息，暂停也是一种选择。"}</p>
        <p>孟姐把另一份资料推到你面前：${npc.name}。这不是回到原点，而是带着上一轮判断重新进入相亲桌。</p>
      `,
      choices: `<button class="primary" data-continue-switch type="button">重新开始了解 ${npc.name}</button>`
    });
    document.querySelector("[data-continue-switch]")?.addEventListener("click", () => {
      state.scene = "chapter2Start";
      saveState();
      render();
    });
    return;
  }

  if (state.scene === "chapter2Start") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>你和 ${npc.name} 开始脱离婚介安排，进入真正的约会。</p>
        <p>第一次见面看条件，第二次见面看谈吐，第三次见面看对方在你说“不”的时候，还是不是那个人。</p>
      `,
      choices: `<button class="primary" data-next-date type="button">第一次：低成本日常</button>`
    });
    document.querySelector("[data-next-date]").addEventListener("click", () => {
      state.scene = "dailyDate";
      saveState();
      render();
    });
    return;
  }

  if (state.scene === "dailyDate") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>你们选了一家普通小馆。没有香槟、没有滤镜，只有一张略微晃动的桌子。</p>
        <p>结账时，服务员把账单放到你们中间。</p>
        <p class="hint">${motive ? motive.light : "TA 看了看账单，又看了看你，笑着说：“这顿我来，下次你请。”"}</p>
        ${currentCaseLine("dating") ? `<p class="hint">${currentCaseLine("dating")}</p>` : ""}
      `,
      choices: `
        ${choiceBtn('data-ch2="pay:treat"', '主动买单')}
        ${choiceBtn('data-ch2="pay:aa"', 'AA')}
        ${choiceBtn('data-ch2="pay:decide"', '让对方决定')}
        ${choiceBtn('data-ch2="pay:joke"', '开玩笑试探：“这顿算谁的投资？”', { eq: 4 })}
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "shoppingGift") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>饭后你们路过商场。橱窗里灯很亮，价格牌也很亮。</p>
        <p><b>${npc.name}</b>：“不用买什么，就随便看看。”</p>
        <p>随便看看这四个字，在恋爱里经常并不随便。</p>
      `,
      choices: `
        <button data-ch2="gift:cheap" type="button">买一件不贵但用心的小礼物</button>
        <button data-ch2="gift:mid" type="button">买中等价位礼物，给足情绪价值</button>
        <button data-ch2="gift:luxury" type="button">买明显超出当前关系阶段的贵礼物</button>
        <button data-ch2="gift:refuse" type="button">不买贵重礼物，先观察消费观</button>
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "valuesDate") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>第二次约会，你们聊到父母。</p>
        <p><b>${npc.name}</b>：“如果婚后双方父母都需要帮忙，你觉得应该怎么安排？”</p>
      `,
      choices: `
        ${choiceBtn('data-ch2="parents:smallFamily"', '优先小家庭，父母问题分开处理')}
        ${choiceBtn('data-ch2="parents:urgent"', '谁家急先帮谁家')}
        ${choiceBtn('data-ch2="parents:merge"', '结婚就是两个家庭融合')}
        ${choiceBtn('data-ch2="parents:rules"', '先说清钱和时间，不然以后一定吵', { eq: 5 })}
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "lifeShock") {
    const shock = chapterVariant("ch2LifeShock", [
      ["hospital", `${npc.name} 临时说家里有人住院，今晚可能要取消。TA 很疲惫，也很自然地问你能不能帮忙跑一趟。`],
      ["jobless", `${npc.name} 说部门调整，自己可能被裁。TA 讲得轻描淡写，却很快问到你对“低谷期伴侣”的看法。`],
      ["promotion", `${npc.name} 突然升职，饭局和应酬变多。TA 说这是好事，但也暗示你需要更理解 TA 的时间表。`]
    ]);
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>第二次约会后，现实随机闯进来。</p>
        <p class="message">${shock[1]}</p>
        <p>恋爱里最早暴露人的，不一定是甜言蜜语，而是突发状况下 TA 默认你应该站在哪里。</p>
      `,
      choices: `
        <button data-ch2="life:support" type="button">先提供支持，关系需要互相扶一把</button>
        <button data-ch2="life:verify" type="button">先问清事实和影响，不急着承诺</button>
        <button data-ch2="life:boundary" type="button">表达关心，但不立刻兜底</button>
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "socialScene") {
    const scene = chapterVariant("ch2Social", [
      ["friends", `闺蜜局里，${npc.name} 的朋友问你：“你们这种条件，准备多久结婚？”她笑着看你，像是在帮忙，也像是在审题。`],
      ["ktv", `KTV 里灯光很暗，麦克风轮到你。有人起哄让你和 ${npc.name} 合唱情歌，气氛像被提前按了“官宣”。`],
      ["cards", `牌局开到第二轮，输赢不大，玩笑却越来越贴身。有人说：“谈恋爱看人品，打牌最能看出来。”`]
    ]);
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>这一次不是单独约会，而是 ${npc.name} 把你带进 TA 的小圈子。</p>
        <p class="message">${scene[1]}</p>
        <p>公开场合里的亲密，常常比私下聊天更容易露出真实秩序。</p>
      `,
      choices: `
        <button data-ch2="social:blend" type="button">配合气氛，先融入</button>
        <button data-ch2="social:observe" type="button">少说多看，观察 TA 的圈子</button>
        <button data-ch2="social:protect" type="button">温和挡掉不舒服的起哄</button>
        <button data-ch2="social:refuse" type="button">拒绝继续加场，按时离开</button>
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "communicationDate") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>几天后，你发现 ${npc.name} 回消息的节奏开始变得不稳定。</p>
        <p>有时秒回，有时消失半天；有时说“忙”，有时又在社交平台点赞别人的动态。</p>
        <p><b>${npc.name}</b>：“我不是故意冷淡，我只是需要一点自己的空间。”</p>
      `,
      choices: `
        <button data-ch2="communication:direct" type="button">直接说清你能接受的沟通频率</button>
        <button data-ch2="communication:comfort" type="button">先安抚 TA，理解 TA 的压力</button>
        <button data-ch2="communication:mirror" type="button">用同样的冷淡试探 TA 的反应</button>
        <button data-ch2="communication:delay" type="button">暂时不谈，等关系更稳定再说</button>
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "timeConflict") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>下一次约会因为加班、朋友聚会和家庭电话改了三次时间。</p>
        <p>${npc.name} 说：“成年人谈恋爱，本来就要互相理解。”</p>
        <p>你同意理解，但也开始想：理解是不是总要由更好说话的那个人来付账。</p>
      `,
      choices: `
        <button data-ch2="time:schedule" type="button">制定固定见面和独处时间</button>
        <button data-ch2="time:accommodate" type="button">迁就 TA 的时间表</button>
        <button data-ch2="time:demand" type="button">要求 TA 也为关系调整安排</button>
        <button data-ch2="time:test" type="button">故意晚回一次，观察 TA 是否双标</button>
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "exBoundary") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>聊天时，${npc.name} 的手机弹出一个熟悉但陌生的名字。</p>
        <p><b>${npc.name}</b>：“前任。没什么，就是偶尔问候。”</p>
        <p>你不想显得小气，但你也知道，很多边界不是因为不信任才要谈，而是因为想继续才要谈。</p>
      `,
      choices: `
        ${choiceBtn('data-ch2="ex:transparent"', '坦诚聊旧关系和现有边界')}
        ${choiceBtn('data-ch2="ex:check"', '追问细节，确认有没有隐瞒')}
        ${choiceBtn('data-ch2="ex:ignore"', '不问，避免显得控制欲太强')}
        ${choiceBtn('data-ch2="ex:rule"', '明确旧关系规则：不暧昧、不隐瞒、不借钱', { eq: 5 })}
      `
    });
    bindChapter2Buttons();
    return;
  }

  if (state.scene === "pressureDate") {
    storyFrame({
      chapter: CHAPTERS[1].title,
      text: `
        <p>第三次约会结束得比你预想中晚。手机屏幕亮起，${npc.name} 发来一条消息。</p>
        <p class="message">${motive ? motive.pressure : "“我今天挺开心的。之后如果有什么不舒服，我们直接说，好吗？”"}</p>
        <p>这不是大事，但你知道，很多关系都是从小事开始倾斜的。</p>
      `,
      choices: `
        <button data-ch2="pressure:accept" type="button">配合</button>
        <button data-ch2="pressure:reject" type="button">拒绝</button>
        <button data-ch2="pressure:condition" type="button">提条件</button>
        <button data-ch2="pressure:avoid" type="button">转移话题</button>
        <button data-ch2="pressure:confront" type="button">直接质问</button>
      `
    });
    bindChapter2Buttons();
  }
}

function bindChapter2Buttons() {
  document.querySelectorAll("[data-ch2]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch2.split(":");
      chapter2Choice(kind, value);
    });
  });
}

function bindChapter3Buttons() {
  document.querySelectorAll("[data-ch3]").forEach((button) => {
    button.addEventListener("click", () => {
      const [kind, value] = button.dataset.ch3.split(":");
      chapter3Choice(kind, value);
    });
  });
}

function renderChapter3() {
  const npc = currentNpc();
  const motive = motiveForCurrent();

  if (state.scene === "chapter3Start") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>孟姐的电话来得很准，像系统自动弹出的下一步。</p>
        <p><b>孟姐</b>：“第三次见面以后，如果双方还不错，就要进入下一阶段了。”</p>
        <p><b>孟姐</b>：“拖太久，真诚的人会累，不真诚的人会换目标。”</p>
      `,
      choices: `
        <button data-ch3="meng:slow" type="button">可以推进，但不要太快</button>
        <button data-ch3="meng:define" type="button">先把关系说清楚</button>
        <button data-ch3="meng:background" type="button">先做深度背调</button>
        <button data-ch3="meng:other" type="button">我还想再见另一个人</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "exclusiveTalk") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>你把排他这件事摆上桌面。${npc.name} 沉默了几秒。</p>
        <p><b>${npc.name}</b>：“所以你的意思是，我们现在算什么？”</p>
      `,
      choices: `
        ${choiceBtn('data-ch3="exclusive:only"', '我希望从现在开始只了解彼此')}
        ${choiceBtn('data-ch3="exclusive:honestTime"', '我需要一点时间，但会坦诚告诉你')}
        ${choiceBtn('data-ch3="exclusive:normal"', '相亲阶段同时了解很正常')}
        ${choiceBtn('data-ch3="exclusive:askBack"', '你先告诉我，你有没有同时见别人', { eq: 5 })}
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "deepCheck") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>良缘算法的深度背调可以查婚史、债务、房产、学历、工作真实性和公开诉讼记录。</p>
        <p>但它查不出冷暴力、控制欲、真实共情力，也查不出一个人在压力下会不会变脸。</p>
      `,
      choices: `
        <button data-ch3="check:secret" type="button">偷偷背调</button>
        <button data-ch3="check:tell" type="button">坦白告诉 TA 我想背调</button>
        <button data-ch3="check:trust" type="button">不背调，选择相信</button>
        <button data-ch3="check:mutual" type="button">要求双方都背调</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "friendGroup") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>${npc.name} 带你去朋友局。火锅沸腾，酒杯轻碰，所有人都笑得很熟练。</p>
        <p class="hint">${motive ? motive.light : "TA 在朋友面前自然地介绍你，也会留意你有没有被冷落。"}</p>
        ${currentCaseLine("preParents") ? `<p class="hint">${currentCaseLine("preParents")}</p>` : ""}
      `,
      choices: `
        <button data-ch3="friend:blend" type="button">大方配合，融入 TA 的圈子</button>
        <button data-ch3="friend:observe" type="button">保持礼貌，但观察更多</button>
        <button data-ch3="friend:pointOut" type="button">对不舒服的玩笑当场指出</button>
        <button data-ch3="friend:talkAfter" type="button">事后单独谈</button>
        <button data-ch3="friend:leave" type="button">直接离场</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "parentsShadow") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>你妈发来三连问。</p>
        <p class="message">“TA 家几套房？”<br>“父母身体怎么样？”<br>“以后孩子谁带？”</p>
        <p>你忽然发现，你们明明还没确认相爱，却已经开始讨论两个家庭如何相处。</p>
      `,
      choices: `
        <button data-ch3="parents:truth" type="button">如实回答</button>
        <button data-ch3="parents:pretty" type="button">报喜不报忧</button>
        <button data-ch3="parents:boundary" type="button">告诉父母别太早介入</button>
        <button data-ch3="parents:delegate" type="button">让对方自己和父母解释</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "publicRelationship") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>朋友局结束后，${npc.name} 选了几张合照。</p>
        <p><b>${npc.name}</b>：“要不要发一下？也不是官宣，就让朋友们知道我们挺稳定。”</p>
        <p>你看着照片里两个人靠得很近，忽然意识到：公开关系有时不是表达爱，而是在提前占位。</p>
      `,
      choices: `
        <button data-ch3="public:post" type="button">同意发合照，给关系一个公开信号</button>
        <button data-ch3="public:delay" type="button">再等等，关系稳定后再公开</button>
        <button data-ch3="public:private" type="button">坚持恋爱先属于两个人</button>
        <button data-ch3="public:askReason" type="button">问 TA 为什么这么急着公开</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "intimacyBoundary") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>某个周末，你们看完电影，雨一直没停。</p>
        <p>${npc.name} 说：“要不上去坐会儿？我没有别的意思。”</p>
        <p>“没有别的意思”当然可能是真的，也可能只是把决定权轻轻推给你。</p>
      `,
      choices: `
        <button data-ch3="intimacy:slow" type="button">明确说想慢一点</button>
        <button data-ch3="intimacy:follow" type="button">顺着气氛推进关系</button>
        <button data-ch3="intimacy:talk" type="button">先谈清亲密、避孕、留宿和边界</button>
        <button data-ch3="intimacy:freeze" type="button">不好意思拒绝，只是变得僵硬</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "moneyEmotionHelp") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>关系刚刚升温，${npc.name} 遇到一件“小麻烦”。</p>
        <p class="message">${motive ? motive.pressure : "TA 说最近现金流有点紧，或者只是情绪很崩，需要你陪 TA 熬过今晚。"}</p>
        <p>恋爱里的求助很难判断：有些是信任，有些是试探，有些会慢慢变成义务。</p>
      `,
      choices: `
        ${choiceBtn('data-ch3="help:lend"', '先帮 TA，把关系放在前面')}
        ${choiceBtn('data-ch3="help:contract"', '可以帮，但用途和归还时间写清楚', { education: 5 })}
        ${choiceBtn('data-ch3="help:refuse"', '拒绝金钱求助，关系不该这么早混账', { eq: 5 })}
        ${choiceBtn('data-ch3="help:emotion"', '不出钱，但陪 TA 处理情绪')}
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "package") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>孟姐推出“成婚套餐”：父母见面礼仪课、婚前财产咨询、彩礼婚房行情报告、订婚宴资源包。</p>
        <p><b>孟姐</b>：“感情当然重要。但真要结婚，钱、房、父母、孩子，哪一样不需要提前谈？”</p>
      `,
      choices: `
        <button data-ch3="package:legal" type="button">购买婚前财产咨询</button>
        <button data-ch3="package:parents" type="button">购买父母见面协调</button>
        <button data-ch3="package:market" type="button">购买彩礼婚房行情报告</button>
        <button data-ch3="package:none" type="button">拒绝购买，自己处理</button>
        <button data-ch3="package:together" type="button">让 ${npc.name} 一起决定</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "chapter3Pressure") {
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>这一晚，${npc.name} 提出一个并不过分、但让你迟疑的请求。</p>
        <p class="message">${motive ? motive.pressure : "“下周我父母可能会来这边。要不先一起吃个饭？不正式，就当认识一下。”"}</p>
        <p>有些人害怕承诺。有些人急着承诺。而真正重要的，可能是 TA 在承诺之前，有没有尊重你的犹豫。</p>
      `,
      choices: `
        <button data-ch3="finalPressure:accept" type="button">答应</button>
        <button data-ch3="finalPressure:refuse" type="button">拒绝</button>
        <button data-ch3="finalPressure:condition" type="button">答应一部分，并设置条件</button>
        <button data-ch3="finalPressure:askBack" type="button">反问对方能为我做什么</button>
        <button data-ch3="finalPressure:pause" type="button">暂停关系</button>
      `
    });
    bindChapter3Buttons();
    return;
  }

  if (state.scene === "chapter3End") {
    const endingTone = state.flags.boundary >= 4
      ? "你没有得到所有答案，但你至少知道自己可以问问题。"
      : "你没有得到所有答案，而关系已经开始替你向前走。";
    const stopLossChoice = canStopLoss()
      ? `<button data-stop-loss type="button">${state.secondaryNpcId ? "止损，转向观察对象" : "止损，不再推进这段关系"}</button>`
      : "";
    storyFrame({
      chapter: CHAPTERS[2].title,
      text: `
        <p>第三章结束。</p>
        <p>${endingTone}</p>
        <p>下一章将进入谈婚论嫁：彩礼、婚房、房本、订婚宴和双方父母的第一次正面交锋。</p>
      `,
      choices: `
        ${stopLossChoice}
        <button class="primary" data-next-chapter type="button">进入第四章</button>
      `
    });
    document.querySelector("[data-stop-loss]")?.addEventListener("click", () => {
      endPrimaryRelationship("第三章结束时，你选择相信自己的不安。");
    });
    document.querySelector("[data-next-chapter]").addEventListener("click", () => {
      state.chapter = 4;
      state.scene = "chapter4Start";
      saveState();
      render();
    });
    return;
  }

  if (state.scene === "stopLossEnding") {
    const settleButton = state.runSettled
      ? `<button class="primary" data-title type="button">回到标题</button>`
      : `<button class="primary" data-settle-run type="button">结算止损经验</button>`;
    storyFrame({
      chapter: "止损结局",
      text: `
        <p>你没有进入谈婚论嫁。</p>
        <p>关系没有爆炸，也没有戏剧性反转。你只是把聊天框停在这里，把自己从一条越来越窄的路上撤了回来。</p>
        <p>这不是失败。能在看见问题时停止，也是一种能力。</p>
        ${state.runSettled ? `<p class="hint">本周目已结算。下一次新周目将拥有 ${totalPoints()} 点机动点。</p>` : `<p class="hint">结算后会获得本轮判断带来的永久机动点。</p>`}
      `,
      choices: settleButton
    });
    document.querySelector("[data-title]")?.addEventListener("click", () => setScreen("title"));
    document.querySelector("[data-settle-run]")?.addEventListener("click", settleRunExperience);
  }
}


  return { renderChapter1, renderChapter2, renderChapter3 };
}
