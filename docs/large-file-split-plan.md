# 大文件拆分方案(具体·可执行)

日期:2026-08-15
性质:结构拆分方案。目标:把三个超 800 行的文件按**已存在的内聚簇**拆成聚焦模块。纯行为保持,沿用已验证的纪律(不 import app.js、经 ctx、用时读 `ctx.getState()`、smoke 兜回归、分片提交)。按"安全→高风险"排序,每步单独可提交。

当前超标:`app.js` 1975 / `caseEngine.js` 1081 / `overnightScreens.js` 1050(`sceneScreens.js` 761 逼近)。

---

## 第 1 步|caseEngine.js 1081 → ~380(最安全,先做)

**现状**:3 个公开生成器(daily/storyPack/weekly)+ 共享机器(plot 定义/rotation/hash/baseBrief/choiceRoutes)+ **5 个自包含的按案模板构建器**,后者占 ~700 行:

| 模板函数 | 行 | 约行数 |
| --- | --- | --- |
| dailyLostJobCreditTemplate | 372 | 146 |
| dailyHouseBoundaryTemplate | 519 | 128 |
| dailyTonyMultiDatingTemplate | 648 | 140 |
| dailyFakeProfileTemplate | 789 | 162 |
| dailyWorkplaceReimbursementTemplate | 952 | 129 |

**拆法**:5 个模板搬进 `src/caseTemplates/`(每案一文件,或合成 `dailyCaseTemplates.js`),caseEngine 保留 3 个生成器 + 共享机器 + 一张 `DAILY_TEMPLATE_BUILDERS` 注册表(它已存在,L293)。模板是纯数据构建器(不碰 DOM/可变 state),经注册表 map 调用——**零耦合、零行为风险**。
**产出**:caseEngine ~380 行;新增 caseTemplates 文件各 <200。
**验收**:`verify:pack`/`verify-logic`/`test:narrative` 绿(它们直接测生成结果)。

---

## 第 2 步|overnightScreens.js 1050 → ~600(内聚,较安全)

**现状**:5 类场景混在一个工厂里。最大且最自包含的是**文档子系统**(~350 行):

- 文档簇(L511-844 一带):renderDocumentDayScene / renderDocumentReconcile / dayTimelineHtml / dayFollowupHtml / documentViewerHtml / documentTableColumns / documentEarnedPreviewHtml / documentReconcileHtml / selectTimelineCard / submitTimelineSort / markDocumentRow / mergeDocumentQuestions / documentRowSummary / pendingDocumentQuestions / askDocumentQuestion / documentQuestionRouteIndexFor。
- liveCounterBeat 簇(~120 行):renderLiveCounterBeat / enterLiveCounterBeatBefore/After / recordLiveCounterChoice / continueAfterLiveCounterBeat。

**拆法**:
1. 文档簇 → `src/ui/screens/overnightDocumentScreens.js`,导出 `createOvernightDocumentScreens(ctx)`;overnightScreens 的 renderDayScene 在 `kind==="document"` 时委托它。
2. liveCounterBeat 簇 → `src/ui/screens/liveCounterScreens.js`(或并入 sceneScreens)。
3. overnightScreens 保留 hangup / dayActOpening / dayMap / dayScene(非文档)/ callback。
**产出**:overnightScreens ~600;文档模块 ~350;liveCounter ~120。
**机制**:同 ctx 工厂;两个子工厂在现有 `createDailyScreenRenderers` 里一并 memoize 构建,结果 `Object.assign` 进 screens(与现状一致)。
**风险**:文档簇有内部互调(markRow→questions→timeline),整簇一起搬,不半拆;smoke 的 `document-*` 路线兜。

---

## 第 3 步|app.js 1975 → ~1150(分四簇,由易到难)

app.js 已有清晰域簇。四次抽取,各一提交:

### 3a|输入/焦点/手柄(L1046-1245,~24 fn)→ `src/ui/focusInputControl.js`
bind / bindChoiceActivation / queueDefaultFocus / setupDefaultFocus / preferred{Default,Back,Review}Button / toggleReviewPanel / moveButtonFocus / focusableButtons / topInteractiveScope / close{MaterialPanel,TopOverlay} / isVisibleElement / focusButton / activateButton / startGamepadPolling / pollGamepads / firstActiveGamepad / handleGamepad{Input,Button,Axis} / currentDialogueAdvance / keyEventInTextInput。
- **最低耦合**(DOM 机械,几乎不碰游戏逻辑);导出 `createFocusInputControl(ctx)`(ctx 给 app 根、getState、render、moveScene 等少量回调)。~200 行出。

### 3b|直播 HUD/立绘/压力呈现(L1806-1966,~20 fn)→ `src/ui/liveHudPresenter.js`
caseProgressStrip / audiencePatienceHud / storyPackSummaryHud / liveCommentStrip / liveIntentHookFor / portraitLayer / hostSpeakingStateForCurrentScene / casePortraitArt / callerExpressionFor / currentScenePressureHint / liveSceneClass / reactionLine / withCrossCaseEchoes / eligibleCrossCaseEcho / withMaterialPityLine / materialPityLineFor / escapeHtml。
- 多数已是对 `ui/liveCallView` 的薄适配;搬成 `createLiveHudPresenter(ctx)`。~150 行出。

### 3c|状态写入/幕间(L1489-1779,~28 fn)→ `src/runtime/caseStateWrites.js`
ensure{Budget,Night,Overnight} / update{Night,Overnight} / interludeActionState / completeInterludeAction / nextPendingInterruptAction / countCompletedInterludeActions / recordInterludeActionChoice / recordInterludeReplyChoice / interludeRouteIndexFor / closeInterludeAction / markAction / audiencePatienceLost / recordPatienceLost / actionDone / recordContradiction / recordRouteChoice / upsertByCaseId / removeKeyPrefix / omitRecordKey / retryPatienceLostStep / resetCaseAttempt。
- **回报最高**:把状态变更逻辑挪进可纯函数测试的 runtime 模块(输入 state+args,返回新 state/写结果)。~250 行出。中等风险(互调多),整簇搬。

### 3d|结算/结果/meta(L1369-1489,~11 fn)→ `src/runtime/caseOutcome.js`(或并入现有 caseRuntime)
normalizedDailyResult / issueCompletion / relationshipExpectedForResult / accusationReadinessForBrief / applyOutcome / recordDailyMeta / routeProfileForBrief / postDailySharePayload / isFinalStoryPackCase / advanceToNextStoryPackCase。~120 行出。

**app.js 抽完保留**:bootstrap/URL/mode、ctx 构造(createDailyScreenRenderers 227 行是协调器胶水,合理留下)、render 分发、frame/mount 少量、scene-nav。目标 ~1150(仍略超 800,但协调器性质,可接受;若还想降,frame/mount 可再抽一簇)。

---

## 全局机制与铁律(每步都遵守)

1. 抽出模块**不 import app.js**;需要的 state/能力/回调经 **ctx 或显式参数**传入;`state` 用时读 `ctx.getState()`,不在工厂顶部捕获(守 pass-28)。
2. 行为保持:不改游戏可观察输出、不改内容、不改 mutation 语义。`smoke:browser` 是判据;每步 `check + smoke:browser` 绿再提交。
3. 一步一提交,顺序:1(templates)→ 2(document)→ 3a(input)→ 3b(hud)→ 3c(state-writes)→ 3d(outcome)。前面越安全,先落。
4. 任一簇内发现与其它逻辑纠缠、整簇搬会改行为的,停下报告,不半拆、不改行为。

## 预期结果

| 文件 | 现 | 拆后 |
| --- | --- | --- |
| caseEngine.js | 1081 | ~380 |
| overnightScreens.js | 1050 | ~600 |
| app.js | 1975 | ~1150 |
| 新增 | — | caseTemplates/、overnightDocumentScreens、liveCounterScreens、focusInputControl、liveHudPresenter、caseStateWrites、caseOutcome |

三个超标文件里两个降到 800 以内,app.js 降到协调器规模。**前提是 smoke 能在本地跑通**——建议先修 smoke 运行时(见上一份评估),否则每步验收都卡在"跑不完"。

---

## 执行结果（2026-08-15）

方案已按 1 → 2 → 3a → 3b → 3c → 3d 全部落地，剧情内容与玩法规则未改。

| 文件 | 拆分前 | 拆分后 |
| --- | ---: | ---: |
| `src/caseEngine.js` | 1081 | 317 |
| `src/ui/screens/overnightScreens.js` | 1050 | 586 |
| `src/app.js` | 1975 | 1261 |

新增模块：`src/caseTemplates/`、`overnightDocumentScreens.js`、`liveCounterScreens.js`、`focusInputControl.js`、`liveHudPresenter.js`、`caseStateWrites.js`、`caseOutcome.js`。

额外增加 `ARCH-003` 架构门禁，防止上述逻辑重新回流进三个大文件。`npm run check` 全绿（101 项单元测试），快速浏览器回放约 10 秒，全矩阵回放约 79 秒并全部通过。
