/**
 * Question
 * 내장 제네릭 Parameters<T>를 이를 사용하지 않고 구현하세요.
 */

// Answer
type MyParameters<T> = T extends (...parameters: infer P) => unknown
  ? P
  : never;

type Params = MyParameters<(param1: string, param2: number) => number>;
