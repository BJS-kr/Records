const log = console.log;

const m = new Map();

m.set('a', 1);
m.set('b', 2);
m.set('c', 3);
m.set('d', 4);

function* gen() {
  for (let i = 0; i < 10; i++) {
    yield i;
  }
}

export const find = (f, iterable) => {
  for (const v of iterable) {
    if (f(v) === true) return v;
  }
};

log(find(([k, v]) => v === 3, m)); // ['c', 3]
log(find((x) => x > 4, gen())); // 5
