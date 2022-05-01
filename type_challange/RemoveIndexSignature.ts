/**
 * Question
 * Implement RemoveIndexSignature<T> , exclude the index signature from object types.
 */

// Answer
type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : symbol extends K
    ? never
    : number extends K
    ? never
    : K]: T[K];
};

type Foo = {
  [key: string]: any;
  [key: symbol]: any;
  [key: number]: any;
  foo(): void;
  bar: number;
};

type A = RemoveIndexSignature<Foo>; // expected { foo: () => void; bar: number; }
