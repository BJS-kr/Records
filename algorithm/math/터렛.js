// https://www.acmicpc.net/problem/1002
const [caseCount, ...cases] = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n')

for (const eachCase of cases) {
  const [x1, y1, r1, x2, y2, r2] = eachCase.split(' ').map(x => +x);
  const distance = Math.sqrt(Math.abs(x1 - x2)**2 + Math.abs(y1 - y2)**2);
  
  if (x1 === x2 && y1 === y2 && r1 === r2) console.log(-1);
  else if (Math.abs(r1 - r2) < distance && distance < (r1 + r2)) console.log(2);
  else if (r1 + r2 === distance || Math.abs(r1 - r2) === distance) console.log(1);
  else console.log(0)
}