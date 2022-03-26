// https://www.acmicpc.net/problem/4153
const threePointss = require('fs').readFileSync('/dev/stdin').toString().split('\n').map(x => x.split(' ').map(x => +x));

for (const threePoints of threePointss) {
  const sorted = threePoints.sort((x, y) => x - y);
  sorted[0] && (console.log(sorted[2]**2 === sorted[0]**2 + sorted[1]**2 ? 'right' : 'wrong'));
}