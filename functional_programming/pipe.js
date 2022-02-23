import { go } from './go.js';

const { log } = console;

const pipe =
  (f, ...Fs) =>
  (...init) =>
    go(f(...init), ...Fs);

log(
  pipe(
    (x, y, z) => x + y + z,
    (x) => x + 1,
    (x) => x + 10,
    (x) => x + 100,
    log
  )(0, 1, 2)
);
