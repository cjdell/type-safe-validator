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

  // Allow stringified booleans
  if (inp.value === 'true') {
    return {
      value: true,
      errors: []
    };
  }

  // Allow stringified booleans
  if (inp.value === 'false') {
    return {
      value: false,
      errors: []
    };
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
