import {
  checkEmpty,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

export const NumberParser = <
  TOptions extends StandardOptions & { readonly allowNumeric?: boolean }
>(
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<number | StandardOptionsReturn<TOptions>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  if (typeof inp.value !== 'number') {
    if (typeof inp.value === 'string' && options && options.allowNumeric) {
      const parsed = parseFloat(inp.value);

      if (!isNaN(parsed)) {
        return {
          value: parsed,
          errors: []
        };
      } else {
        return {
          value: ValidationFail,
          errors: [
            {
              path: inp.path,
              message: `Value "${inp.value}" is not numeric`
            }
          ]
        };
      }
    }

    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: `Value "${inp.value}" is not a number`
        }
      ]
    };
  }

  return {
    value: inp.value,
    errors: []
  };
};
