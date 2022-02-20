const log = console.log;

const m = new Map();

m.set("a", 1);
m.set("b", 2);

function* gen() {
  for (let i = 0; i < 20; i++) {
    yield i;
  }
}

const reduce = (f, iterable, initV = null) => {
  let acc;
  let i = 0;

  if (!iterable) {
    try {
      Symbol.iterator in initV;

      iterable = initV;
      acc = iterable.next().value;
    } catch {
      throw new Error("reduce function must be used with iterable");
    }
  } else {
    acc = initV;
  }

  for (const v of iterable) {
    acc = f(acc, v, ++i);
  }

  return acc;
};

log(
  reduce(
    (acc, cur, i) => {
      if (acc === null) return cur;
      if (typeof acc === "number") {
        if (i > 10) return acc;
        return acc + cur;
      }

      return null;
    },
    gen(),
    "NOT_NUMBER"
  )
);

log(
  reduce(
    (acc, cur, i) => {
      if (acc === null) return cur[1];
      if (typeof acc === "number") {
        if (i > 10) return acc;
        return acc + cur[1];
      }

      return null;
    },
    m,
    99
  )
);

log(
  reduce(
    (acc, cur, i) => {
      if (acc === null) return cur;
      if (typeof acc === "number") {
        if (i > 10) return acc;
        return acc + cur;
      }

      return null;
    },
    null,
    gen()
  )
);

log(
  reduce(
    (acc, cur, i) => {
      if (acc === null) return cur;
      if (typeof acc === "number") {
        if (i > 10) return acc;
        return acc + cur;
      }

      return null;
    },
    null,
    "NOT_ITERABLE"
  )
);
