// https://www.acmicpc.net/problem/2750

const [n, ...ints] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n')
  .map((x) => +x);

ints.sort((x, y) => x - y).forEach((n) => console.log(n));
