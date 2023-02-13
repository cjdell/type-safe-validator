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
  readonly allowTypeCoercion?: boolean;
}

export const NumberParser = <TOptions extends NumberOptions>(
  optionsParameter?: TOptions
) => (
  inp: ParserInput
): ParserResult<number | StandardOptionsReturn<TOptions>> => {
  const options = {
    allowTypeCoercion: true,
    ...optionsParameter
    // tslint:disable-next-line: no-object-literal-type-assertion
  } as TOptions;

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
    if (inp.value === '' && options.optional && options.allowTypeCoercion) {
      return {
        value: undefined,
        errors: []
      };
    }

    if (inp.value === 'null' && options.nullable && options.allowTypeCoercion) {
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
