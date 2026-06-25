export function createScreenRenderers(ctx) {
  const {
    state,
    setScreen,
    finalizeCharacter,
    app
  } = ctx;
  const dailySpecialtyIds = ["audit", "emotion", "verification"];

	function renderTitle() {
	  app.innerHTML = `
	    <section class="title-screen">
	      <div class="title-copy">
	        <p class="eyebrow">悬疑解谜游戏</p>
	        <h1>婚恋侦探事务所</h1>
	        <p>人人都是大侦探。你将作为一名婚恋主播，听出对话背后没说完的那半句。</p>
	        <div class="quick-play-card case-file-ledger">
	          <span>今日连线</span>
	          <b>一通匿名来电</b>
	          <small>不同接法，会听见不同版本。</small>
	        </div>
	        <div class="title-actions">
	          <button class="primary" data-quick-daily type="button">接入今日连线</button>
	        </div>
	      </div>
	    </section>
	  `;

  document.querySelector("[data-quick-daily]").addEventListener("click", () => {
    state.caseMode = "daily";
    state.specialty = dailySpecialtyIds[Math.floor(Math.random() * dailySpecialtyIds.length)];
    finalizeCharacter();
  });
}

function renderCreator() {
  if (state.gender !== "male") state.gender = "male";
  app.innerHTML = `
    <section class="creator">
      <div class="panel">
        <p class="eyebrow">直播间来电</p>
        <h1>有人接进来了</h1>
        <p class="muted">今晚的来电已经接上，直播间安静了一下。</p>
        <div class="title-actions creator-actions">
          <button class="secondary" data-back-title type="button">返回主页</button>
        </div>
        <button class="primary wide" data-finalize type="button">接入来电</button>
      </div>
    </section>
  `;
  document.querySelector("[data-back-title]")?.addEventListener("click", () => setScreen("title"));
  document.querySelector("[data-finalize]")?.addEventListener("click", finalizeCharacter);
}


  return { renderTitle, renderCreator };
}
