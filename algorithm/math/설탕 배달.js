// https://www.acmicpc.net/problem/2839
const kg = +require('fs').readFileSync('/dev/stdin').toString()

if (kg % 5 === 0) console.log(kg / 5);
else {
  let maxFive = Math.floor(kg / 5)
  let possible = false;
  while (maxFive >= 0) {
    if((kg - maxFive * 5) % 3 === 0) {possible = true; break};
    maxFive--
  }
  console.log(!possible ? -1 : maxFive + (kg - maxFive * 5) / 3)
}
