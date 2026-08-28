import { gamepadAxisDirection, nextFocusIndex } from "../runtime/inputNavigation.js";

export function createFocusInputControl({ app }) {
  let gamepadPollingStarted = false;
  let gamepadPreviousButtons = {};
  let lastGamepadMoveAt = 0;

  function bind(selector, handler, eventName = "click") {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener(eventName, handler);
    });
  }

  function bindChoiceActivation(selector, handler) {
    document.querySelectorAll(selector).forEach((element) => {
      let lastPointerAt = 0;
      element.addEventListener("pointerup", () => {
        lastPointerAt = Date.now();
        handler(element);
      });
      element.addEventListener("click", () => {
        if (Date.now() - lastPointerAt < 350) return;
        handler(element);
      });
    });
  }

  function queueDefaultFocus() {
    requestAnimationFrame(() => setupDefaultFocus());
  }

  function setupDefaultFocus() {
    const active = document.activeElement;
    if (active && active !== document.body && isVisibleElement(active)) return;
    focusButton(preferredDefaultButton());
  }

  function preferredDefaultButton() {
    return topInteractiveScope()?.querySelector(
      "button.primary:not(:disabled), button[data-primary='true']:not(:disabled), button:not(:disabled)"
    ) ?? null;
  }

  function preferredBackButton() {
    return topInteractiveScope()?.querySelector('[data-material-close]:not(:disabled), [data-record-close]:not(:disabled), [data-retry-case]:not(:disabled), [data-action="rewind"]:not(:disabled), [data-action="title"]:not(:disabled)') ?? null;
  }

  function preferredReviewButton() {
    return app?.querySelector('[data-recap-next]:not(:disabled), [data-after-recap]:not(:disabled)') ?? null;
  }

  function toggleReviewPanel() {
    closeMaterialPanel();
    const record = app?.querySelector(".court-record");
    if (record) {
      const toggle = record.hidden
        ? app?.querySelector("[data-record-open]:not(:disabled)")
        : record.querySelector("[data-record-close]:not(:disabled)");
      toggle?.click();
      return true;
    }
    const panel = app?.querySelector(".choice-review");
    if (!panel) return false;
    panel.open = !panel.open;
    return true;
  }

  function moveButtonFocus(direction) {
    const buttons = focusableButtons();
    if (!buttons.length) return;
    const currentIndex = buttons.indexOf(document.activeElement);
    const nextIndex = nextFocusIndex({ currentIndex, total: buttons.length, direction });
    focusButton(buttons[nextIndex]);
  }

  function focusableButtons() {
    return Array.from(topInteractiveScope()?.querySelectorAll("button:not(:disabled)") ?? []).filter(isVisibleElement);
  }

  function topInteractiveScope() {
    const material = app?.querySelector(".avg-material-modal:not([hidden])");
    if (material) return material;
    const record = app?.querySelector(".court-record:not([hidden])");
    if (record) return record;
    const choices = app?.querySelector(".avg-choice-overlay:not([hidden])");
    if (choices?.querySelector("button:not(:disabled)") && isVisibleElement(choices)) return choices;
    return app;
  }

  function closeMaterialPanel() {
    const modal = app?.querySelector(".avg-material-modal:not([hidden])");
    const closeButton = modal?.querySelector(".avg-material-panel [data-material-close]");
    if (!closeButton) return false;
    closeButton.click();
    return true;
  }

  function closeTopOverlay() {
    if (closeMaterialPanel()) return true;
    const recordClose = app?.querySelector(".court-record:not([hidden]) [data-record-close]");
    if (!recordClose) return false;
    recordClose.click();
    return true;
  }

  function isVisibleElement(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function focusButton(button) {
    if (!button) return;
    try {
      button.focus({ preventScroll: true });
    } catch {
      button.focus();
    }
  }

  function activateButton(button) {
    if (!button || button.disabled) return;
    button.click();
  }

  function startGamepadPolling() {
    if (gamepadPollingStarted) return;
    if (typeof requestAnimationFrame !== "function") return;
    if (typeof globalThis.navigator?.getGamepads !== "function") return;
    gamepadPollingStarted = true;
    requestAnimationFrame(pollGamepads);
  }

  function pollGamepads() {
    const gamepad = firstActiveGamepad();
    if (gamepad) handleGamepadInput(gamepad);
    requestAnimationFrame(pollGamepads);
  }

  function firstActiveGamepad() {
    return Array.from(globalThis.navigator?.getGamepads?.() ?? []).find((item) => item?.connected) ?? null;
  }

  function handleGamepadInput(gamepad) {
    handleGamepadButton(gamepad, 0, () => {
      const dialogue = currentDialogueAdvance();
      if (dialogue) return dialogue.click();
      const focusedButton = document.activeElement?.matches?.("button:not(:disabled)") && isVisibleElement(document.activeElement)
        ? document.activeElement
        : null;
      if (focusedButton) return activateButton(focusedButton);
      activateButton(preferredDefaultButton());
    });
    handleGamepadButton(gamepad, 1, () => {
      if (!closeTopOverlay()) activateButton(preferredBackButton());
    });
    handleGamepadButton(gamepad, 3, () => {
      if (!toggleReviewPanel()) activateButton(preferredReviewButton());
    });
    handleGamepadButton(gamepad, 12, () => moveButtonFocus(-1));
    handleGamepadButton(gamepad, 13, () => moveButtonFocus(1));
    handleGamepadButton(gamepad, 14, () => moveButtonFocus(-1));
    handleGamepadButton(gamepad, 15, () => moveButtonFocus(1));
    handleGamepadAxis(gamepad);
  }

  function currentDialogueAdvance() {
    return Array.from(app?.querySelectorAll?.("[data-dialogue-advance]:not([data-dialogue-done])") ?? [])
      .find((element) => element.getClientRects().length > 0 && !element.closest("[hidden]")) ?? null;
  }

  function handleGamepadButton(gamepad, buttonIndex, handler) {
    const key = `${gamepad.index}:${buttonIndex}`;
    const pressed = Boolean(gamepad.buttons?.[buttonIndex]?.pressed);
    if (pressed && !gamepadPreviousButtons[key]) handler();
    gamepadPreviousButtons[key] = pressed;
  }

  function handleGamepadAxis(gamepad) {
    const now = Date.now();
    const direction = gamepadAxisDirection({ axes: gamepad.axes, lastMoveAt: lastGamepadMoveAt, now });
    if (!direction) return;
    moveButtonFocus(direction);
    lastGamepadMoveAt = now;
  }

  function keyEventInTextInput(event) {
    const target = event.target;
    const tagName = target?.tagName;
    return target?.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
  }

  return {
    bind,
    bindChoiceActivation,
    queueDefaultFocus,
    preferredDefaultButton,
    preferredBackButton,
    toggleReviewPanel,
    moveButtonFocus,
    closeTopOverlay,
    isVisibleElement,
    focusButton,
    activateButton,
    startGamepadPolling,
    currentDialogueAdvance,
    keyEventInTextInput
  };
}
