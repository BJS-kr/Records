/**
 * Question
 * Array.unshift의 타입 버전을 구현하세요.
 */

// Answer

type Unshift<T extends unknown[], U> = [U, ...T];
type Unshifted = Unshift<[1, 2], 0>; // [0, 1, 2,]
