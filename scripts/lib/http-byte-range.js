// Serve one byte range for native media seeking. Ignore unsupported range units
// and multipart requests; a syntactically valid out-of-file range is unsatisfiable.
export function parseByteRange(header, size) {
  if (typeof header !== "string") return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return null;
  if (!Number.isSafeInteger(size) || size <= 0) return { unsatisfiable: true };
  const first = match[1] ? Number(match[1]) : null;
  const last = match[2] ? Number(match[2]) : null;
  if ((first !== null && !Number.isSafeInteger(first)) || (last !== null && !Number.isSafeInteger(last))) return { unsatisfiable: true };
  if (first === null) return last === 0 ? { unsatisfiable: true } : { start: Math.max(0, size - last), end: size - 1 };
  if (first >= size || (last !== null && last < first)) return { unsatisfiable: true };
  return { start: first, end: last === null ? size - 1 : Math.min(last, size - 1) };
}
