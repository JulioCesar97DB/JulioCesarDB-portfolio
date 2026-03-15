/**
 * Formats a date range from ISO date strings into "YYYY - YYYY" or "YYYY - Present".
 */
export function formatDateRange(startDate: string, endDate: string | null): string {
	const startYear = new Date(startDate).getFullYear();
	const endYear = endDate != null ? new Date(endDate).getFullYear() : "Present";
	return `${startYear} - ${endYear}`;
}

/**
 * Extracts the year from an ISO date string.
 */
export function getYear(date: string): number {
	return new Date(date).getFullYear();
}
