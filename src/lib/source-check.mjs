// Diff check for vendor records: every field whose value changed between two
// versions must have a source for that field (or one of its sub-keys) that is
// new or carries a later verified date than before. The schema already makes
// every claimed field carry a source; this closes the gap where a value is
// edited but its source date is left alone.

const EXEMPT = new Set([
  'slug',
  'name',
  'url',
  'last_verified',
  'sources',
  'featured',
]);

const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const belongsTo = (sourceField, field) =>
  sourceField === field || sourceField.startsWith(`${field}.`);

const sourceKey = (s) => `${s.field} ${s.url}`;

export function unsourcedChanges(base, head) {
  if (!base) return [];
  const before = new Map(
    (base.sources ?? []).map((s) => [sourceKey(s), s.verified]),
  );
  const fields = new Set([...Object.keys(base), ...Object.keys(head)]);
  const findings = [];
  for (const field of fields) {
    if (EXEMPT.has(field) || sameValue(base[field], head[field])) continue;
    const refreshed = (head.sources ?? []).some((s) => {
      if (!belongsTo(s.field, field)) return false;
      const old = before.get(sourceKey(s));
      return old === undefined || s.verified > old;
    });
    if (!refreshed) findings.push(field);
  }
  return findings.sort();
}
