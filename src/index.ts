import {
  Parser,
  ParserPath,
  ValidationError,
  ValidationFail
} from './parsers/common';

export * from './parsers';
export * from './util';

export function assertValid<TValue>(
  parser: Parser<TValue>,
  inp: unknown
): TValue {
  const result = parser({ path: [], value: inp });

  if (result.value === ValidationFail) {
    const errorLines = result.errors
      .map(err => `${getPathName(err.path)}: ${err.message}`)
      .join('\n');

    throw new Error(`Validation Failed\n${errorLines}`);
  }

  return result.value;
}

export function getValid<TValue>(
  parser: Parser<TValue>,
  inp: unknown
): readonly [TValue | ValidationFail, readonly ValidationError[]] {
  const result = parser({ path: [], value: inp });

  return [result.value, result.errors] as const;
}

function getPathName(path: ParserPath): string {
  if (path.length === 0) {
    return 'ROOT';
  }

  return path.join(' > ');
}

export type ParserReturn<TParser extends Parser<any>> = TParser extends Parser<
  infer T
>
  ? T
  : never;
