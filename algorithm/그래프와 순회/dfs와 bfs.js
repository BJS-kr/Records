const [[n, m, start], ...trunks] = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
  .toString()
  .trim()
  .split('\n')
  .map((x) => x.split(' ').map(Number));

const map = trunks
  .reduce(
    (map, [x, y]) => {
      map[x].push(y);
      map[y].push(x);
      return map;
    },
    Array.from(Array(n + 1), (_) => [])
  )
  .map((x) => x.sort((a, b) => a - b));

const vertexes = Array(n + 1).fill(false, 1);

function dfs(start) {
  const visited = vertexes.slice();
  const result = [];
  function recur(start) {
    if (visited[start]) return result;
    visited[start] = true;
    result.push(start);
    for (const node of map[start]) {
      if (!visited[node]) recur(node);
    }

    return result;
  }

  return recur(start);
}

function bfs(start) {
  const visited = vertexes.slice();
  visited[start] = true;
  const toVisit = map[start];
  let result = [start];

  while (toVisit.length) {
    const next = toVisit.shift();
    if (visited[next]) continue;

    visited[next] = true;
    result.push(next);
    for (const vertex of map[next]) {
      !visited[vertex] && toVisit.push(vertex);
    }
  }

  return result;
}

console.log(dfs(start).join(' '));
console.log(bfs(start).join(' '));
