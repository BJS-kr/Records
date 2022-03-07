import { lazyFilter } from './filter.js';
import { go } from './go.js';
import { conReduce } from './reduce.js';
import { take } from './take.js';

/**
 * 명령형 코드를 lisP식으로 표현해봅시다.
 *
 * if는 filter로
 * 변수 할당은 map으로
 * break는 take로
 * 축약 or 합산은 reduce로
 *
 * 별 것 아닌 것 처럼 보여도, 위의 네 줄은 사실 모든 코드의 99%입니다.
 */

// 먼저 평범한 명령형 코드를 살펴봅시다.
function getOdds(limit, list) {
  let acc = 0;
  for (const v of list) {
    if (v % 2) acc + v;
    if (--limit === 0) break;
  }
  console.log(acc);
}

getOdds(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// iterable에 집중해 바라봐봅시다.
go(
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  // 지연평가해줍니다. 필요한 만큼만 연산하게 됩니다.
  lazyFilter((x) => x % 2),
  // concurrent하게 take하게 되면 오히려 손해입니다. 3개만 찾으면 되기 때문입니다.
  take(3),
  // 지금과 같은 상황에선 reduce는 concurrent하게 해주는 것이 좋습니다. 전혀 CPU intensive하지 않기 때문입니다.
  conReduce((acc, cur) => acc + cur),
  console.log
);
