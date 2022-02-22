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

const go = (...args) => reduce((acc, cur) => cur(acc), args);

go(
  0,
  (x) => x + 1,
  (x) => x + 10,
  (x) => x + 100,
  log
);
