import {
  checkEmpty,
  Parser,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

export const RecordParser = <
  TKey extends string | number | symbol,
  TValue,
  TOptions extends StandardOptions
>(
  keyParser: Parser<TKey>,
  elementParser: Parser<TValue>,
  options?: TOptions
) => {
  return (
    inp: ParserInput
  ): ParserResult<
    | {
        readonly [P in TKey]: TValue;
      }
    | StandardOptionsReturn<TOptions>
  > => {
    const emptyResult = checkEmpty(inp, options);

    if (emptyResult) {
      return emptyResult;
    }

    if (typeof inp.value !== 'object') {
      return {
        value: ValidationFail,
        errors: [
          {
            path: inp.path,
            message: 'Value is not an object'
          }
        ]
      };
    }

    const propResults = Object.keys(inp.value).map(key => {
      return [
        keyParser({
          path: [...inp.path, `Property ${key} Key`],
          value: key
        }),
        elementParser({
          path: [...inp.path, `Property ${key} Value`],
          value: inp.value[key]
        })
      ];
    });

    const hasErrors = propResults.some(
      r => r[0].errors.length > 0 || r[1].errors.length > 0
    );

    if (hasErrors) {
      return {
        value: ValidationFail,
        errors: flatten(propResults.map(r => [...r[0].errors, ...r[1].errors]))
      };
    } else {
      const record: { readonly [P in TKey]: TValue } = {} as any;

      return {
        value: propResults.reduce(
          (obj, prop) => ({
            ...obj,
            [String(prop[0].value)]: prop[1].value
          }),
          record
        ),
        errors: []
      };
    }
  };
};

function flatten<T>(arr: readonly (T | readonly T[])[]): readonly T[] {
  const ret: T[] = [];

  for (const item of arr) {
    if ('map' in item) {
      ret.push(...item);
    } else {
      ret.push(item);
    }
  }

  return ret;
}
