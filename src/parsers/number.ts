import {
  checkEmpty,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

interface NumberOptions extends StandardOptions {
  readonly allowNumeric?: boolean;
}

export const NumberParser = <TOptions extends NumberOptions>(
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<number | StandardOptionsReturn<TOptions>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  if (typeof inp.value !== 'number') {
    const nonNumberResult = handleNonNumber(inp, options);

    if (nonNumberResult) {
      return nonNumberResult;
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

const handleNonNumber = (
  inp: ParserInput,
  options?: NumberOptions
): ParserResult<any> | null => {
  if (typeof inp.value === 'string' && options && options.allowNumeric) {
    if (inp.value === '' && options.optional) {
      return {
        value: undefined,
        errors: []
      };
    }

    if (inp.value === 'null' && options.nullable) {
      return {
        value: null,
        errors: []
      };
    }

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

  return null;
};
