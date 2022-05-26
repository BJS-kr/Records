const str = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : './input.txt')
  .toString()
  .trim();

let length = 1;
const map = new Set();
while (length <= str.length) {
  let start = 0;
  while (start + length <= str.length) {
    const t = str.slice(start, start + length);
    !map.has(t) && map.add(t);
    start++;
  }
  length++;
}

console.log(map.size);
