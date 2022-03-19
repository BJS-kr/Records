// https://www.acmicpc.net/problem/1978
const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n')[1].split(' ').map(x=>+x);

let count = 0

for (const n of input) {
  if (n == 1) continue;

  let num = 2;
  let is = true;

  while(num <= n / 2) {
    if(n % num === 0) {is = false; break;}
    num++
  }

  if (is) count++
}

console.log(count);
