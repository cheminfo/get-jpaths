import { isAnyArray } from 'is-any-array';
import { expect, test } from 'vitest';

import { getJPathsAsObject } from '../getJPathsAsObject.ts';

test('an object with array and simple object', () => {
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

  const expectedOutput = {
    'a.b': 1,
    'a.c.0': true,
    'a.c.1': false,
    d: 'hello',
    'g.h.i': 3.14,
  };

  expect(getJPathsAsObject(input)).toStrictEqual(expectedOutput);
});

test('modifiers', () => {
  const input = {
    a: {
      b: 1,
      c: [true, false],
    },
    d: 'hello',
    e: [1, 2, 3],
    g: {
      h: {
        i: 3.14,
      },
    },
  };
  const result = getJPathsAsObject(input, {
    modifiers: {
      'a.b': (value: unknown) =>
        typeof value === 'number' ? value * 10 : value,
      'a.c': () => undefined,
      d: (value: unknown) =>
        typeof value === 'string' ? value.toUpperCase() : value,
      e: (value: unknown) => (isAnyArray(value) ? value.join(',') : value),
    },
  });
  const expectedOutput = { 'a.b': 10, d: 'HELLO', e: '1,2,3', 'g.h.i': 3.14 };

  expect(result).toStrictEqual(expectedOutput);
});
