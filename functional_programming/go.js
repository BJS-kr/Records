import { filter } from './filter.js';
import { map } from './map.js';
import { items } from './resources.js';

const log = console.log;

const reduce = (f, initV = null, iterable) => {
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

  for (const cur of iterable) {
    acc = f(acc, cur, i++);
  }

  return acc;
};

export const go = (...args) => reduce((acc, cur) => cur(acc), args);

go(
  0,
  (x) => x + 1,
  (x) => x + 10,
  (x) => x + 100,
  log
);

go(
  items,
  (items) => filter((item) => item.price >= 2000, items),
  (filteredItems) => map((item) => item.price, filteredItems),
  (prices) => reduce((acc, price) => acc + price, prices),
  log
);
