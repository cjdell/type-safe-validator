import assert from 'assert';
import {
  getValid,
  NumberParser,
  ObjectParser,
  TupleParser,
  ValidationFail
} from '.';
import { deepEqual } from './test';

describe('index', () => {
  interface Schema {
    readonly a: number;
    readonly b: number | null;
    readonly c: readonly [number, number | null, number | undefined];
  }

  const schema = ObjectParser({
    a: NumberParser(),
    b: NumberParser({ nullable: true }),
    c: TupleParser([
      NumberParser(),
      NumberParser({ nullable: true }),
      NumberParser({ optional: true })
    ] as const)
  });

  it('can validate', () => {
    const [result, errors] = getValid(schema, {
      a: 1,
      b: null,
      c: [2, null, undefined]
    });

    if (result === ValidationFail) {
      assert.fail('Validation failed');
      return;
    }

    // Check schema conformance
    const answer: Schema = result;

    deepEqual(answer, { a: 1, b: null, c: [2, null, undefined] });
    deepEqual(errors, []);
  });

  it('can detect errors', () => {
    const [result, errors] = getValid(schema, {
      a: 1,
      b: undefined,
      c: ['a', null, undefined]
    });

    deepEqual(result, ValidationFail);
    deepEqual(errors, [
      {
        path: ['Property "b"'],
        message: 'Value is not optional'
      },
      {
        path: ['Property "c"', 'Tuple Element 0'],
        message: 'Value "a" is not a number'
      }
    ]);
  });
});
