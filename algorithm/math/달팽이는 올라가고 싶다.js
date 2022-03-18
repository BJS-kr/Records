// https://www.acmicpc.net/problem/2869
const [a,b,v] = require('fs').readFileSync('/dev/stdin').toString().split(' ')
// 올라가면 떨어지지 않으므로 마지막은 무조건 낮에 오르는 거리만큼 올라감
// 즉 (총길이 - 올라가는 길이) / (올라가는 길이 - 떨어지는 길이) + 마지막 날(1)
console.log(Math.ceil((v-a) /(a-b) + 1))