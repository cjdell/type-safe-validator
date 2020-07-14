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

export const ObjectParser = <
  TSchema extends Record<string, Parser<any>>,
  TOptions extends StandardOptions
>(
  schema: TSchema,
  options?: TOptions,
  intercept?: (
    inp: ParserInput<ObjectSchemaToValue<TSchema>>
  ) => ObjectSchemaToValue<TSchema>
) => (
  inp: ParserInput
): ParserResult<
  ObjectSchemaToValue<TSchema> | StandardOptionsReturn<TOptions>
> & { readonly schema: TSchema } => {
  if (intercept) {
    try {
      // tslint:disable-next-line: no-parameter-reassignment
      inp = {
        value: intercept(inp),
        path: inp.path
      };
    } catch (err) {
      return {
        value: ValidationFail,
        errors: [
          {
            path: inp.path,
            message: err.message
          }
        ],
        schema
      };
    }
  }

  const emptyResult = checkEmpty(inp, options);

  if (emptyResult) {
    return { ...emptyResult, schema };
  }

  if (typeof inp.value !== 'object') {
    return {
      value: ValidationFail,
      errors: [
        {
          path: inp.path,
          message: 'Value is not an object'
        }
      ],
      schema
    };
  }

  const ret: any = {};
  const errors: ValidationError[] = [];

  Object.entries(schema).forEach(([propName, propParser]) => {
    const propResult = propParser({
      path: [...inp.path, `Property "${propName}"`],
      value: inp.value[propName]
    });

    errors.push(...propResult.errors);

    // tslint:disable-next-line: no-object-mutation
    ret[propName] = propResult.value;
  });

  const hasErrors = errors.length > 0;

  if (hasErrors) {
    return {
      value: ValidationFail,
      errors,
      schema
    };
  } else {
    return {
      value: ret,
      errors: [],
      schema
    };
  }
};

type ObjectSchemaToValue<TSchema extends Record<string, Parser<any>>> = {
  [P in keyof TSchema]: TSchema[P] extends Parser<infer TValue>
    ? TValue
    : never;
};
