/**
 * Replaces all occurrences of specific characters in a text with spaces.
 *
 * @param {string} text - The input text to process.
 * @param {string | string[]} characters - The character(s) to remove.
 * @returns {string} - The modified text with the specified characters replaced by spaces.
 */
export function replaceCharactersWithSpace(
  text: string,
  characters: string | string[]
): string {
  if (!text) return text;

  // Ensure characters is an array for flexibility
  const charArray: string[] = Array.isArray(characters)
    ? characters
    : [characters];
  const escapedChars: string = charArray.map((char) => `\\${char}`).join(""); // Escape special characters

  const regex: RegExp = new RegExp(`[${escapedChars}]`, "g");
  return text.replace(regex, " ");
}
