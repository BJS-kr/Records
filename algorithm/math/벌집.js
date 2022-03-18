// https://www.acmicpc.net/problem/2292
// 1: 2~7
// 2: 8~19
// 3: 20~37
// 4: 38~61
const n = require('fs').readFileSync('/dev/stdin').toString();
const step = 6

let add = 6
let count = 1

while (n > 1 + add) {
  add += ++count * step
}

console.log(n == 1 ? 1 : count + 1)