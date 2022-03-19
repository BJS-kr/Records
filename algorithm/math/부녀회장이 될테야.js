// https://www.acmicpc.net/problem/2775
const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
input.shift();

let [k, n] = [null, null];

for (const kn of input) {
  if (!k) {k = +kn; continue}
  n = +kn;
  // k-1 : n 의 사람 수를 어떻게 구할 것인가?
  // 이것을 구하면 k : n - 1과 합하면 k:n의 사람수가 구해진다.
  if (k === 0) {console.log(n); k=null; n=null; continue}
  else if (n ===1 || n===2) {console.log(n === 1 ? 1 : k + 2); k=null; n=null; continue}
  let index = 0;

  const joomins = [];

  while (index++ <= k) {
    joomins.push([1])
  }

  joomins[0] = [...Array(n + 1).keys()].slice(1)

  index = 0;
  while (++index < joomins.length) {
    for (const below of joomins[index - 1]) {
      if (below === 1) continue;
      joomins[index].push(+joomins[index].slice(-1) + Number(below))
    }
  }

  console.log(joomins[k][n-1])
  k = null;
  n = null;
}