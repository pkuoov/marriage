const DEFAULT_GAME_URL = "https://your-domain.example/livestream-detective/index.html";

Page({
  data: {
    gameUrl: DEFAULT_GAME_URL,
    shareTitle: "直播间大侦探",
    sharePath: "/pages/index/index"
  },
  onLoad(options = {}) {
    const app = getApp();
    const baseUrl = app.globalData?.gameUrl || DEFAULT_GAME_URL;
    const query = [];
    if (options.mode) query.push(`mode=${encodeURIComponent(options.mode)}`);
    if (options.dailyKey) query.push(`dailyKey=${encodeURIComponent(options.dailyKey)}`);
    if (options.storyKey) query.push(`storyKey=${encodeURIComponent(options.storyKey)}`);
    if (options.weeklyKey) query.push(`weeklyKey=${encodeURIComponent(options.weeklyKey)}`);
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
    const shareTitle = latestShare.playerType
      ? `${latestShare.playerType}｜${latestShare.title || "四案故事集"}`
      : latestShare.title || "直播间大侦探";
    this.setData({
      shareTitle,
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
