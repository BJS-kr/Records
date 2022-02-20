const { log, error } = console;

const target = [
  1,
  2,
  Promise.resolve('res 1'),
  3,
  'a',
  Promise.reject('rej 1'),
  'b',
  'c',
  Promise.resolve('res 2'),
];

const promisedReduce = async (f, iterable, initV = null) => {
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
    acc = await f(acc, v, i++);
  }

  return acc;
};

const filter = (f, iterable) => {
  let res = [];
  for (const v of iterable) {
    if (f(v) === true) res.push(v);
  }
  return res;
};

promisedReduce(
  async (acc, cur, i) => {
    acc.push([(await cur.catch(error)) ?? 'must have rejected', i]);
    return acc;
  },
  filter((x) => x instanceof Promise, target),
  new Array()
).then(log); // [ [ 'res 1', 0 ], [ 'must have rejected', 1 ], [ 'res 2', 2 ] ]
