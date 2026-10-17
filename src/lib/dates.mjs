// Display format for verification dates: "08 Jul 2026" (DD Mon YYYY). Month
// names are fixed here rather than taken from Intl, whose en-GB short month
// for September varies between ICU versions ("Sep" vs "Sept").
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** @param {string} iso YYYY-MM-DD */
export const formatVerified = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
};

/** Oldest of several ISO dates (ISO strings sort lexically). @param {string[]} dates */
export const oldest = (dates) => [...dates].sort()[0];
