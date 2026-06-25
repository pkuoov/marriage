const DEFAULT_GAME_URL = "https://your-domain.example/marriage-detective/index.html";

Page({
  data: {
    gameUrl: DEFAULT_GAME_URL,
    shareTitle: "婚恋侦探局",
    sharePath: "/pages/index/index"
  },
  onLoad(options = {}) {
    const app = getApp();
    const baseUrl = app.globalData?.gameUrl || DEFAULT_GAME_URL;
    const query = [];
    if (options.mode) query.push(`mode=${encodeURIComponent(options.mode)}`);
    if (options.dailyKey) query.push(`dailyKey=${encodeURIComponent(options.dailyKey)}`);
    this.setData({
      gameUrl: query.length ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${query.join("&")}` : baseUrl
    });
  },
  onGameMessage(event) {
    const messages = event.detail?.data || [];
    const app = getApp();
    messages
      .filter((item) => item?.type === "case-submission")
      .forEach((item) => {
        app.globalData.caseSubmissions = [
          item.submission,
          ...(app.globalData.caseSubmissions || [])
        ].slice(0, 20);
      });
    const latestShare = [...messages].reverse().find((item) => item?.type === "daily-share");
    if (!latestShare) return;
    this.setData({
      shareTitle: latestShare.title || "婚恋侦探局",
      sharePath: latestShare.path || "/pages/index/index"
    });
  },
  onShareAppMessage() {
    return {
      title: this.data.shareTitle,
      path: this.data.sharePath
    };
  }
});
