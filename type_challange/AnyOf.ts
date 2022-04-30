/**
 * Question
 * Implement Python liked any function in the type system. A type takes the Array and returns true if any element of the Array is true. If the Array is empty, return false.
 */

// Answer
// 처음엔 엄청 간단하다고 생각했다. 1 extends T[number]하면 끝이라고 생각하고 풀었는데, js에선 1이건 true건 {}(object)로부터의 extends를 true로 판단한 다는 것을 깨달았다.
type AnyOf<T> = T extends [infer C, ...infer R]
  ? C extends 1
    ? true
    : AnyOf<R>
  : false;

type Sample1 = AnyOf<[1, '', false, [], {}]>; // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]>; // expected to be false.
