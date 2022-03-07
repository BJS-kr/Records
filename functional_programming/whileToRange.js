import { each } from './each.js';
import { lazyRange } from './range.js';

// while을 range로 대체해봅시다.
function whileStatement(end) {
  let i = 0;
  while (i < end) {
    console.log(i);
    ++i;
  }
}

whileStatement(10);

// to lisp
// 참 간단하고 이해하기 쉽습니다. 조합, 분리, 디버깅 등 모든 면에 영향을 끼칩니다.
each(console.log, lazyRange(10));
