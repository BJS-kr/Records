const [N, ...ints] = require('fs')
  .readFileSync('../input.txt')
  .toString()
  .trim()
  .split('\n')
  .map((x) => Number(x));

const intsLength = ints.length;

function sum(ints) {
  let result = 0;
  for (const n of ints) {
    result += n;
  }

  return (result / intsLength).toFixed(1);
}

function mid(ints) {
  const sorted = ints.sort((x, y) => x - y);
  return sorted[(sorted.length - 1) / 2];
}

function common(ints) {
  const howCommon = ints.reduce((acc, cur) => {
    return acc[cur] ? ((acc[cur] += 1), acc) : ((acc[cur] = 1), acc);
  }, {});

  const howCommonInverted = Object.keys(howCommon).reduce((acc, cur) => {
    return acc[howCommon[cur]]
      ? (acc[howCommon[cur]].push(cur), acc)
      : ((acc[howCommon[cur]] = [cur]), acc);
  }, {});

  mostCommonCount = Math.max(...Object.keys(howCommonInverted));
}

console.log(sum(ints));
console.log(mid(ints));
console.log(common(ints));
console.log(Math.max(...ints) - Math.min(...ints));
