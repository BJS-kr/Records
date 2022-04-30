/**
 * Question
 * Implement a type IsUnion, which takes an input type T and returns whether T resolves to a union type.
 */

// Answer
// 문제 풀이 과정
// 1. A extends B ~ 에서 A가 union일 경우 distribute된다.
// 2. 즉, A와 B가 equivalent할 때에도 A[]등 (분배된 타입)과 B[]등(분배되지 않은 타입)은 달라지게 된다.
// ex) A가 string|number일 때, 배열로 분배된다면 string[] | number[], 분배되지 않은 타입은 (string|union)[]
type IsUnion<T, U = T> = T extends U ? (U[] extends T[] ? false : true) : never;

type case1 = IsUnion<string>; // false
type case2 = IsUnion<string | number>; // true
type case3 = IsUnion<[string | number]>; // false
