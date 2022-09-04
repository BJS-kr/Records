const [nm, ...map] = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
  .toString()
  .trim()
  .split('\n');
const [n, m] = nm.split(' ').map(Number);
const maze = map.map((x) => x.split('').map(Number));

const dx = [0, 0, 1, -1];
const dy = [1, -1, 0, 0];

function bfs(n, m, maze) {
  const toVisit = [[0, 0]];
  while (toVisit.length) {
    const [x, y] = toVisit.shift();

    for (let i = 0; i < 4; i++) {
      const [nx, ny] = [x + dx[i], y + dy[i]];

      if (!maze[nx] || maze[nx][ny] !== 1 || (nx === 0 && ny === 0)) continue;

      maze[nx][ny] = maze[x][y] + 1;
      toVisit.push([nx, ny]);
    }
  }

  return maze[n][m];
}

console.log(bfs(n - 1, m - 1, maze));
