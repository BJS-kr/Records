import { go } from './go.js';
import { lazyMap } from './map.js';
import { take } from './take.js';

// null등을 검증하기 위하여 o && 추가
const isIterable = (o) => o && o[Symbol.iterator];
// 2차원까지만 배열을 평탄화
export const lazyFlatten = function* (iter) {
  for (const v of iter) {
    // 'yield* v' is same with 'for (const v2 of v) yield v2'
    if (isIterable(v)) yield* v;
    else yield v;
  }
};

export const lazyDeepFlatten = function* self(iter) {
  for (const v of iter) {
    if (isIterable(v)) yield* self(v);
    else yield v;
  }
};

go(
  lazyFlatten([
    [1, 2],
    [3, 4],
  ]),
  lazyMap((x) => x),
  take(3),
  console.log
);
console.log(...lazyDeepFlatten([1, [[2, [3, [4, [5, [[[[[6]]]]]]]]]]]));
