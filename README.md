# get-jpaths

[![NPM version](https://img.shields.io/npm/v/get-jpaths.svg)](https://www.npmjs.com/package/get-jpaths)
[![npm download](https://img.shields.io/npm/dm/get-jpaths.svg)](https://www.npmjs.com/package/get-jpaths)
[![test coverage](https://img.shields.io/codecov/c/github/cheminfo/get-jpaths.svg)](https://codecov.io/gh/cheminfo/get-jpaths)
[![license](https://img.shields.io/npm/l/get-jpaths.svg)](https://github.com/cheminfo/get-jpaths/blob/main/LICENSE)

A small, fast utility to extract all JSON paths to primitive values from an object, with flexible control over traversal depth, array length limits, and regex-based path inclusion/exclusion filters.

## Features

- Recursively extracts all primitive leaf values with their JSON paths (dot notation).
- Limits recursion depth and maximum array elements processed.
- Filter included and excluded JSON paths via RegExp arrays.
- Supports plain objects, arrays, and typed arrays seamlessly.

## Installation

```console
npm install get-jpaths
```

## Usage

```js
import { getJPaths } from 'get-jpaths';

const data = {
  user: {
    name: 'Alice',
    password: 'secret',
  },
  settings: {
    theme: 'dark',
    notifications: true,
  },
};

const allPaths = getJPaths(data);
// Returns all primitive value paths in the object with defaults.

const filteredPaths = getJPaths(data, {
  maxArrayElements: 10,
  maxDepth: 5,
  includeJPathRegexps: [/^user./, /^settings.theme$/], // Include specified paths only
  excludeJPathRegexps: [/password/], // Exclude sensitive 'password' path
});

// filteredPaths:
// [
// { jpath: 'user.name', value: 'Alice' },
// { jpath: 'settings.theme', value: 'dark' }
// ]
console.log(filteredPaths);
```

Alternatively you can return an object mapping jpaths to their corresponding primitive value:

```js
import { getJPathsAsObject } from 'get-jpaths';

const data = {
  user: {
    name: 'Alice',
    password: 'secret',
  },
  settings: {
    theme: 'dark',
    notifications: true,
  },
};

const allPaths = getJPathsAsObject(data);

const filteredPaths = getJPathsAsObject(data, {
  maxArrayElements: 10,
  maxDepth: 5,
  includeJPathRegexps: [/^user./, /^settings.theme$/], // Include specified paths only
  excludeJPathRegexps: [/password/], // Exclude sensitive 'password' path
});

// filteredPaths:
// {
//   'user.name': 'Alice',
//   'settings.theme': 'dark'
// }
console.log(filteredPaths);
```

## License

[MIT](./LICENSE)

```

```
