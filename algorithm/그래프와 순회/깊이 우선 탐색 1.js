const [_, ...nodes] = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
  .toString()
  .split('\n')
  .map((x) => x.split(' ').map(Number));

const graph = nodes.reduce(
  (acc, [x, y]) => (
    !acc.get(x) ? acc.set(x, [y]) : acc.set(x, [...acc.get(x), y]),
    !acc.get(y) ? acc.set(y, [x]) : acc.set(y, [...acc.get(y), x]),
    acc
  ),
  new Map()
);

graph.forEach((arr) => arr.sort((x, y) => x - y));

const [visit, result] = ((n, m, r) => {
  for (let i = 1; i <= n; i++) {
    m.set(i, false);
    r.set(i, 0);
  }
  return [m, r];
})(_[0], new Map(), new Map());

visit.set(_[2], true);
result.set(_[2], 1);
let num = 2;
function dfs(cur) {
  for (const n of graph.get(cur)) {
    !visit.get(n) && (visit.set(n, true), result.set(n, num++), dfs(n));
  }
}

dfs(_[2], 2);
let resultStr = '';
for (let i = 1; i <= _[0]; i++) {
  resultStr += result.get(i) + '\n';
}

console.log(resultStr);

// 이거 js로 풀면 채점하다가 type error가 나온다.
// 뭐지 싶어서 구글링해보니 다른 사람도 나와 같은 증상을 겪고 있다.
// 내가 무조건 맞았다는 것이 아니라 테스트 케이스들이 잘 나오고 기본적인 구현에서 채점이 진행되다가 타입에러가 나는 상황이 이해가 안된다.
