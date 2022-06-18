// const [N, M] = require('fs')
//   .readFileSync('../input.txt')
//   .toString()
//   .trim()
//   .split(' ')
//   .map(Number);

function* rangeFromOne(n) {
  let start = 1;
  while (start < n) {
    yield start++;
  }
}

function make(arrs) {
  for (const v of rangeFromOne(N))
    for (const arr of arrs) !arr.includes(v) && arr.push(v);
}

/**
 * 생각해보면, not includes일때 배열의 끝에 숫자를 순회하면서 추가한다는 점에서 재귀이다.
 * 0. M까지 매번 순회한다.
 * 1.모든 배열의 길이가 M이 될때까지 재귀를 돌린다.
 * 2.
 */

// 문제풀이를 보류한다. DFS를 익힌후 풀겠다
