import { AUDIO_BUS_IDS, audioVolumePercent, normalizeAudioSettings } from "../runtime/audioModel.js";

const BUS_LABELS = Object.freeze({
  master: "主音量",
  bgm: "配乐",
  ambience: "环境",
  sfx: "音效",
  voice: "语音"
});

export function audioSettingsPanelHtml(value = {}, { placement = "topbar" } = {}) {
  const settings = normalizeAudioSettings(value);
  return `
    <details class="audio-settings audio-settings-${escapeHtml(placement)}" data-audio-settings>
      <summary aria-label="打开声音设置">声音</summary>
      <section class="audio-settings-panel" aria-label="声音设置">
        <header>
          <b>声音设置</b>
          <button data-audio-mute type="button">${settings.enabled ? "全部静音" : "恢复声音"}</button>
        </header>
        ${AUDIO_BUS_IDS.map((busId) => audioVolumeRowHtml(settings, busId)).join("")}
      </section>
    </details>
  `;
}

function audioVolumeRowHtml(settings, busId) {
  const percent = audioVolumePercent(settings, busId);
  return `
    <label class="audio-volume-row">
      <span>${escapeHtml(BUS_LABELS[busId] ?? busId)}</span>
      <input data-audio-volume="${escapeHtml(busId)}" type="range" min="0" max="1" step="0.05" value="${settings[busId]}" ${settings.enabled ? "" : "disabled"}>
      <output data-audio-output="${escapeHtml(busId)}">${percent}%</output>
    </label>
  `;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
