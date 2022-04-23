const n = +require('fs').readFileSync('/dev/stdin').toString();

const _666s = [];

function find666(toBe666 = 665) {
  while (String(toBe666).indexOf('666') === -1) {
    toBe666++;
  }
  _666s.push(toBe666) < n && find666(++toBe666);
}

find666();

console.log(_666s.pop());
