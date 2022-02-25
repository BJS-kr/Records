import { log, time, timeEnd } from 'console';
import { curry } from './curry.js';
import { go } from './go.js';
import { lazyRange, range } from './range.js';

export const take = curry((limit, iter) => {
  let res = [];
  for (const v of iter) {
    res.push(v);
    if (res.length === limit) return res;
  }
  return res;
});

time('');
log(go(range(1000000), take(5)));
timeEnd('');

time('');
log(go(lazyRange(Infinity), take(5)));
timeEnd('');

/**
* [ 0, 1, 2, 3, 4 ]
* : 13.392ms
* [ 0, 1, 2, 3, 4 ]
* : 0.46ms
*/



