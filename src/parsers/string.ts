import {
  checkEmpty,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

export const StringParser = <TOptions extends StandardOptions>(
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<string | StandardOptionsReturn<TOptions>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  if (typeof inp.value !== 'string') {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: `Value "${inp.value}" is not a string`
        }
      ]
    };
  }

  return {
    value: inp.value,
    errors: []
  };
};
