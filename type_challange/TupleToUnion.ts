/**
 * Question
 * 튜플 값으로 유니온 타입을 생성하는 제네릭 TupleToUnion<T>를 구현하세요.
 */

// Answer
type TupleToUnion<T extends any[]> = T[number];
type Arr = ['1', '2', '3'];

type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'
