const [_, ...nodes] = require('fs')
  .readFileSync('../input.txt')
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

const visit = ((n, m) => {
  for (let i = 1; i <= n; i++) {
    m.set(i, false);
  }
  return m;
})(_[0], new Map());

function dfs() {}
