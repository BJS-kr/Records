/**
 * Question
 * If we have a type which is wrapped type like Promise.
 * How we can get a type which is inside the wrapped type?
 * For example if we have Promise<ExampleType> how to get ExampleType?
 */

// Answer
type AwaitedType<T> = T extends null
  ? T
  : T extends object & { then(onfullfilled: infer R): any }
  ? R extends (v:infer V):'':''

type t = Awaited<number>;
