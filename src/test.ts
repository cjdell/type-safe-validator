import assert from 'assert';

/**
 * Statically typed version of asset.deepEqual
 */
export function deepEqual<T>(actual: T, expected: T): void {
  return assert.deepEqual(actual, expected);
}
