// https://www.acmicpc.net/problem/1929
let [M, N] = require('fs').readFileSync('/dev/stdin').toString().split(' ').map(x => +x)

function range(M, N) {
  if (M === 1) {
    if (M !== N)
      M = 2;
    else return [];
  }

  let num = [];

  while (M <= N) {
    num.push(M++)
  }

  return num;
}

let rangeNum = range(M, N);
let index = 2
function filter(rangeNum) {
  for (const num of rangeNum) {
    if (num <= index) continue;
    let divider = 2;

    while(divider <= Math.sqrt(N) && divider <= num) {
      if (num % divider === 0 && num !== divider) {

        let count = 1
        index = num
        rangeNum = rangeNum.filter(x => num * count === x ? (count++, false) : true)
        
        return filter(rangeNum)
    }
    divider++
  }
}

return rangeNum;
}

console.log(filter(rangeNum).join('\n'))
