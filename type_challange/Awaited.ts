/**
 * Question
 * If we have a type which is wrapped type like Promise.
 * How we can get a type which is inside the wrapped type?
 * For example if we have Promise<ExampleType> how to get ExampleType?
 */

// Answer
type AwaitedType<T> = T extends Promise<infer R> ? AwaitedType<R> : T;
type Resolved = AwaitedType<Promise<Promise<number>>>;
