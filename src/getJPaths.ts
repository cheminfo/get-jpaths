import { isAnyArray } from 'is-any-array';

import type { GetJPathsOptions, JPathEntry } from './GetJPathsOptions.ts';

/**
 * Recursively extracts all JSON paths with their corresponding primitive values from an object.
 * @param obj - The input object or value to traverse.
 * @param options - Optional parameters to control traversal and filtering.
 * @returns an array of objects each containing a jpath and its corresponding primitive value.
 */
export function getJPaths(
  obj: unknown,
  options: GetJPathsOptions = {},
): JPathEntry[] {
  const {
    maxArrayElements = 5,
    maxDepth = 3,
    includeJPathRegexps = [],
    excludeJPathRegexps = [],
  } = options;

  function matchesInclude(path: string): boolean {
    if (includeJPathRegexps.length === 0) return true;
    return includeJPathRegexps.some((re) => re.test(path));
  }

  function isExcluded(path: string): boolean {
    if (excludeJPathRegexps.length === 0) return false;
    return excludeJPathRegexps.some((re) => re.test(path));
  }

  function traverse(value: unknown, prefix = '', depth = 0): JPathEntry[] {
    // Stop if depth exceeds maximum
    if (depth > maxDepth) {
      return [];
    }

    let result: JPathEntry[] = [];

    if (isAnyArray(value)) {
      const limitedItems = value.slice(0, maxArrayElements);
      for (const [idx, item] of limitedItems.entries()) {
        const newPrefix = prefix ? `${prefix}.${idx}` : `${idx}`;
        result = result.concat(traverse(item, newPrefix, depth + 1));
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key of Object.keys(value)) {
        const child = (value as Record<string, unknown>)[key];
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        result = result.concat(traverse(child, newPrefix, depth + 1));
      }
    } else if (
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean') &&
      matchesInclude(prefix) &&
      !isExcluded(prefix)
    ) {
      result.push({ jpath: prefix, value });
    }

    return result;
  }

  return traverse(obj);
}
