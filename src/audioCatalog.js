export const AUDIO_CUE_BUSES = Object.freeze(["bgm", "ambience", "sfx", "voice"]);
export const AUDIO_CUE_STATUSES = Object.freeze(["ready", "planned"]);

export const AUDIO_CUES = Object.freeze({
  "ui.click": readySynth("界面点击", "click"),
  "ui.confirm": readySynth("确认", "confirm"),
  "ui.warning": readySynth("警告", "warning"),
  "ui.page": readySynth("翻页", "page"),

  "bgm.title-nightshift": readyLoop("夜班标题", "bgm", "./assets/audio/bgm/title-nightshift.ogg", 0.72),
  "bgm.live-call": plannedLoop("直播连线", "bgm", "./assets/audio/bgm/live-call.ogg", 0.66),
  "bgm.pressure-stem": readyLoop("现场压力层", "bgm", "./assets/audio/bgm/pressure-stem.ogg", 0.48),
  "bgm.offair-desk": plannedLoop("收麦调查台", "bgm", "./assets/audio/bgm/offair-desk.ogg", 0.62),
  "bgm.day-investigation": plannedLoop("白天调查", "bgm", "./assets/audio/bgm/day-investigation.ogg", 0.64),
  "bgm.callback-return": plannedLoop("夜间回拨", "bgm", "./assets/audio/bgm/callback-return.ogg", 0.68),
  "bgm.accusation": plannedLoop("最终追问", "bgm", "./assets/audio/bgm/accusation.ogg", 0.7),
  "bgm.recap-afterhours": plannedLoop("收麦回看", "bgm", "./assets/audio/bgm/recap-afterhours.ogg", 0.58),
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

  "sfx.phone.connect": readyOneShot("热线接通", "./assets/audio/sfx/phone-connect.ogg", 0.8),
  "sfx.phone.disconnect": readyOneShot("连线断开", "./assets/audio/sfx/phone-disconnect.ogg", 0.78),
  "sfx.phone.soft-hangup": plannedOneShot("轻挂电话", "./assets/audio/sfx/phone-soft-hangup.ogg", 0.76),
  "sfx.phone.busy": plannedOneShot("忙音", "./assets/audio/sfx/phone-busy.ogg", 0.72),
  "sfx.broadcast.on-air": readyOneShot("ON AIR 继电器", "./assets/audio/sfx/broadcast-on-air.ogg", 0.74),
  "sfx.message.notification": readyOneShot("后台消息", "./assets/audio/sfx/message-notification.ogg", 0.68),
  "sfx.document.mark": readyOneShot("材料圈点", "./assets/audio/sfx/document-mark.ogg", 0.66),
  "sfx.case1.lamp-drag": plannedOneShot("灯架拖地", "./assets/audio/sfx/case1-lamp-drag.ogg", 0.82),

  "voice.broadcast.countdown": plannedVoice("导播倒数", "./assets/audio/voice/broadcast-countdown.ogg", "三、二、一。ON AIR。"),
  "voice.case1.loyalty-message": plannedVoice("案1·怕你离开", "./assets/audio/voice/case1-loyalty-message.ogg", "我只是怕你知道我失业后就离开我。"),
  "voice.case2.dryer-message": readyVoice("案2·吹风机回放", "./assets/audio/voice/case2-dryer-message.ogg", "今晚又被店长说了，只有你能接住我。"),
  "voice.case3.dinner-pause": plannedVoice("案3·饭局停顿", "./assets/audio/voice/case3-dinner-pause.ogg", "本科也是那所学校吗？"),
  "voice.case4.pad-message": plannedVoice("案4·垫款私聊", "./assets/audio/voice/case4-pad-message.ogg", "你先顶上，复盘材料里可以写你主责。"),
  "voice.case4.supplier-message": plannedVoice("案4·供应商补话", "./assets/audio/voice/case4-supplier-message.ogg", "服务协调费按老规矩返给对接人。"),
  "voice.advisor.zhang-closed": plannedVoice("张法医·停止收件", "./assets/audio/voice/advisor-zhang-closed.ogg", "不能。像素真假我答过了，学历口径让当事人自己去学信网核。别拿复印件替人作证。")
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
