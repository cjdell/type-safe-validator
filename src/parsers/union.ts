import { ArrayElementType } from '../util';
import {
  Parser,
  ParserInput,
  ParserResult,
  ValidationError,
  ValidationFail
} from './common';

export const UnionParser = <TSchema extends ReadonlyArray<Parser<any>>>(
  schema: TSchema
) => (inp: ParserInput): ParserResult<UnionSchemaToValue<TSchema>> => {
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
