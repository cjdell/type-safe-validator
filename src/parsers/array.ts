import {
  checkEmpty,
  Parser,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

export const ArrayParser = <TValue, TOptions extends StandardOptions>(
  elementParser: Parser<TValue>,
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<readonly TValue[] | StandardOptionsReturn<TOptions>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  if (!Array.isArray(inp.value)) {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: 'Value is not an array'
        }
      ]
    };
  }

  const elementResults = inp.value.map((item, index) => {
    return elementParser({
      path: [...inp.path, `Element ${index}`],
      value: item
    });
  });

  const hasErrors = elementResults.some(r => r.errors.length > 0);

  if (hasErrors) {
    return {
      value: ValidationFail,
      errors: flatten(elementResults.map(r => r.errors))
    };
  } else {
    return {
      value: elementResults.map(r => r.value as TValue),
      errors: []
    };
  }
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
