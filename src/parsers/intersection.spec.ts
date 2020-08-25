import { deepEqual } from '../test';
import { Parser } from './common';
import { IntersectionParser } from './intersection';
import { LiteralParser } from './literal';
import { NumberParser } from './number';
import { ObjectParser } from './object';
import { StringParser } from './string';

describe('intersection', () => {
  interface Foo {
    readonly foo: 'foo';
    readonly thing: number;
  }

  interface Bar {
    readonly bar: 'bar';
    readonly stuff: string;
  }

  const FooParser: Parser<Foo> = ObjectParser({
    foo: LiteralParser(['foo'] as const),
    thing: NumberParser()
  });

  const BarParser: Parser<Bar> = ObjectParser({
    bar: LiteralParser(['bar'] as const),
    stuff: StringParser()
  });

  const FooAndBarParser: Parser<Foo & Bar> = IntersectionParser([
    FooParser,
    BarParser
  ]);

  it('empty object', () => {
    const result = FooAndBarParser({ path: [], value: {} });

    deepEqual(result.errors, [
      {
        path: [],
        message: 'One or more intersection parsers failed validation'
      },
      {
        path: ['Parser 0', 'Property "foo"'],
        message: 'Value is not optional'
      },
      {
        path: ['Parser 0', 'Property "thing"'],
        message: 'Value is not optional'
      }
    ]);
  });

  it('invalid for partial type', () => {
    const result = FooAndBarParser({
      path: [],
      value: {
        foo: 'foo',
        thing: 123
      }
    });

    deepEqual(result.errors, [
      {
        path: [],
        message: 'One or more intersection parsers failed validation'
      },
      {
        path: ['Parser 1', 'Property "bar"'],
        message: 'Value is not optional'
      },
      {
        path: ['Parser 1', 'Property "stuff"'],
        message: 'Value is not optional'
      }
    ]);
  });

  it('valid for complete object', () => {
    const result = FooAndBarParser({
      path: [],
      value: {
        foo: 'foo',
        bar: 'bar',
        thing: 123,
        stuff: 'stuff'
      }
    });

    deepEqual(result.errors, []);
    deepEqual(result.value, {
      foo: 'foo',
      bar: 'bar',
      thing: 123,
      stuff: 'stuff'
    });
  });
});
