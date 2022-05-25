const [nm, ...db] = require('fs')
  .readFileSync(process.platform === 'linux' ? '/dev/stdin' : './input.txt')
  .toString()
  .trim()
  .split('\n');
const [n, m] = nm.split(' ').map(Number);
const d = new Set(db.slice(0, n));
const b = db.slice(n, Infinity);

const r = b.reduce((acc, curr) => {
  d.has(curr) && acc.push(`${curr}\n`);
  return acc;
}, []);

function compare(a, b, i = 0) {
  if (a[i] && a[i] === b[i]) return compare(a, b, i + 1);
  return a[i] < b[i] ? -1 : 1;
}
console.log(r.length);
console.log(r.sort((a, b) => compare(a, b)).join(''));
