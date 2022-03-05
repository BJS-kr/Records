import { curry } from './curry.js';
import { nop } from './resources.js';

export const take = curry((limit, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();

  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const curV = cur.value;

      if (curV instanceof Promise) {
        const a = curV
          .then((r) => ((res.push(r), res).length === limit ? res : recur()))
          // e가 nop일 경우 아무것도 하지 않기 위한 것으로 의도된 것이므로 다음 iter를 돌면되지만 nop이 아니라면 에러가 발생한 것이므로 다시 한번 reject해준다.
          .catch((e) => (e == nop ? recur() : Promise.reject(e)));
        return a;
      }

      res.push(curV);
      if (res.length === limit) return res;
    }

    return res;
  })();
});

export const conTake = (limit, iter) => {
  let conIter;
  (conIter = [...iter]).forEach((each) =>
    each instanceof Promise ? each.catch((e) => e) : each
  );

  return take(limit, conIter);
};
