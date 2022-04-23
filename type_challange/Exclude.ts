/**
 * Question
 * T에서 U에 할당할 수 있는 타입을 제외하는 내장 제네릭 Exclude<T, U>를 이를 사용하지 않고 구현하세요.
 */

// Answer
type Excluded<T, U> = T extends U ? never : T;
type ABC = 'a' | 'b' | 'c';
type Result = Excluded<ABC, 'a'>;
