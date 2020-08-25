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

export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends (k: infer I) => void
  ? I
  : never;

export const IntersectionParser = <
  TSchema extends ReadonlyArray<Parser<any>>,
  TOptions extends StandardOptions
>(
  schema: TSchema,
  options?: TOptions
) => (inp: ParserInput): ParserResult<IntersectionSchemaToValue<TSchema>> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  const errors: ValidationError[] = [];

  // tslint:disable-next-line: no-let
  let returnObj: any = {};

  for (const parser of schema) {
    const parserResult = parser({
      path: [...inp.path, `Parser ${schema.indexOf(parser)}`],
      value: inp.value
    });

    if (parserResult.errors.length === 0) {
      returnObj = { ...returnObj, ...parserResult.value };
    } else {
      errors.push(...parserResult.errors);
      break;
    }
  }

  if (errors.length === 0) {
    return {
      value: returnObj,
      errors: []
    };
  } else {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: 'One or more intersection parsers failed validation'
        },
        ...errors
      ]
    };
  }
};

type IntersectionSchemaToValue<
  TSchema extends ReadonlyArray<Parser<any>>
> = ArrayElementType<TSchema> extends Parser<infer TValue>
  ? UnionToIntersection<TValue>
  : never;
