// The public corrections log is the changelog's "corrected" entries, so there
// is one record of every correction, never two that can drift apart.
export const corrections = (entries) =>
  entries
    .filter((e) => e.type === 'corrected')
    .toSorted((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
