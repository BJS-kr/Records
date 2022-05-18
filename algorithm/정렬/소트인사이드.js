const n = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('')
  .map((x) => +x)
  .sort((a, b) => b - a)
  .join('');
console.log(n);
