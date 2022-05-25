const [_, a, b] = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
  .toString()
  .trim()
  .split('\n')
  .map((x, i) => i > 0 && new Set(x.trim().split(' ')));

let res = 0;
a.forEach((x) => !b.has(x) && res++);
b.forEach((x) => !a.has(x) && res++);

console.log(res);
