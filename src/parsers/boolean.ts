import {
  checkEmpty,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

export const BooleanParser = <TOptions extends StandardOptions>(
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<boolean | StandardOptionsReturn<TOptions>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  if (typeof inp.value !== 'boolean') {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: `Value "${inp.value}" is not a boolean`
        }
      ]
    };
  }

  return {
    value: inp.value,
    errors: []
  };
};
