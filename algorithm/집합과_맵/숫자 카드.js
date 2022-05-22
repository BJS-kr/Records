// https://www.acmicpc.net/problem/10815

function getMid(from, to) {
  return from + Math.ceil((to - from) / 2);
}

function curry(arr, t, start, end) {
  function binarySearch(start, end) {
    const mid = getMid(start, end);
    const searched = arr[mid];

    if (end - start <= 1)
      return (arr[mid] === t && 1) || (arr[mid - 1] === t && 1) || 0;

    return searched === t
      ? 1
      : t > searched
      ? binarySearch(mid, end)
      : binarySearch(start, mid);
  }

  return binarySearch(start, end);
}
// -10, 2, 3, 6, 10
const [n, have, cases, compare] = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
  .toString()
  .trim()
  .split('\n')
  .map((x, i) => (i % 2 !== 0 ? x.split(' ').map(Number) : Number(x)));

have.sort((a, b) => a - b);

console.log(compare.map((x) => curry(have, x, 0, have.length - 1)).join(' '));
