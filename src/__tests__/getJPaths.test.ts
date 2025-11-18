import { expect, test } from 'vitest';

import { getJPaths } from '../getJPaths.ts';

test('number, string, boolean types', () => {
  const a = 1;
  const b = 'string';
  const c = true;
  const d = null;

  expect(getJPaths(a)).toStrictEqual([{ jpath: '', value: 1 }]);
  expect(getJPaths(b)).toStrictEqual([{ jpath: '', value: 'string' }]);
  expect(getJPaths(c)).toStrictEqual([{ jpath: '', value: true }]);
  expect(getJPaths(d)).toStrictEqual([]);
});

test('simple array and object', () => {
  const arr = [1, 'two', false];

  expect(getJPaths(arr)).toStrictEqual([
    { jpath: '0', value: 1 },
    { jpath: '1', value: 'two' },
    { jpath: '2', value: false },
  ]);

  const obj = {
    x: 42,
    y: 'hello',
    z: true,
  };

  expect(getJPaths(obj)).toStrictEqual([
    { jpath: 'x', value: 42 },
    { jpath: 'y', value: 'hello' },
    { jpath: 'z', value: true },
  ]);
});

test('nested object', () => {
  const input = {
    a: {
      b: 1,
      c: [true, false],
    },
    d: 'hello',
    e: null,
    f: undefined,
    g: {
      h: {
        i: 3.14,
      },
    },
  };

  const expectedOutput = [
    { jpath: 'a.b', value: 1 },
    { jpath: 'a.c.0', value: true },
    { jpath: 'a.c.1', value: false },
    { jpath: 'd', value: 'hello' },
    { jpath: 'g.h.i', value: 3.14 },
  ];

  expect(getJPaths(input)).toStrictEqual(expectedOutput);
});

test('maxArrayElements option limits traversal', () => {
  const arr = [10, 20, 30, 40, 50, 60];
  const output = getJPaths(arr, { maxArrayElements: 3 });

  expect(output).toStrictEqual([
    { jpath: '0', value: 10 },
    { jpath: '1', value: 20 },
    { jpath: '2', value: 30 },
  ]);
});

test('maxDepth option limits recursion', () => {
  const input = {
    level1: {
      level2: {
        level3: {
          x: 42,
        },
      },
    },
    shallow: true,
  };

  const output = getJPaths(input, { maxDepth: 1 });

  // Only level1 and shallow are within depth 1
  expect(output).toStrictEqual([{ jpath: 'shallow', value: true }]);

  const deeperOutput = getJPaths(input, { maxDepth: 2 });

  // level2 is visible but level3 is cut off
  expect(deeperOutput).toStrictEqual([{ jpath: 'shallow', value: true }]);
});

test('object containing typed array with 10 elements', () => {
  const input = {
    myTypedArray: new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  };

  const expected = [
    { jpath: 'myTypedArray.0', value: 0 },
    { jpath: 'myTypedArray.1', value: 1 },
    { jpath: 'myTypedArray.2', value: 2 },
    { jpath: 'myTypedArray.3', value: 3 },
    { jpath: 'myTypedArray.4', value: 4 },
  ];

  const result = getJPaths(input, { maxArrayElements: 5 });

  expect(result).toStrictEqual(expected);
});

test('includeJPathRegexps option filters included paths', () => {
  const input = {
    user: { name: 'Alice', password: 'secret', email: 'alice@example.com' },
    settings: { theme: 'dark', notifications: true },
    version: 1,
  };

  const options = { includeJPathRegexps: [/^user\./, /^settings\.theme$/] };

  const expected = [
    { jpath: 'user.name', value: 'Alice' },
    { jpath: 'user.password', value: 'secret' },
    { jpath: 'user.email', value: 'alice@example.com' },
    { jpath: 'settings.theme', value: 'dark' },
  ];

  const result = getJPaths(input, options);

  expect(result).toStrictEqual(expected);
});

test('excludeJPathRegexps option filters out excluded paths', () => {
  const input = {
    user: { name: 'Bob', password: '12345', email: 'bob@example.com' },
    settings: { theme: 'light', notifications: false },
    version: 2,
  };

  const options = { excludeJPathRegexps: [/password/, /notifications/] };

  const expected = [
    { jpath: 'user.name', value: 'Bob' },
    { jpath: 'user.email', value: 'bob@example.com' },
    { jpath: 'settings.theme', value: 'light' },
    { jpath: 'version', value: 2 },
  ];

  const result = getJPaths(input, options);

  expect(result).toStrictEqual(expected);
});

test('combined includeJPathRegexps and excludeJPathRegexps', () => {
  const input = {
    user: { name: 'Carol', password: 'xyz', email: 'carol@example.com' },
    settings: { theme: 'blue', notifications: true },
    meta: { created: '2023-01-01' },
  };

  const options = {
    includeJPathRegexps: [/^user\./, /^settings\./],
    excludeJPathRegexps: [/password/, /notifications/],
  };

  const expected = [
    { jpath: 'user.name', value: 'Carol' },
    { jpath: 'user.email', value: 'carol@example.com' },
    { jpath: 'settings.theme', value: 'blue' },
  ];

  const result = getJPaths(input, options);

  expect(result).toStrictEqual(expected);
});
