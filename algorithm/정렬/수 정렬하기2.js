const [n, ...ints] = require('fs')
  .readFileSync('../input.txt')
  .toString()
  .trim()
  .split('\n')
  .map((x) => +x);

// merge sort 시간초과
function merge(left, right) {
  const sorted = [];
  let [leftIndex, rightIndex] = [0, 0];
  while (leftIndex < left.length || rightIndex < right.length) {
    if (
      left[leftIndex] < right[rightIndex] ||
      right[rightIndex] === undefined
    ) {
      sorted.push(left[leftIndex++]);
    } else {
      sorted.push(right[rightIndex++]);
    }
  }
  return sorted;
}

function mergeSplit(arr) {
  if (arr.length === 1) return arr;
  const half = Math.ceil(arr.length / 2);
  const left = mergeSplit(arr.splice(0, half));
  const right = mergeSplit(arr.splice(-half));

  return merge(left, right);
}

mergeSplit(ints).forEach((n) => console.log(n));
