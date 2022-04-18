const n = require('fs').readFileSync('/dev/stdin').toString();

function getDividedSum(n) {
  let res = Number(n);
  for (const v of n) {
    res += +v;
  }
  return res;
}

let from = 0;

while (from <= n) {
  if (getDividedSum(String(from)) == n) break;
  from++;
}

console.log(from > n ? 0 : from);
