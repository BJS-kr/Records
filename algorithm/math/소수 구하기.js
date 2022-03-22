// https://www.acmicpc.net/problem/1929
let [M, N] = require('fs').readFileSync('/dev/stdin').toString().split(' ').map(x => +x);
let index = Array(N + 1).fill(1);

function* range(end, start=0, step=1) {
  while (start <= end) {
    yield start
    start += step;
  }
}

const limit = Math.sqrt(N)

for (const n of range(limit, 2)) {
  if (index[n]) {
    for (const v of range(N, n * 2, n)) {
      index[v] = 0;
    }
  }
}

const res = index.map((x, i) => x && i >= M && i > 1 && i).filter(x => x)
console.log(res.join('\n'))

