import { curry } from './curry.js';
import { go1 } from './go.js';
import { nop } from './resources.js';

const reduceF = (f, acc, curV, i) => {
  return curV instanceof Promise
    ? curV.then(
        (curV) => f(acc, curV, i),
        (err) => (err == nop ? acc : Promise.reject(err))
      )
    : f(acc, curV);
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
      // acc가 변하기 때문에 똑같은 모양의 코드를 함수에 담아서 실행시켜야 한다는데 무슨 말인지 이해가 잘 안간다.
      acc = reduceF(f, acc, curV, i);

      if (acc instanceof Promise) {
        return acc.then(recur);
      }
    }

    return acc;
  }

  return go1(acc, recur);
});
