const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "Oct 2024 – Oct 2025", or "Oct 2025 – Present" for an open range. */
export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = monthYear.format(new Date(startDate));
  const end = endDate != null ? monthYear.format(new Date(endDate)) : "Present";
  return `${start} – ${end}`;
}

export function getYear(date: string): number {
  return new Date(date).getUTCFullYear();
}
