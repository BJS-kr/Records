// https://www.acmicpc.net/problem/10870
const th = +require('fs').readFileSync('/dev/stdin').toString();

let count = 1;
const getFibonacci = (cur, next) => {
  if (th === 0) return 0;
  if (th === 1) return 1;
  count++
  return count === th ? cur + next : getFibonacci(next, next + cur) 
}

console.log(getFibonacci(0, 1));