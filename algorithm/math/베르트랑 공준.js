// https://www.acmicpc.net/problem/4948
const numbers = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n').map(x => +x);

function* range(end, start = 0, step = 1) {
  while(start <= end) {
    yield start
    start+=step
  }
}

for (const number of numbers) {
  let index = Array(number * 2 + 1).fill(1, 2);

  for (const i of range(Math.sqrt(number * 2), 2)) {
    if (index[i]) {
      for (const n of range(number * 2, i, i)) {
        index[n] = 0;
      }
    }
  }

  const length = index.map((x, i) => x && i).filter(x => x).length
  if (length) console.log(length)
}