function go() {
  const [n, ...coordinates] = require('fs')
    .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
    .toString()
    .trim()
    .split('\n');

  this.cds = coordinates[0].split(' ').map((x) => +x);
  this.duplicateRemoved = [...new Set(cds)].sort((a, b) => a - b);
  this.greaterDictionary = duplicateRemoved.reduce(
    (acc, curr, i) => ((acc[curr] = i), acc),
    {}
  );

  this.result = '';

  for (const cd of this.cds) {
    this.result += `${this.greaterDictionary[cd]} `;
  }

  return this.result;
}

console.log(go());
