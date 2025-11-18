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
