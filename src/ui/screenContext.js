export function composeScreenContext({ session, queries, view }) {
  return {
    session,
    queries,
    view,
    ...session,
    ...queries,
    ...view
  };
}
