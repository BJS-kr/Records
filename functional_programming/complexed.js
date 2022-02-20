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

const map = (f, iterable) => {
  let res = [];
  for (const v of iterable) {
    res.push(f(v));
  }
  return res;
};

const resolveAndPush = async (acc, cur, i) => {
  acc.push([(await cur.catch(error)) ?? 'must have rejected', i]);
  return acc;
};
const wherePromise = (x) => x instanceof Promise;
const getFirstValue = (x) => x[0];

// more readable
promisedReduce(resolveAndPush, filter(wherePromise, target), new Array()).then(
  (res) => {
    log(map(getFirstValue, res)); // [ 'res 1', 'must have rejected', 'res 2' ]
  }
);
