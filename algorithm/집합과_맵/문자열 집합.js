// https://www.acmicpc.net/problem/14425
const [nm, ...rest] = require('fs')
  .readFileSync(
    process.platform === 'linux' ? '/dev/stdin' : '../input.txt',
    'utf-8'
  )
  .toString()
  .trim()
  .split('\n');

const [n, m] = nm.split(' ').map(Number);

const s = new Set(rest.splice(0, n));

let res = 0;
rest.forEach((x) => s.has(x) && res++);
console.log(res);
