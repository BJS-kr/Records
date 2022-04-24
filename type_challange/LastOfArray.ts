/**
 * Question
 * Implement a generic Last<T> that takes an Array T and returns its last element.
 */

// Answer
type Last<T extends unknown[]> = T extends [...any[], infer L] ? L : never;

type arr_1 = ['a', 'b', 'c'];
type arr_2 = [3, 2, 1];

type tail1 = Last<arr_1>; // expected to be 'c'
type tail2 = Last<arr_2>; // expected to be 1
