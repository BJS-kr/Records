const [n, ...users] = require('fs')
  .readFileSync('../input.txt')
  .toString()
  .trim()
  .split('\n')
  .map((x) => x.split(' ').map((x, i) => (i === 0 ? +x : x.trim())));

let result = '';
users
  .sort((a, b) => a[0] - b[0])
  .forEach((x) => (result += x.join(' ') + '\n'));
console.log(result);
