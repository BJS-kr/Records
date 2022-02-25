// lazy가 실제로 성능이 더 좋은지 검증해봅시다. 노드 내장모듈 perf_hooks를 사용하겠습니다.

import { log } from 'console';
import { performance as P, PerformanceObserver as O } from 'perf_hooks';
import { range, lazyRange } from './range.js';
import { reduce } from './reduce.js';

const trd = P.timerify(reduce);

const obs = new O((l) => {
  for (const stat of l.getEntries()) {
    log(stat.name, stat.duration);
  }
  obs.disconnect();
});

obs.observe({ entryTypes: ['function', 'measure'] });

trd((x, y, i) => {
  if (i > 5000) return x;
  return x + y;
}, range(10000));

trd((x, y, i) => {
  if (i > 5000) return x;
  return x + y;
}, lazyRange(10000));

try {
  P.mark('eval-all-start');
  reduce((x, y, i) => {
    if (i > 500) throw new Error('this is intended');
    return x + y;
  }, range(1000000));
} catch {
  P.mark('eval-all-end');
} finally {
  P.measure('eval-all-result', 'eval-all-start', 'eval-all-end');
}

try {
  P.mark('eval-lazy-start');
  reduce((x, y, i) => {
    if (i > 500) throw new Error('this is intended');
    return x + y;
  }, lazyRange(1000000));
} catch {
  P.mark('eval-lazy-end');
} finally {
  P.measure('eval-lazy-result', 'eval-lazy-start', 'eval-lazy-end');
}


// 결과: 압도적 차이. 평가해야하는 크기가 늘어날수록 이 차이는 더욱 심해진다.
/**
 * reduce 3.241599917411804
 * reduce 1.589900016784668
 * eval-all-result 13.891700029373169
 * eval-lazy-result 0.15079998970031738
 */
