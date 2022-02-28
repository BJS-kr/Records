import { log } from 'console';
import { curry } from './curry.js';
import { go, go1 } from './go.js';
import { pipe } from './pipe.js';
import { take } from './take.js';

export const lazyMap = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    yield go1(cur.value, f);
  }
});

export const map = curry(pipe(lazyMap, take(Infinity)));

go(
  [Promise.resolve(1), 4, Promise.resolve(2), 6, Promise.resolve(3)],
  lazyMap((x) => {
    return x + 10;
  }),
  take(4),
  log
);
