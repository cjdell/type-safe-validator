import {
  checkEmpty,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationFail
} from './common';

export const LiteralParser = <
  TLiteralType extends string | number,
  TOptions extends StandardOptions
>(
  literals: readonly TLiteralType[],
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<TLiteralType | StandardOptionsReturn<TOptions>> & {
  readonly literals: readonly TLiteralType[];
} => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return { ...emptyResult, literals };
  }

  if (literals.indexOf(inp.value) === -1) {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: `Value "${inp.value}" is not in (${literals
            .map(l => `"${l}"`)
            .join(',')})`
        }
      ],
      literals
    };
  }

  return {
    errors: [],
    value: inp.value,
    literals
  };
};
