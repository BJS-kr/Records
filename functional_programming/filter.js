const log = console.log;

const m = new Map();

m.set("a", 1);
m.set("b", 2);

const filter = (f, iterable) => {
  let res = [];
  for (const v of iterable) {
    if (f(v) === true) res.push(v);
  }
  return res;
};

function* gen() {
  for (let i = 0; i < 10; i++) {
    yield i;
  }
}

// return all odds
log(filter((x) => x % 2 === 1, gen()));
// eval multiple criteria
log(filter(([k, v]) => k === "b" && v === 2, m));
// this will return empty array
log(filter(([k, v]) => k === "a" && v === 2, m));
