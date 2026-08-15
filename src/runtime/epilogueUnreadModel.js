export function epilogueUnreadMessages(epilogue = {}, careChoices = {}) {
  return (epilogue.unreadMessages ?? []).map((message) => {
    const careChoice = message.caseId ? careChoices?.[message.caseId] ?? "" : "";
    const echo = careChoice ? message.echoes?.[careChoice] ?? "" : "";
    return {
      ...message,
      careChoice,
      echo,
      text: [message.base, echo].filter(Boolean).join(" ")
    };
  });
}

export function epilogueUnreadStage(epilogue = {}, careChoices = {}, step = 0) {
  const messages = epilogueUnreadMessages(epilogue, careChoices);
  const index = Math.max(0, Math.min(messages.length + 1, Number(step) || 0));
  return {
    index,
    messages,
    visibleMessages: messages.slice(0, Math.min(index, messages.length)),
    complete: index > messages.length,
    hasUnread: messages.length > 0
  };
}
