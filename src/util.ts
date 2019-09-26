export type ArrayElementType<
  TArray extends ReadonlyArray<any>
> = TArray extends ReadonlyArray<infer T> ? T : never;
