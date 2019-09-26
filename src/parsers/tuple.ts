import {
  checkEmpty,
  Parser,
  ParserInput,
  ParserResult,
  StandardOptions,
  StandardOptionsReturn,
  ValidationError,
  ValidationFail
} from './common';

export const TupleParser = <
  TSchema extends Record<number, Parser<any>>,
  TOptions extends StandardOptions
>(
  schema: TSchema,
  options?: TOptions
) => (
  inp: ParserInput
): ParserResult<
  TupleSchemaToValue<TSchema> | StandardOptionsReturn<TOptions>
> => {
  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return emptyResult;
  }

  if (!Array.isArray(inp.value)) {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: 'Value is not an array (tuple)'
        }
      ]
    };
  }

  const tupleLength = (schema as any).length;

  if (tupleLength !== inp.value.length) {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: `Value should have ${tupleLength} elements`
        }
      ]
    };
  }

  const ret: any[] = [];
  const errors: ValidationError[] = [];

  Object.entries(schema).forEach(([propName, propParser]) => {
    const propResult = propParser({
      path: [...inp.path, `Tuple Element ${propName}`],
      value: inp.value[propName]
    });

    errors.push(...propResult.errors);

    // tslint:disable-next-line: no-object-mutation
    ret.push(propResult.value);
  });

  const hasErrors = errors.length > 0;

  if (hasErrors) {
    return {
      value: ValidationFail,
      errors
    };
  } else {
    return {
      value: ret as any,
      errors: []
    };
  }
};

type TupleSchemaToValue<TSchema extends Record<number, Parser<any>>> = {
  [P in keyof TSchema]: TSchema[P] extends Parser<infer TValue>
    ? TValue
    : never;
};
