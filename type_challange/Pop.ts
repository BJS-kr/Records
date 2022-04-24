/**
 * Question
 * Implement a generic Pop<T> that takes an Array T and returns an Array without it's last element.
 */

// Answer
type Pop<T extends unknown[]> = T extends [...infer H, unknown] ? H : never;

type a1 = ['a', 'b', 'c', 'd'];
type a2 = [3, 2, 1];

type re1 = Pop<a1>; // expected to be ['a', 'b', 'c']
type re2 = Pop<a2>; // expected to be [3, 2]
