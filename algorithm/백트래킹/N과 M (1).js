const [N, M] = require('fs')
  .readFileSync('../input.txt')
  .toString()
  .trim()
  .split(' ')
  .map(Number);

// dfs로 풀어야하나?
