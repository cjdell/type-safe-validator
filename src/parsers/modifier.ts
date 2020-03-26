import {
  checkEmpty,
  Parser,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn
} from './common';

export const ModifierParser = <
  TParser extends Parser<any>,
  TOptions extends StandardOptions
>(
  parser: TParser,
  options: TOptions
) => (
  inp: ParserInput
): ParserResult<
  | (TParser extends Parser<infer TResult> ? TResult : never)
  | StandardOptionsReturn<TOptions>
> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  return parser(inp);
};
