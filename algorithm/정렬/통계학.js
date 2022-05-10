const [N, ...ints] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n')
  .map((x) => Number(x));

const intsLength = ints.length;

function avg(ints) {
  let sum = 0;
  for (const n of ints) {
    sum += n;
  }
  const result = Math.round(sum / intsLength);
  return result === -0 ? 0 : result;
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

  const mostCommonCount = Math.max(...Object.keys(howCommonInverted));
  const mostCommonIntsSorted = howCommonInverted[mostCommonCount].sort(
    (x, y) => x - y
  );

  return mostCommonIntsSorted.length > 1
    ? mostCommonIntsSorted[1]
    : mostCommonIntsSorted[0];
}

console.log(avg(ints));
console.log(mid(ints));
console.log(common(ints));
console.log(Math.max(...ints) - Math.min(...ints));
