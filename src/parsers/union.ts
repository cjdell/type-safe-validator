import { ArrayElementType } from '../util';
import {
  checkEmpty,
  Parser,
  ParserInput,
  ParserResult,
  StandardOptions,
  ValidationError,
  ValidationFail
} from './common';

export const UnionParser = <
  TSchema extends ReadonlyArray<Parser<any>>,
  TOptions extends StandardOptions
>(
  schema: TSchema,
  options?: TOptions
) => (inp: ParserInput): ParserResult<UnionSchemaToValue<TSchema>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  const errors: ValidationError[] = [];

  for (const parser of schema) {
    const parserResult = parser({
      path: [...inp.path, `Parser ${schema.indexOf(parser)}`],
      value: inp.value
    });

    if (parserResult.errors.length === 0) {
      return parserResult;
    }

    errors.push(...parserResult.errors);
  }

  return {
    value: ValidationFail,
    errors: [
      {
        path: inp.path,
        message: 'All union parsers failed validation'
      },
      ...errors
    ]
  };
};

type UnionSchemaToValue<
  TSchema extends ReadonlyArray<Parser<any>>
> = ArrayElementType<TSchema> extends Parser<infer TValue> ? TValue : never;
