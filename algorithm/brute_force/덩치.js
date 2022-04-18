const [n, ...whs] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n')
  .map((x, i) => i > 0 && x.split(' ').map((x) => +x));

const rank = new Map();

function calc(wh) {
  let res = 1;
  for (const v of whs) {
    if (wh[0] < v[0] && wh[1] < v[1]) {
      res++;
    }
  }

  return res;
}

for (const wh of whs) {
  rank.set(wh, calc(wh));
}

let res = [];
for (const wh of whs) {
  res.push(rank.get(wh));
}

console.log(res.join(' '));
