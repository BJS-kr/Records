// https://www.acmicpc.net/problem/11653
let N = +require('fs').readFileSync('/dev/stdin').toString();

if (N !== 1) {
  const 소인수 = [];

  let num = 2;

  while (num !== N) {
    if (N % num !== 0) {
      num++;
    } else {
      소인수.push(num);
      N = N / num;
      num = 2;
    }
  }

  소인수.push(N)

  console.log(소인수.join('\n'));
}