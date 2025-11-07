/**
 * Formats an ISO date string to a custom readable format.
 *
 * @param {string} isoDate - The ISO date string.
 * @returns {string} - The formatted date string.
 */
export function formatCustomDate(isoDate: string): string {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);

  return date.toString();
}
