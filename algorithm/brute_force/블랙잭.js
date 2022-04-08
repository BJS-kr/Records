const [[n, m], cards] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n')
  .map((x) => x.split(' ').map((x) => +x));

let max = 0;

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (j === i) continue;
    for (let k = 0; k < n; k++) {
      if (k === i || k === j) continue;
      const cur = cards[i] + cards[j] + cards[k];
      cur <= m && cur > max && (max = cur);
    }
  }
}

console.log(max);
