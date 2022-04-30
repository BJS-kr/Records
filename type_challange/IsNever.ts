/**
 * Question
 * Implement a type IsNever, which takes input type T. If the type of resolves to never, return true, otherwise false.
 */

// Answer
type IsNever<T> = [T] extends [never] ? true : false;

type An = IsNever<never>; // expected to be true
type Bn = IsNever<undefined>; // expected to be false
type C = IsNever<null>; // expected to be false
type D = IsNever<[]>; // expected to be false
type E = IsNever<number>; // expected to be false
