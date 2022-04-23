/**
 * Question
 * Array.push의 제네릭 버전을 구현하세요.
 */

// Answer
type Push<T extends unknown[], U> = [...T, U];
type Resulted = Push<[1, 2], '3'>; // [1, 2, '3']
