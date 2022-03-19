// https://www.acmicpc.net/problem/10757
console.log(
  require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .split(' ')
  .map(x => BigInt(x))
  .reduce((acc, cur) => acc + cur)
  .toString()
  )
