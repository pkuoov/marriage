# 微信小程序适配方案

## 结论

短期先走 `web-view` 版本，目标是用最小成本验证移动端游玩节奏、分享链路和内容合规反馈。当前项目是纯静态 H5，`npm run build:h5` 会输出 `dist/index.html`，部署到 HTTPS 域名后即可被微信小程序 `web-view` 承载。

中期如果要做正式增长和更强的小程序原生体验，再启动 Uni-app / Taro 视图层重构。案件生成、判定、难度、存档迁移等纯 JS 逻辑应保留，重写的是 DOM 字符串渲染层和事件绑定层。

## 路线 A：web-view 快速上线

适用场景：

- 内测、发行展示、内容验证。
- 先确认四案故事集、移动端 UI、分享链路和内容合规反馈是否成立。
- 不希望在玩法还在变时重写视图层。

实现步骤：

1. 运行 `npm run build:h5` 生成 `dist/`。
2. 将 `dist/` 部署到 HTTPS 域名。
3. 在微信公众平台配置业务域名。
4. 小程序页面只承载：

```xml
<web-view src="https://your-domain.example/livestream-detective/index.html" />
```

当前 H5 需要保持：

- 手机端单栏布局。
- 通话回放和结果卡使用底部浮层或折叠入口，不常驻占屏。
- 触控按钮高度不低于 44px。
- 存档仍用 H5 `localStorage`，正式上线前再评估微信登录与云存档。

## 已提供的小程序壳

仓库内的 `miniapp-webview/` 是一个最小 web-view 小程序项目，可以直接用微信开发者工具打开。

上线前需要改两处：

1. `miniapp-webview/project.config.json`：把 `appid` 从 `touristappid` 改为真实小程序 AppID。
2. `miniapp-webview/app.js`：把 `gameUrl` 改为已备案、已配置业务域名白名单的 HTTPS 游戏地址。

H5 页面已经通过 `platformRuntime.wechat` 暴露微信 WebView 状态：

- `platformRuntime.id === "wechat-webview"`：当前在微信内置浏览器或小程序 web-view 中。
- `platformRuntime.wechat.inMiniProgram`：当前更可能是在小程序 web-view 内。
- `platformRuntime.wechat.postMessage(data)`：向小程序壳发送消息，壳层在 `pages/index/index.js` 的 `onGameMessage` 接收。

第一版不建议把登录、支付、云存档接进去。先验证移动端游玩、内容审核和留存，再决定哪些能力必须原生化。

## 路线 B：Uni-app / Taro 重构

适用场景：

- 准备正式公测。
- 需要微信分享、震动反馈、云存档、订阅消息、支付等原生能力。
- UI 结构已经稳定，不再大幅调整主流程。

保留模块：

- `src/caseEngine.js`
- `src/caseRuntime.js`
- `src/difficulty.js`
- `src/caseModes.js`
- `src/dailyChoices.js`
- `scripts/verify-logic.js` 中的逻辑校验思路

需要重写模块：

- `src/app.js` 中的 `innerHTML` 渲染和 `querySelector` 事件绑定。
- `src/state.js` 的存储层，替换为响应式状态和小程序 storage API。

推荐重构顺序：

1. 抽出纯逻辑的 `gameController`，让“进入场景、点击选项、出示证据”返回可渲染的 view model。
2. 用 Uni-app Vue 组件承接 view model。
3. 先复刻四案故事集主流程，再接微信分享、结果卡和评论区审判墙。
4. 最后接微信登录、云存档、分享和成就。

## 当前不建议

暂不建议直接原生 WXML 全量重写。游戏玩法和剧情仍在快速调整，原生小程序会让每一次 UI 改动都更重；等 H5 版移动端手感稳定后再做原生化，风险更低。
