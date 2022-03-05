import { curry } from './curry.js';
import { go1 } from './go.js';
import { pipe } from './pipe.js';
import { conTake, take } from './take.js';

export const lazyMap = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    yield go1(cur.value, f);
  }
});

export const map = curry(pipe(lazyMap, take(Infinity)));
export const conMap = curry(pipe(lazyMap, conTake(Infinity)));

