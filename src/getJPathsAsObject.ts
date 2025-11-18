import type { GetJPathsOptions } from './GetJPathsOptions.ts';
import { getJPaths } from './getJPaths.ts';

/**
 * Recursively extracts all JSON paths with their corresponding primitive values from an object.
 * @param obj - The input object or value to traverse.
 * @param options - Optional parameters to control traversal and filtering.
 * @returns an object mapping jpaths to their corresponding primitive values.
 */
export function getJPathsAsObject(
  obj: unknown,
  options: GetJPathsOptions = {},
): Record<string, string | number | boolean> {
  const jpaths = getJPaths(obj, options);
  const result: Record<string, string | number | boolean> = {};

  for (const entry of jpaths) {
    result[entry.jpath] = entry.value;
  }

  return result;
}
