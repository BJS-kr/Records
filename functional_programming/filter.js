import { curry } from './curry.js';
import { pipe } from './pipe.js';
import { conTake, take } from './take.js';
import { go1 } from './go.js';
import { nop } from './resources.js';

export const lazyFilter = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const curV = cur.value;
    const curGo1 = go1(curV, f);
    if (curGo1 instanceof Promise) {
      // 여기서 promise상태로 yield해도 take가 promise를 풀어서 사용하기 때문에 상관없습니다.
      yield curGo1.then((curGo1Res) =>
        curGo1Res ? curV : Promise.reject(nop)
      );
    } else if (f(curV)) yield curV;
  }
});

export const filter = curry(pipe(lazyFilter, take(Infinity)));
export const conFilter = curry(pipe(lazyFilter, conTake(Infinity)));

