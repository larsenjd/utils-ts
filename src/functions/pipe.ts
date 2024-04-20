/**
 * Reference: https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h
 */

type AnyFunc = (...arg: any) => any;

type PipeArgs<
    F extends AnyFunc[], Acc extends AnyFunc[] = []
> = F extends [(...args: infer A) => infer B]
      ? [...Acc, (...args: A) => B]
      : F extends [(...args: infer A) => any, ...infer Tail]
        ? Tail extends [(arg: infer B) => any, ...any[]]
          ? PipeArgs<Tail, [...Acc, (...args: A) => B]>
          : Acc
        : Acc;

type LastFnReturnType<
  F extends Array<AnyFunc>, Else = never
> = F extends [...any[], (...arg: any) => infer R]
      ? R
      : Else;

export function pipe<F extends AnyFunc[]>(
  arg: Parameters<F[0]>[0],
  ...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): LastFnReturnType<F, ReturnType<F[0]>> {
  return (fns.slice(1) as AnyFunc[]).reduce((acc, fn) => fn(acc), fns[0](arg));
}
