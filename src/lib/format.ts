/**
 * Formatting utilities for dates and other display values.
 */

/**
 * Format a date string (YYYY-MM-DD) into a readable form.
 * Example: "2025-01-28" → "January 28, 2025"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
