type JPathValue = string | number | boolean;

export interface JPathEntry {
  jpath: string;
  value: JPathValue;
}
export interface GetJPathsOptions {
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
