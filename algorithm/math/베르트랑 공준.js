// https://www.acmicpc.net/problem/4948
const numbers = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n').map(x => +x);

function* range(end, start = 0, step = 1) {
  while(start <= end) {
    yield start
    start+=step
  }
}


for (const v of numbers) {
  let index = Array(v * 2 + 1).fill(1);
  [index[0], index[1]] = [0, 0]
  for (const i of range(Math.sqrt(v*2), 2)) {
    if (index[i]) {
      for (const n of range(v*2, i, i)) {
        index[n] = 0;
      }
    }
  }
  const length = index.map((x, i) => x && i > v && i).filter(x => x).length
  if (length) console.log(length)
}