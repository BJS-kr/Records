/**
 * Question
 * Type the function PromiseAll that accepts an array of PromiseLike objects, the returning value should be Promise<T> where T is the resolved result array.
 */

// Answer
type Awitd<T> = T extends Promise<infer R> ? Awitd<R> : T;
type PromiseAll<T> = Promise<{ [K in keyof T]: Awitd<T[K]> }>;

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
type tt = PromiseAll<[typeof promise1, typeof promise2, typeof promise3]>;

// expected to be `Promise<[number, 42, string]>`
const p = Promise.all([promise1, promise2, promise3] as const);
