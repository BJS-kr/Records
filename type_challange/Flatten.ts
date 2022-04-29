/**
 * Question
 * In this challenge, you would need to write a type that takes an array and emitted the flatten array type.
 */

// Answer
type Flatten<T> = T extends []
  ? T
  : T extends [infer E, ...infer EE]
  ? E extends Array<any>
    ? [...Flatten<E>, ...Flatten<EE>]
    : [E, ...Flatten<EE>]
  : never;

type flatten = Flatten<[1, 2, [[3, 4], [[[[5]]]]]]>; // [1, 2, 3, 4, 5]
