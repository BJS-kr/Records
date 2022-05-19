const [n, ...xys] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n');

const XYs = xys.map((x) => x.split(' ').map((x) => +x));

const sorted = XYs.sort((a, b) => {
  return a[1] === b[1] ? a[0] - b[0] : a[1] - b[1];
});

const result = sorted.reduce((acc, curr) => {
  acc += curr.join(' ') + '\n';
  return acc;
}, '');

console.log(result);
