// https://www.acmicpc.net/problem/9020
const [caseCount, ...cases] = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n').map(x => +x);

function *range(end, start = 0, step = 1) {
  while(start <= end) {
    yield start;
    start += step;
  }
}

const maxNumber = Math.max(...cases);
const maxRange = range(Math.sqrt(maxNumber), 2);
const primes = (() => {
  let primeRange = Array(maxNumber + 1).fill(1, 2);

  for (const number of maxRange) {
    if (primeRange[number]) {
      const multiples = range(maxNumber, number * 2, number);
      for (const multiple of multiples) {
        primeRange[multiple] = 0;
      }
    }
  }

  return primeRange.map((x, i) => x && i).filter(x => x);
})()

for (const caseNumber of cases) {
  let goldbachPartition;
  for (const prime of primes) {
    const between = caseNumber - prime;
    if (between < 2 || between < prime) break;
    if (primes.includes(between)) {
      goldbachPartition = [prime, between]
    }
  }
  console.log(...goldbachPartition)
}