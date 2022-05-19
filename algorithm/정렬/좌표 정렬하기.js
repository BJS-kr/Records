const [n, ...xys] = require('fs')
  .readFileSync('../input.txt')
  .toString()
  .trim()
  .split('\n');

const XYs = xys.map((x) => x.split(' ').map((x) => +x));

const sorted = XYs.sort((a, b) => {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  }
  return a[0] - b[0];
});

const result = sorted.reduce((acc, cur) => {
  acc += cur.join(' ') + '\n';
  return acc;
}, '');

console.log(result);
