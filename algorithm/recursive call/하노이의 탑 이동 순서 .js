const N = 6;

const res = [];

function hanoi(count, from, other, to) {
  if (count === 0) return;
  hanoi(count - 1, from, to, other);
  res.push(`${from} ${to}`);
  hanoi(count - 1, other, from, to);
}

hanoi(N, 1, 2, 3);
console.log(res.length);
res.forEach((x) => console.log(x));
