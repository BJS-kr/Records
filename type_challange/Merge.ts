/**
 * Question
 * Merge two types into a new type. Keys of the second type overrides keys of the first type.
 */

// Answer

// 무지성 intersection(F & T)은 겹치는 타입을 override하는게 아니라 never로 만들어버림
type Merge<F, T> = {
  [FK in keyof F as FK extends keyof T ? never : FK]: F[FK];
} & T;

type foo = {
  name: string;
  age: string;
};
type coo = {
  age: number;
  sex: string;
};

type ResultM = Merge<foo, coo>; // expected to be {name: string, age: number, sex: string}
const resultM: ResultM = { name: '', age: 1, sex: '' }; // Good!
