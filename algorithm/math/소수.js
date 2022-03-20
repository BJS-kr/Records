// https://www.acmicpc.net/problem/2581
const [M, N] = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n').map(x=>+x)

function range(M, N) {
  const res = []
  while(M <= N) {
    res.push(M++)
  }

  if (res[0] === 1) res.shift();

  return res;
}

function filter(M, N, range) {
    range = range(M, N)
    let divider = 2;

    while(divider <= Math.sqrt(N)) {
      range = range.filter(x => x % divider !== 0 || x / divider === 1 )
      divider++
    }

    return range;
}

const nums = filter(M, N, range)

console.log(!nums.length ? -1 : `${nums.reduce((a, c) => a + c)}\n${nums[0]}`)





