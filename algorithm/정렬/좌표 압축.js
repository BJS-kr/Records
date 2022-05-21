function go() {
  const [n, ...coordinates] = require('fs')
    .readFileSync(process.platform === 'linux' ? '/dev/stdin' : '../input.txt')
    .toString()
    .trim()
    .split('\n');

  this.result = '';
  this.cds = coordinates[0].split(' ').map((x) => +x);
  this.duplicateRemoved = [...new Set(cds)].sort((a, b) => a - b);
  this.greaterDictionary = duplicateRemoved.reduce(
    (acc, curr, i) => ((acc[curr] = i), acc),
    {}
  );

  // 메모리 관리하고 싶어서 넣어봤습니다 ㅎㅎ 테스트해보니 별 차이는 없네요
  delete this.duplicateRemoved;

  for (const cd of this.cds) {
    this.result += `${this.greaterDictionary[cd]} `;
  }

  return this.result;
}

console.log(go());
