// https://www.acmicpc.net/problem/1085
const [x, y, w, h] = require('fs').readFileSync('/dev/stdin').toString().split(' ').map(x => +x);
const wDiff = Math.abs(x - w) > x ? x : Math.abs(x - w);
const hDiff = Math.abs(y - h) > y ? y : Math.abs(y - h);
console.log(wDiff > hDiff ? hDiff : wDiff);
