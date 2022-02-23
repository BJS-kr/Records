import { log } from 'console';
import { filter } from './filter.js';
import { go } from './go.js';
import { map } from './map.js';
import { reduce } from './reduce.js';
import { items } from './resources.js';

export const curry =
  (f) =>
  (arg1, ...restArg) =>
    restArg.length ? f(arg1, ...restArg) : (...restArg) => f(arg1, ...restArg);

log(curry((x, y) => x + y)(1, 2));
log(curry((x, y) => x + y)(1));
log(curry((x, y) => x + y)(1)(2));

const [curryFilter, curryMap, curryReduce] = [
  curry(filter),
  curry(map),
  curry(reduce),
];

go(
  items,
  curryFilter((item) => item.price >= 2000),
  curryMap((item) => item.price),
  curryReduce((acc, price) => acc + price),
  log
);
