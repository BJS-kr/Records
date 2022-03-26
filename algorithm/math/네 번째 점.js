// https://www.acmicpc.net/problem/3009
const [X, Y] = 
require('fs')
  .readFileSync('/dev/stdin')
  .toString().split('\n')
  .map(x => x.split(' '))
  .reduce((acc, [x, y]) => {
    !acc[0][x] ? (acc[0][x] = 1) : acc[0][x]++;
    !acc[1][y] ? (acc[1][y] = 1) : acc[1][y]++;
    return acc;
  }, [{}, {}]);

const [XKeys, YKeys] = [Object.keys(X), Object.keys(Y)];

console.log(X[XKeys[0]] > X[XKeys[1]] ? XKeys[1] : XKeys[0], Y[YKeys[0]] > Y[YKeys[1]] ? YKeys[1] : YKeys[0]);
