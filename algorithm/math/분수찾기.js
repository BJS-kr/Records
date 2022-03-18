// 1: 1
// 2: 2 3
// 3: 4 5 6
// 4: 7 8 9 10
// 5: 11 12 13 14 15
const target = require('fs').readFileSync('/dev/stdin').toString();

let lineLimit = 0
let line = 0

while (target > lineLimit) {
  lineLimit += ++line
}

const adjust = lineLimit - target

if (line % 2 === 0) console.log(`${line - adjust}/${1 + adjust}`)
else console.log(`${1 + adjust}/${line - adjust}`)


