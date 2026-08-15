export const DEFAULT_PLAYER_NAME = "林旭阳";
export const PLAYER_NAME_MAX_LENGTH = 12;

export function normalizePlayerName(value = DEFAULT_PLAYER_NAME) {
  const cleaned = String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(cleaned).slice(0, PLAYER_NAME_MAX_LENGTH).join("") || DEFAULT_PLAYER_NAME;
}

export function personalizeHostText(value = "", playerName = DEFAULT_PLAYER_NAME) {
  const name = normalizePlayerName(playerName);
  const familiarName = playerFamiliarName(name);
  return String(value ?? "")
    .replaceAll("旭阳哥", `${familiarName}哥`)
    .replaceAll(DEFAULT_PLAYER_NAME, name);
}

export function personalizeHostHtml(value = "", playerName = DEFAULT_PLAYER_NAME) {
  const name = normalizePlayerName(playerName);
  return String(value ?? "")
    .replaceAll("旭阳哥", escapeHtml(`${playerFamiliarName(name)}哥`))
    .replaceAll(DEFAULT_PLAYER_NAME, escapeHtml(name));
}

export function playerFamiliarName(value = DEFAULT_PLAYER_NAME) {
  const name = normalizePlayerName(value);
  const chars = Array.from(name);
  return chars.length >= 3 && chars.every((char) => /[\u3400-\u9fff]/.test(char))
    ? chars.slice(-2).join("")
    : name;
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
