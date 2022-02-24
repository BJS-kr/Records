import { log } from 'console';
import { reduce } from './reduce.js';

export const range = (range, step = 1, start = 0) => {
  if (step === 0) step = 1;
  if (range === start) return [];
  if (range < 0 && step > 0) {
    step = -1;
  }
  let i = start;
  let result = [];
  if (step < 0 && range < start) {
    while (i > range) {
      result.push(i);
      i += step;
    }
    return result;
  }
  while (i < range) {
    result.push(i);
    i += step;
  }
  return result;
};

log(range(10)); // [0, 1, ..., 9]
log(range(10, 2)); // [0, 2, ..., 8]
log(range(20, 2, 10)); // [10, 12, ..., 18]
log(range(-5, -1, 5)); // [5, 4, ..., -4]
log(range(10, 0, 10)); // []
log(range(-10, 2, -1)); // step ignored and set to -1. so result is [-1, -2, ..., -9]

log(reduce((acc, cur) => acc + cur, range(10, 2, 4))); // 18

// lazy range
// none of were evaluated till generator was called
export const lazyRange = function* (range, step = 1, start = 0) {
  if (step === 0) step = 1;
  if (range === start) return [];
  if (range < 0 && step > 0) {
    step = -1;
  }
  let i = start;
  if (step < 0 && range < start) {
    while (i > range) {
      yield i;
      i += step;
    }
  }
  while (i < range) {
    yield i;
    i += step;
  }
};

log(lazyRange(10)); // Object [Generator] {}
log(reduce((acc, cur) => acc + cur, lazyRange(10, 2, 4))); // 18
