import { curry } from './curry.js';
import { lazyFilter } from './filter.js';
import { go, go1 } from './go.js';
import { lazyMap } from './map.js';
import { nop } from './resources.js';

const conReduce = curry((f, initV, iter) => {
  // map등을 써서 iter를 catch가 달린 each element들로 변경하면 안됩니다.
  // then과 다르게, catch는 오직 한 번밖에 사용할 수 없기 때문입니다.
  // 이 부분에선 에러처리를 원하는 것이 아니라 unhandled rejection이 출력되는 것만 막고자 함인데,
  // 아예 catch가 달린 element들로 배열을 변경해버린다면 이후의 작업에서 실제로 catch를 하고자 할때 처리가 되지 않습니다.
  // 그러므로 iter를 catch가 달린 elem들로 재할당하지 않고, forEach를 통해 단지 동작이 없는 함수로 rejection error메세지만 출력하지 않도록 처리해두는 것입니다.
  let conIter;
  (conIter = iter ? [...iter] : [...initV]).forEach((each) =>
    each instanceof Promise ? each.catch((e) => e) : each
  );

  return iter ? reduce(f, initV, conIter) : reduce(f, conIter);
});

const reduceF = (f, acc, curV, i) => {
  return curV instanceof Promise
    ? curV.then(
        (curV) => f(acc, curV, i),
        (err) => (err == nop ? acc : Promise.reject(err))
      )
    : f(acc, curV, i);
};

export const reduce = curry((f, initV = null, iterable) => {
  let acc;
  let i = 0;

  if (!iterable) {
    try {
      Symbol.iterator in initV;

      iterable = initV[Symbol.iterator]();
      acc = iterable.next().value;
    } catch {
      throw new Error('reduce function must be used with iterable');
    }
  } else {
    acc = initV;
  }

  function recur(acc) {
    let cur;
    while (!(cur = iterable.next()).done) {
      const curV = cur.value;
      // 루프를 먼저 돌아버려 acc를 먼저 다시 대입하기 때문에 reduceF함수화
      acc = reduceF(f, acc, curV, i);

      if (acc instanceof Promise) {
        return acc.then(recur);
      }
    }

    return acc;
  }

  return go1(acc, recur);
});

