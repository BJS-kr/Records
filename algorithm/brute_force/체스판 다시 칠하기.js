const [hw, ...board] = require('fs')
  .readFileSync('/dev/stdin')
  .toString()
  .trim()
  .split('\n');

const [h, w] = hw.split(' ').map((x) => +x);

const WB = [
  'WBWBWBWB',
  'BWBWBWBW',
  'WBWBWBWB',
  'BWBWBWBW',
  'WBWBWBWB',
  'BWBWBWBW',
  'WBWBWBWB',
  'BWBWBWBW',
];

const BW = [
  'BWBWBWBW',
  'WBWBWBWB',
  'BWBWBWBW',
  'WBWBWBWB',
  'BWBWBWBW',
  'WBWBWBWB',
  'BWBWBWBW',
  'WBWBWBWB',
];

const targetBoards = [WB, BW];

const verticalMove = h - 7;
const horizontalMove = w - 7;

let result = Infinity;
let mismatch = 0;

for (let i = 0; i < verticalMove; i++) {
  for (let j = 0; j < horizontalMove; j++) {
    for (const targetBoard of targetBoards) {
      for (let k = i; k < i + 8; k++) {
        for (let l = j; l < j + 8; l++) {
          if (board[k][l] !== targetBoard[k - i][l - j]) {
            mismatch++;
          }
        }
      }
      result > mismatch && (result = mismatch);
      mismatch = 0;
    }
  }
}

console.log(result);
