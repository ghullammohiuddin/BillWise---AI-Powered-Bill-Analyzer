/**
 * Handoff Section 4, principle 7: always format amounts as PKR with proper
 * thousands separators — "18,740 PKR", never "18740".
 */
export function formatPKR(amount: number): string {
  return `${amount.toLocaleString('en-US')} PKR`;
}
