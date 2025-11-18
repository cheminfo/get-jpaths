import { isAnyArray } from 'is-any-array';

type JPathValue = string | number | boolean;

interface JPathEntry {
  jpath: string;
  value: JPathValue;
}

interface GetJPathsOptions {
  /**
   * Maximum number of array elements to traverse at each level.
   * @default 5
   */
  maxArrayElements?: number;

  /**
   * Maximum depth to traverse nested objects/arrays.
   * @default 3
   */
  maxDepth?: number;

  /**
   * Array of RegExp instances; only jpaths matching any of these regexps are included.
   * If omitted or empty, all paths are included unless excluded by excludeJPaths.
   * @default []
   */
  includeJPathRegexps?: RegExp[];

  /**
   * Array of RegExp instances; jpaths matching any of these regexps are excluded.
   * Overrides inclusion filters (i.e., if a jpath is in excludeJPaths, it's never included).
   * @default []
   */
  excludeJPathRegexps?: RegExp[];
}

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
