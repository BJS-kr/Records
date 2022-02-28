import { curry } from './curry.js';

export const take = curry((limit, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const curV = cur.value;
      if (curV instanceof Promise) {
        return curV.then((r) =>
          (res.push(r), res.length) === limit ? res : recur()
        );
      }
      res.push(curV);
      if (res.length === limit) return res;
    }
    return res;
  })();
});



