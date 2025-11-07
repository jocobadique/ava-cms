/**
 * Converts an array of key-value tuples (e.g. [["key1", value1], ...])
 * into a flat object like { key1: value1, ... }
 *
 * @param entries - An array of [key, value] pairs
 * @returns A flattened object with keys and values from the entries
 */
export const flattenData = (
  entries: [string, any][] = []
): Record<string, any> => {
  const result: Record<string, any> = {};

  entries.forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
};
