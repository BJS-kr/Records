// https://www.acmicpc.net/problem/10872
const N = +require('fs').readFileSync('/dev/stdin').toString();

function factorial(n, cur) {
  if (n >= N) return cur;
  const next = n + 1;
  return factorial(next, cur * next);
}

console.log(factorial(1, 1));