import { go } from './go.js';
import { items } from './resources.js';
import { filter } from './filter.js';
import { map } from './map.js';
import { reduce } from './reduce.js';

const { log } = console;

export const pipe =
  (f, ...Fs) =>
  (...init) =>
    go(f(...init), ...Fs);

pipe(
  (x, y, z) => x + y + z,
  (x) => x + 1,
  (x) => x + 10,
  (x) => x + 100,
  log
)(0, 1, 2);

pipe(
  (items) => filter((item) => item.price >= 2000, items),
  (filteredItems) => map((item) => item.price, filteredItems),
  (prices) => reduce((acc, price) => acc + price, prices),
  log
)(items);
