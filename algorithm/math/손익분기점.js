// https://www.acmicpc.net/problem/1712
let [fixed, vary, sale] = require('fs').readFileSync('/dev/stdin').toString().split(' ');
[fixed, vary, sale] = [+fixed, +vary, +sale]

console.log(vary >= sale ? -1 : Math.floor(fixed / (sale - vary)) + 1)