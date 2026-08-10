export const AUDIO_CUE_BUSES = Object.freeze(["bgm", "ambience", "sfx", "voice"]);
export const AUDIO_CUE_STATUSES = Object.freeze(["ready", "planned"]);

export const AUDIO_CUES = Object.freeze({
  "ui.click": readySynth("界面点击", "click"),
  "ui.confirm": readySynth("确认", "confirm"),
  "ui.warning": readySynth("警告", "warning"),
  "ui.page": readySynth("翻页", "page"),

  "bgm.title-nightshift": readyLoop("霓虹雨夜标题", "bgm", "./assets/audio/bgm/title-neon-rain.ogg", 0.52),
  "bgm.live-call": readyLoop("直播连线", "bgm", "./assets/audio/bgm/live-call.ogg", 0.66),
  "bgm.pressure-stem": readyLoop("现场压力层", "bgm", "./assets/audio/bgm/pressure-stem.ogg", 0.48),
  "bgm.offair-desk": readyLoop("收麦调查台", "bgm", "./assets/audio/bgm/offair-desk.ogg", 0.62),
  "bgm.day-investigation": readyLoop("白天调查", "bgm", "./assets/audio/bgm/day-investigation.ogg", 0.64),
  "bgm.callback-return": readyLoop("夜间回拨", "bgm", "./assets/audio/bgm/callback-return.ogg", 0.68),
  "bgm.accusation": readyLoop("最终追问", "bgm", "./assets/audio/bgm/accusation.ogg", 0.7),
  "bgm.recap-afterhours": readyLoop("收麦回看", "bgm", "./assets/audio/bgm/recap-afterhours.ogg", 0.58),
  "bgm.epilogue-dawn": plannedLoop("天亮前", "bgm", "./assets/audio/bgm/epilogue-dawn.ogg", 0.62),

  "ambience.studio-room": readyLoop("直播棚室内底噪", "ambience", "./assets/audio/ambience/studio-room.ogg", 0.46),
  "ambience.studio-line": plannedLoop("热线线路底噪", "ambience", "./assets/audio/ambience/studio-line.ogg", 0.42),
  "ambience.restaurant": plannedLoop("餐厅", "ambience", "./assets/audio/ambience/restaurant.ogg", 0.5),
  "ambience.cafe": plannedLoop("咖啡厅", "ambience", "./assets/audio/ambience/cafe.ogg", 0.5),
  "ambience.teahouse": plannedLoop("临街茶馆", "ambience", "./assets/audio/ambience/teahouse.ogg", 0.48),
  "ambience.apartment-hall": plannedLoop("住宅楼道", "ambience", "./assets/audio/ambience/apartment-hall.ogg", 0.46),
  "ambience.office": plannedLoop("办公室", "ambience", "./assets/audio/ambience/office.ogg", 0.46),
  "ambience.archive-studio": plannedLoop("档案室与工作室", "ambience", "./assets/audio/ambience/archive-studio.ogg", 0.46),
  "ambience.document-desk": plannedLoop("后台审材料", "ambience", "./assets/audio/ambience/document-desk.ogg", 0.4),
  "ambience.city-afternoon": readyLoop("城市下午", "ambience", "./assets/audio/ambience/city-afternoon.ogg", 0.44),

  "sfx.phone.connect": readyOneShot("热线接通", "./assets/audio/sfx/phone-connect.ogg", 0.4),
  "sfx.phone.disconnect": readyOneShot("连线断开", "./assets/audio/sfx/phone-disconnect.ogg", 0.44),
  "sfx.phone.soft-hangup": plannedOneShot("轻挂电话", "./assets/audio/sfx/phone-soft-hangup.ogg", 0.76),
  "sfx.phone.busy": plannedOneShot("忙音", "./assets/audio/sfx/phone-busy.ogg", 0.72),
  "sfx.broadcast.on-air": readyOneShot("开播提示音", "./assets/audio/sfx/broadcast-on-air.ogg", 0.34),
  "sfx.message.notification": readyOneShot("后台消息", "./assets/audio/sfx/message-notification.ogg", 0.48),
  "sfx.document.mark": readyOneShot("材料圈点", "./assets/audio/sfx/document-mark.ogg", 0.46),
  "sfx.case2.door-knock": readyOneShot("门外敲门", "./assets/audio/sfx/case2-door-knock.ogg", 0.5),

  "voice.case1.loyalty-message": plannedVoice("案1·怕你离开", "./assets/audio/voice/case1-loyalty-message.ogg", "我只是怕你知道我失业后就离开我。"),
  "voice.case2.dryer-message": readyVoice("案2·吹风机回放", "./assets/audio/voice/case2-dryer-message.ogg", "今晚店长又说我了。也就你肯听我说这些。"),
  "voice.case3.dinner-pause": plannedVoice("案3·饭局停顿", "./assets/audio/voice/case3-dinner-pause.ogg", "本科也是那所学校吗？"),
  "voice.case4.pad-message": plannedVoice("案4·垫款私聊", "./assets/audio/voice/case4-pad-message.ogg", "你先把场地和礼品费垫了。活动总结的“执行主责”一栏，可以写你的名字。"),
  "voice.case4.supplier-message": plannedVoice("案4·供应商补话", "./assets/audio/voice/case4-supplier-message.ogg", "服务协调费按老规矩返给对接人。")
});

export function audioCueById(cueId = "") {
  return AUDIO_CUES[cueId] ?? null;
}

export function audioCueAvailable(cueId = "") {
  const cue = audioCueById(cueId);
  return Boolean(cue && cue.status === "ready" && (cue.src || cue.synth));
}

export function audioCueView(cueId = "") {
  const cue = audioCueById(cueId);
  if (!cue) return null;
  return { id: cueId, label: cue.label, bus: cue.bus, available: audioCueAvailable(cueId) };
}

function readySynth(label, synth) {
  return Object.freeze({ label, bus: "sfx", status: "ready", synth, gain: 1, loop: false });
}

function plannedLoop(label, bus, src, gain) {
  return Object.freeze({ label, bus, status: "planned", src, gain, loop: true });
}

function readyLoop(label, bus, src, gain) {
  return Object.freeze({ label, bus, status: "ready", src, gain, loop: true });
}

function plannedOneShot(label, src, gain) {
  return Object.freeze({ label, bus: "sfx", status: "planned", src, gain, loop: false });
}

function readyOneShot(label, src, gain) {
  return Object.freeze({ label, bus: "sfx", status: "ready", src, gain, loop: false });
}

function plannedVoice(label, src, transcript) {
  return Object.freeze({ label, bus: "voice", status: "planned", src, transcript, gain: 1, loop: false });
}

function readyVoice(label, src, transcript) {
  return Object.freeze({ label, bus: "voice", status: "ready", src, transcript, gain: 1, loop: false });
}
