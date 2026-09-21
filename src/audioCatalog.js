export const AUDIO_CUE_BUSES = Object.freeze(["bgm", "ambience", "sfx", "voice"]);
export const AUDIO_CUE_STATUSES = Object.freeze(["ready", "planned"]);

export const AUDIO_CUES = Object.freeze({
  "ui.click": readySynth("界面点击", "click"),
  "ui.confirm": readySynth("确认", "confirm"),
  "ui.warning": readySynth("警告", "warning"),
  "ui.page": readySynth("翻页", "page"),

  "bgm.title-nightshift": readyLoop("霓虹雨夜标题", "bgm", "./assets/audio/bgm/title-neon-rain.ogg", 0.52),
  "bgm.live-call": readyLoop("直播连线", "bgm", "./assets/audio/bgm/live-call.ogg", 0.66),
  "bgm.live-call-allegro": readyLoop("直播连线·Allegro", "bgm", "./assets/audio/bgm/live-call-allegro.ogg", 0.6, {
    loopStart: 0,
    attackMs: 0,
    productionNote: "late night 1 中段，约 80 BPM 的独立编曲；从循环点直接入拍，同旋律关系与听感待复核",
    auditoryReview: "pending"
  }),
  "bgm.pursuit": readyLoop("追索线浮出", "bgm", "./assets/audio/bgm/pursuit.ogg", 0.6, {
    loopStart: 0,
    attackMs: 0,
    durationTargetSeconds: [60, 90],
    productionNote: "1 号中后段 72 秒循环；去掉渐强前奏，紧跟指认 stinger；听感待复核",
    auditoryReview: "pending"
  }),
  "bgm.pressure-stem": readyLoop("现场压力层", "bgm", "./assets/audio/bgm/pressure-stem.ogg", 0.48),
  "bgm.offair-desk": readyLoop("收麦调查台", "bgm", "./assets/audio/bgm/offair-desk.ogg", 0.62),
  "bgm.day-investigation": readyLoop("白天调查", "bgm", "./assets/audio/bgm/day-investigation.ogg", 0.64),
  "bgm.callback-return": readyLoop("夜间回拨", "bgm", "./assets/audio/bgm/callback-return.ogg", 0.68),
  "bgm.accusation": readyLoop("最终追问", "bgm", "./assets/audio/bgm/accusation.ogg", 0.7),
  "bgm.recap-afterhours": readyLoop("收麦回看", "bgm", "./assets/audio/bgm/recap-afterhours.ogg", 0.58),
  "bgm.epilogue-dawn": readyLoop("天亮前", "bgm", "./assets/audio/bgm/epilogue-dawn.ogg", 0.54, {
    attackMs: 900,
    productionNote: "quiet dawn 中段，保留原有约 64 BPM 脉冲；全局尾声使用，单案回看沿用 recap；听感待复核",
    auditoryReview: "pending"
  }),

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
  "sfx.phone.soft-hangup": plannedOneShot("轻挂电话", "./assets/audio/sfx/phone-soft-hangup.ogg", 0.76, { fallbackCueId: "sfx.phone.disconnect" }),
  "sfx.phone.busy": plannedOneShot("忙音", "./assets/audio/sfx/phone-busy.ogg", 0.72, { fallbackCueId: "sfx.phone.disconnect" }),
  "sfx.broadcast.on-air": readyOneShot("开播提示音", "./assets/audio/sfx/broadcast-on-air.ogg", 0.34),
  "sfx.message.notification": readyOneShot("后台消息", "./assets/audio/sfx/message-notification.ogg", 0.48),
  "sfx.document.mark": readyOneShot("材料圈点", "./assets/audio/sfx/document-mark.ogg", 0.46),
  "sfx.present.hit": readySynth("指认命中", "present-hit"),
  "sfx.present.miss": readySynth("指认失误", "present-miss"),
  "sfx.case2.door-knock": readyOneShot("门外敲门", "./assets/audio/sfx/case2-door-knock.ogg", 0.5),

  "voice.case1.loyalty-message": plannedVoice("案1·怕你离开", "./assets/audio/voice/case1-loyalty-message.ogg", "我只是怕你知道我失业后就离开我。"),
  "voice.case2.dryer-message": readyVoice("Tony · 店内语音", "./assets/audio/voice/case2-dryer-message.ogg", "今晚店长又说我了。也就你肯听我说这些。", 3.710938),
  "voice.case3.dinner-pause": plannedVoice("案3·饭局停顿", "./assets/audio/voice/case3-dinner-pause.ogg", "你发的材料是那所学校，本科也是在那儿读的吗？"),
  "voice.case4.pad-message": plannedVoice("案4·垫款私聊", "./assets/audio/voice/case4-pad-message.ogg", "你先把场地和礼品费垫了，这场就交给你。"),
  "voice.case4.supplier-message": plannedVoice("案4·供应商补话", "./assets/audio/voice/case4-supplier-message.ogg", "每一层的返费结完，下一批点位才往下走。")
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
  return { id: cueId, label: cue.label, bus: cue.bus, available: audioCueAvailable(cueId), duration: cue.duration ?? 0 };
}

function readySynth(label, synth) {
  return Object.freeze({ label, bus: "sfx", status: "ready", synth, gain: 1, loop: false });
}

function plannedLoop(label, bus, src, gain, metadata = {}) {
  return Object.freeze({ label, bus, status: "planned", src, gain, loop: true, ...metadata });
}

function readyLoop(label, bus, src, gain, metadata = {}) {
  return Object.freeze({ label, bus, status: "ready", src, gain, loop: true, ...metadata });
}

function plannedOneShot(label, src, gain, metadata = {}) {
  return Object.freeze({ label, bus: "sfx", status: "planned", src, gain, loop: false, ...metadata });
}

function readyOneShot(label, src, gain) {
  return Object.freeze({ label, bus: "sfx", status: "ready", src, gain, loop: false });
}

function plannedVoice(label, src, transcript) {
  return Object.freeze({ label, bus: "voice", status: "planned", src, transcript, gain: 1, loop: false });
}

function readyVoice(label, src, transcript, duration = 0) {
  return Object.freeze({ label, bus: "voice", status: "ready", src, transcript, duration, gain: 1, loop: false });
}
