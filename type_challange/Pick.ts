/**
 * Question
 * T에서 K 프로퍼티만 선택해 새로운 오브젝트 타입을 만드는 내장 제네릭 Pick<T, K>을 이를 사용하지 않고 구현하세요.
 */

// Answer
type Picker<T, K extends keyof T> = { [key in K]: T[key] };

const original: { a: 'a'; b: 'b'; c: 'c' } = { a: 'a', b: 'b', c: 'c' };
const derived: Picker<typeof original, 'a' | 'b'> = { a: 'a', b: 'b' };
