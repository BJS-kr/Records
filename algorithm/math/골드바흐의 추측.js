const numbers = range(10000, 4, 2)
// require('fs').readFileSync('./input.txt').toString().split('\n').map(x => +x);
function *range(end, start = 0, step = 1) {
  while(start <= end) {
    yield start;
    start += step;
  }
}

function getGoldbachPartition(n) {
  let index = Array(n + 1).fill(1, 2);

  for (const num of range(Math.sqrt(n), 2)) {
    if (index[num]) {
      for (const num2 of range(n, num * 2, num)) {
        index[num2] = 0;
      }
    }
  }

  index = index.map((x, i)=> x && i).filter(x => x);
  
  const indexLength = index.length;
  
  let fromMiddle = indexLength > 2 ? Math.floor(index.length / 2) : 0;
  
  while(!index.includes(n - index[fromMiddle]) && fromMiddle <= indexLength) {
    fromMiddle++
  }

  const [maybeBigger, maybeSmaller] = [n - index[fromMiddle], index[fromMiddle] ];
  console.log(maybeBigger > maybeSmaller ? `${maybeSmaller} ${maybeBigger}` : `${maybeBigger} ${maybeSmaller}`);
}

[...numbers].forEach((n, i) => i > 0 && getGoldbachPartition(n));
