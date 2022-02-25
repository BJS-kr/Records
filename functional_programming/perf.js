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

P.mark('eval-all-start');
trd((x, y, i) => {
  if (i > 5000) return x;
  return x + y;
}, range(10000));
P.mark('eval-all-end');
P.measure('eval-all-result', 'eval-all-start', 'eval-all-end');

P.mark('eval-lazy-start');
trd((x, y, i) => {
  if (i > 5000) return x;
  return x + y;
}, lazyRange(10000));
P.mark('eval-lazy-end');
P.measure('eval-lazy-result', 'eval-lazy-start', 'eval-lazy-end');

// 결과: 압도적 차이
/**
 * eval-all-result 4.166100025177002
 * reduce 3.2450000047683716
 * eval-lazy-result 1.6902999877929688
 * reduce 1.6136999130249023
 */
