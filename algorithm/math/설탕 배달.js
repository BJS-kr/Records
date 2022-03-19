// https://www.acmicpc.net/problem/2839
let kg = +require('fs').readFileSync('/dev/stdin').toString()
let res = 0
let proceed = true;
while ((kg % 5) % 3 !== 0) {
  if (kg < 3) {console.log(-1); proceed = false; break;}
  kg -= 3
  res++
}
if (proceed) {
  res += Math.floor(kg/5) + (kg % 5) / 3
  console.log(res)
}
