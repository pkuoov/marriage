# 第 24 批·案4行级文档补录 + 案1双线分标执行单

> 执行评估（2026-07-21）：目标接受并实施，但不逐字照搬两处草案。案一把“旧洞／新洞／压的注”改成四月工资停发前后的自然问答；案四沿用案内已经成立的“九天后”，不写基准不清的 `D+9`。现行 schema 使用 `title / crossQuestions[].rows / markLimit`，并为非银行记录新增显式 `columns` 与 `dateMode: "relative"` 支持。其余事实边界、四选二预算和同名回拨映射按本单执行。

你是本仓库的实施工程师。判决来源:全量剧本复审(2026-07-19)——两处具体缺口:①案4是全包唯一没有行级 `documents` 的案子,三个白天地点全部退化为散文材料板,违反本仓库"呈堂律/行派生律";②案1同时背着两条"未名收款人"钱路(七月的新阳信贷/3301/王** 与三月的澄川借款/宸直信托),结构相似,玩家容易混淆,需要一句显式分标,而不是删除任一条已经写好的内容。

## 铁律

1. **不删除任何已有内容**。案1只做新增(一句分标台词),不动现有台词、字段、顺序。
2. **案4新文档不得引入任何新事实**。全部行数据必须来自本案已确立的 `evidenceChecks`/对话内容(见下方"事实来源"),行文档是把已经写好的散文材料"呈堂化",不是编新剧情。
3. 台词逐字使用;未列出的台词一律不动。
4. 全量校验:`npm run content:index && npm run check && npm run verify:pack -- steam-demo-01 && npm run smoke:browser && npm run content:script`。

---

## A. 案1:两条钱路显式分标(纯新增,1 处插入)

位置:夜B带回物开场「流水圈注」的回拨首次冲突(lines 结构),现有六行结束于:

> **咨询者：** 说过。他嫌十来个点太慢，说真想翻身就得找能翻倍的。我以为他只是嘴上说说。

在其后追加两行(lines 7-8,同一 lines 数组尾部新增,逐字):

```
**林旭阳：** 这是两条钱路,别混着问。三月这三行是旧洞——借款换信托,他自己压的注。四月工资停了以后是另一条——王姓转账、新阳信贷、转去3301的四万九千八。今晚两条都要问,但分开问。

**咨询者：** ……分开问。行。旧洞是他自己赌的,新洞才是这几个月的事。
```

不改动该 opener 前面已有的任何一句;不改动 `路径框架`/`流水圈注` 之外的其他 opener。

---

## B. 案4:新增行级文档「报销与返款流转记录」

### 事实来源(全部已在案内确立,不得新增)

- `work-budget-timeline`:D-1 14:05 部门助理群公告(预算先填金额/个人垫付需报备/供应商走对公);D-1 14:22 同事私聊(先别在大群问预算,来不及,复盘再补);D+9 财务群通知(供应商付款本月统一延后)。
- `work-approval-missing`:审批页字段——状态:审批通过;付款状态:未显示;收款账户:未显示;同图发送 3 次。
- `work-vendor-rebate`:报价单字段——项目:服务协调费;备注:按老规矩返给对接人;对接人:该同事;最终收款账户:未显示。

### B1. 新增 `documents` 字段(案4 JSON 顶层新增数组)

```json
"documents": [
  {
    "id": "case4-payment-ledger",
    "label": "报销与返款流转记录(她整理的时间线)",
    "intro": "七行。审批、预算群、供应商报价单，她全摆在一起了，你来圈。",
    "rows": [
      { "rowId": "q01", "date": "D-1 14:05", "kind": "群公告", "party": "部门助理", "memo": "活动预算先填金额，个人垫付需提前报备，供应商优先走对公" },
      { "rowId": "q02", "date": "D-1 14:22", "kind": "私聊", "party": "该同事", "memo": "先别在大群问预算，来不及，复盘再补流程" },
      { "rowId": "q03", "date": "D0", "kind": "活动", "party": "——", "memo": "客户答谢会举行，场地与礼品费刷咨询者个人卡" },
      { "rowId": "q04", "date": "D0 之后", "kind": "审批截图", "party": "该同事", "memo": "报销审批通过（同一页发送 3 次）" },
      { "rowId": "q05", "date": "D+9", "kind": "财务群通知", "party": "财务", "memo": "供应商付款本月统一延后" },
      { "rowId": "q06", "date": "未标注", "kind": "供应商报价单", "party": "供应商", "memo": "项目：服务协调费；备注：按老规矩返给对接人；对接人：该同事" },
      { "rowId": "q07", "date": "空行", "kind": "——", "party": "——", "memo": "付款状态 / 收款账户：均未显示" }
    ],
    "rowQuestions": {
      "q02": [
        {
          "question": "这条私聊比财务通知早了几天？",
          "answer": "九天。他让我别问预算的时候，财务延后通知根本还没发。是我们先躲开了群聊，不是财务先慢。",
          "contradiction": "同事让咨询者避开公开预算确认，发生在财务通知延后之前。",
          "routeAxis": "process-control",
          "logicContract": {
            "premiseAnchor": "先别在大群问预算，来不及，复盘再补流程",
            "sourceKind": "quoted-message",
            "sourceProves": "该私聊发生在财务延后通知之前九天。",
            "sourceDoesNotProve": "时间差不能单独证明同事当时已经知道财务会延后。",
            "answerAnchor": "是我们先躲开了群聊",
            "answerAdds": "咨询者确认绕开公开流程的决定早于任何财务方面的官方说法。",
            "nextLegalQuestion": "可以继续问审批和付款的关系，不能倒推同事在 14:22 就已预谋垫款不还。"
          }
        }
      ],
      "q04": [
        {
          "question": "同一张图发了三次，你实际看懂了哪一格？",
          "answer": "就“审批通过”四个字。发第三次的时候我才反应过来，他每次发的都是同一张，付款那一格从来没露过。",
          "contradiction": "审批截图反复发送但字段不变，付款状态始终缺失。",
          "routeAxis": "money-flow",
          "logicContract": {
            "premiseAnchor": "同图发送 3 次",
            "sourceKind": "document-readout",
            "sourceProves": "三次发送的是同一张审批页，字段没有变化。",
            "sourceDoesNotProve": "重复发送不能证明对方在故意隐瞒付款状态，也可能是他自己也没有更新的页面。",
            "answerAnchor": "付款那一格从来没露过",
            "answerAdds": "咨询者确认自己三次追问换来的都是同一格信息，没有新增。",
            "nextLegalQuestion": "可以索要付款回单号，不能把重复发送本身当成付款完成的证据。"
          }
        }
      ],
      "q06": [
        {
          "question": "服务协调费这行，对接人写的是谁？",
          "answer": "写的是他。备注说按老规矩返给对接人，可账户那一栏还是空的。协调费算不算他多拿的一份，报价单没写，我也不敢替它说。",
          "contradiction": "供应商返款入口写明对接人为该同事，收款账户仍未显示。",
          "routeAxis": "external-corroboration",
          "logicContract": {
            "premiseAnchor": "按老规矩返给对接人",
            "sourceKind": "document-readout",
            "sourceProves": "报价单载明服务协调费返款对接人是该同事。",
            "sourceDoesNotProve": "对接人身份不能证明协调费已经支付，也不能证明金额或账户。",
            "answerAnchor": "账户那一栏还是空的",
            "answerAdds": "咨询者确认这一行同样缺少收款账户信息，不肯替空白下结论。",
            "nextLegalQuestion": "可以要求供应商或财务补充收款账户，不能直接认定协调费已落入对接人腰包。"
          }
        }
      ]
    },
    "crossRowQuestions": [
      {
        "question": "q01 和 q02 只隔十七分钟，公开流程和私聊为什么这么快就打架了？",
        "rowIds": ["q01", "q02"],
        "answer": "十七分钟。流程表还没被人看完，他那句“别问”就跟上来了。要是真等九天后财务说延后，这十七分钟根本不会发生。",
        "contradiction": "公开流程与私下叫停几乎同时出现，证明绕开预算并非应对财务延误的临时决定。",
        "routeAxis": "process-control"
      },
      {
        "question": "q04 发了三次，q07 却一直空着，这说明什么？",
        "rowIds": ["q04", "q07"],
        "answer": "说明这三次都停在同一步。审批通过是真的，可它证明不了钱到没到账——那一格，三次都是空的。",
        "contradiction": "审批截图的反复出现不能替代付款状态和收款账户两个缺失字段。",
        "routeAxis": "money-flow"
      }
    ],
    "maxMarks": 3
  }
]
```

### B2. 新增白天地点(overnightStructure.dayScenes 追加第 4 项)

案4当前 3 个白天地点(day-work-finance-window/day-work-supplier-visit/day-work-breakroom-observe)、预算 2。追加第 4 项,预算维持 2 不变(4 选 2):

```json
{
  "id": "day-work-payment-ledger",
  "label": "后台·报销流转记录",
  "backdropClass": "day-document",
  "kind": "document",
  "body": {
    "documentId": "case4-payment-ledger",
    "routeAxis": "money-flow",
    "earnedItemId": "报销流转记录圈注"
  }
}
```

### B3. 幕间物件映射与 callbackOpeners 追加

`overnightStructure.callbackOpeners` 新增一条(键名与 `earnedItemId` 同名):

```json
"报销流转记录圈注": {
  "line": "「流转记录我圈完了。私聊比财务延后通知早了九天，供应商那行写着返给对接人，账户还是空的。」",
  "firstConflict": {
    "hostLine": "私聊在前,财务延后在后。他今晚要还说'是财务慢',你拿哪一行怼回去?",
    "callerLine": "拿 14:22 那条。财务还没说延后,他先让我别问了。"
  }
}
```

若引擎的 `earnedItems`/`callbackOpeners` 走显式映射表(非同名自动匹配),在案4"幕间物件映射"对应表中追加 `报销流转记录圈注 → 报销流转记录圈注` 一行。

---

## 验收

1. 全量校验绿;`documents` 字段在四案均非空;`verify:pack` 的行级文档校验(行-证言互不矛盾)对案4新文档同样生效。
2. `npm run content:script` 重新生成后确认:案1「流水圈注」opener 尾部两行台词正确追加;案4白天出现第 4 个地点且可圈选、逐行追问与跨行追问正确渲染。
3. 提交切分:A(案1分标)与 B(案4文档+地点+映射)各一个提交。
4. 不确定处停下报告,不自行取舍。
