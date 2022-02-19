const log = console.log;

const m = new Map();

const map = (f, iterable) => {
  let res = [];
  for (const v of iterable) {
    res.push(f(v));
  }
  return res;
};

function* gen() {
  for (let i = 0; i < 3; i++) {
    yield i;
  }
}

m.set("a", 1);
m.set("b", 2);

log(map((x) => x * x, gen()));
log(map(([k, v]) => [k, v * 2], m));
