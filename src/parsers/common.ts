export type Parser<TValue> = (inp: ParserInput) => ParserResult<TValue>;

export interface ParserInput<T = any> {
  readonly value: T;
  readonly path: ParserPath;
}

export type ParserPath = readonly string[];

export interface ParserResult<TValue> {
  readonly value: TValue | ValidationFail;
  readonly errors: readonly ValidationError[];
}

export interface ValidationError {
  readonly path: ParserPath;
  readonly message: string;
}

export const ValidationFail = Symbol('ValidationFail');

export type ValidationFail = typeof ValidationFail;

export interface StandardOptions {
  readonly nullable?: boolean;
  readonly optional?: boolean;
}

export type StandardOptionsReturn<TOptions extends StandardOptions> =
  | (TOptions['nullable'] extends true ? null : never)
  | (TOptions['optional'] extends true ? undefined : never);

export function checkEmpty(
  inp: ParserInput,
  options?: StandardOptions
): ParserResult<any> | null {
  if (inp.value === null) {
    if (options && options.nullable) {
      return {
        value: null,
        errors: []
      };
    } else {
      return {
        value: ValidationFail,
        errors: [
          {
            path: inp.path,
            message: 'Value is not nullable'
          }
        ]
      };
    }
  }

  if (inp.value === undefined) {
    if (options && options.optional) {
      return {
        value: undefined,
        errors: []
      };
    } else {
      return {
        value: ValidationFail,
        errors: [
          {
            path: inp.path,
            message: 'Value is not optional'
          }
        ]
      };
    }
  }

  return null;
}
