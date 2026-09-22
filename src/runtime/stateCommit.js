export function createStateCommit({ getState, saveState, render }) {
  return function commit(mutator, { render: shouldRender = true } = {}) {
    mutator(getState());
    saveState();
    if (shouldRender) return render();
  };
}

export function resolveCommit(ctx) {
  return typeof ctx.commit === "function" ? ctx.commit : createStateCommit(ctx);
}
