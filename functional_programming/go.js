const log = console.log;

const reduce = (f, iterable, initV = null) => {
  let acc;
  let i = 0;

  if (!iterable) {
    try {
      Symbol.iterator in initV;

      iterable = initV;
      acc = iterable.next().value;
    } catch {
      throw new Error('reduce function must be used with iterable');
    }
  } else {
    acc = initV;
  }

  for (const v of iterable) {
    acc = f(acc, v, i++);
  }

  return acc;
};

const go = (...args) =>
  reduce((a, f) => {
    log(a, f);
    f(a);
  }, args);

go(
  0,
  (x) => x + 1,
  (x) => x + 10,
  (x) => x + 100,
  log
);
