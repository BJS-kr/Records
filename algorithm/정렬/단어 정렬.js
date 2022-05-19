const [n, ...words] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n')
  .map((x) => x.trimEnd());

function compare(a, b, i = 0) {
  if (a[i] && a[i] === b[i]) return compare(a, b, i + 1);
  return a[i] < b[i] ? -1 : 1;
}

const sorted = words.sort((a, b) => {
  return a.length === b.length ? compare(a, b) : a.length - b.length;
});

let last = '';
let result = '';
sorted.forEach((x) => {
  last !== x && ((last = x), (result += x + '\n'));
});

console.log(result);
