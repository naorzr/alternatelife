export function minutesToHours(minutes: number): number {
  return Math.round(minutes / 60);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatHours(hours: number): string {
  if (hours < 1) return "< 1 hour";
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = Math.floor(hours / 24);
  const remaining = Math.round(hours % 24);
  if (days < 30) {
    return remaining > 0 ? `${days}d ${remaining}h` : `${days} days`;
  }
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  return remainingDays > 0
    ? `${months}mo ${remainingDays}d`
    : `${months} months`;
}

export function formatDollars(hours: number): string {
  const dollars = Math.floor(hours * 7.25);
  return `$${formatNumber(dollars)}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `1 ${singular}`;
  return `${formatNumber(count)} ${plural ?? singular + "s"}`;
}
