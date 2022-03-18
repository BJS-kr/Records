const stdin = require('fs').readFileSync('/dev/stdin').toString().trim().split('\n');
stdin.shift();

for (const data of stdin) {
  const [H, W, N] = data.split(' ')
  const NH = N % H
  const x = String(NH === 0 ? H : NH)
  let y;
  y = (y = Math.ceil(N / H), y < 10) ? '0' + String(y) : String(y)

  console.log(x + y);
}
