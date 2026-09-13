/** "2026-08" -> "August 2026". Falls back to the raw string on unexpected
 *  input rather than throwing — a malformed billingMonth shouldn't crash
 *  the screen. */
export function formatBillingMonth(billingMonth: string): string {
  const [year, month] = billingMonth.split('-').map(Number);
  if (!year || !month) return billingMonth;
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "2026-09-15" -> "September 15, 2026". */
export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return dueDate;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
