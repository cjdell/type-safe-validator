import { deepEqual } from '../test';
import { Parser } from './common';
import { LiteralParser } from './literal';
import { NumberParser } from './number';
import { ObjectParser } from './object';
import { StringParser } from './string';
import { UnionParser } from './union';

describe('union', () => {
  describe('type property', () => {
    interface Foo {
      readonly type: 'foo';
      readonly thing: number;
    }

    interface Bar {
      readonly type: 'bar';
      readonly stuff: string;
    }

    const FooParser: Parser<Foo> = ObjectParser({
      type: LiteralParser(['foo'] as const),
      thing: NumberParser()
    });

    const BarParser: Parser<Bar> = ObjectParser({
      type: LiteralParser(['bar'] as const),
      stuff: StringParser()
    });

    describe('without type key', () => {
      const FooOrBarParser: Parser<Foo | Bar> = UnionParser([
        FooParser,
        BarParser
      ]);

      it('empty object', () => {
        const result = FooOrBarParser({ path: [], value: {} });

        deepEqual(result.errors, [
          { path: [], message: 'All union parsers failed validation' },
          {
            path: ['Parser 0', 'Property "type"'],
            message: 'Value is not optional'
          },
          {
            path: ['Parser 0', 'Property "thing"'],
            message: 'Value is not optional'
          },
          {
            path: ['Parser 1', 'Property "type"'],
            message: 'Value is not optional'
          },
          {
            path: ['Parser 1', 'Property "stuff"'],
            message: 'Value is not optional'
          }
        ]);
      });

      it('invalid for specific type', () => {
        const result = FooOrBarParser({
          path: [],
          value: {
            type: 'foo',
            thing: 'not a number'
          }
        });

        deepEqual(result.errors, [
          { path: [], message: 'All union parsers failed validation' },
          {
            path: ['Parser 0', 'Property "thing"'],
            message: 'Value "not a number" is not a number'
          },
          {
            path: ['Parser 1', 'Property "type"'],
            message: 'Value "foo" is not in ("bar")'
          },
          {
            path: ['Parser 1', 'Property "stuff"'],
            message: 'Value is not optional'
          }
        ]);
      });
    });

    describe('with type key', () => {
      const FooOrBarParser: Parser<Foo | Bar> = UnionParser(
        [FooParser, BarParser],
        { key: 'type' }
      );

      it('invalid for specific type', () => {
        const result = FooOrBarParser({
          path: [],
          value: {
            type: 'foo',
            thing: 'not a number'
          }
        });

        // With a type key we get less noise from parser we don't care about
        deepEqual(result.errors, [
          { path: [], message: 'All union parsers failed validation' },
          {
            path: ['Parser 0', 'Property "thing"'],
            message: 'Value "not a number" is not a number'
          }
        ]);
      });
    });
  });
});
