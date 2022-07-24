require('fs').readFile('../input.txt', { encoding: 'utf-8' }, (err, data) => {
  const [N, adventurers] = data
    .split('\n')
    .map((x, i) => (i > 0 ? x.split(' ').map(Number) : Number(x)));

  adventurers.sort((x, y) => x - y);

  let party = 1;
  let target = 0;
  let result = 0;

  for (adventurer of adventurers) {
    target === 0 && (target = adventurer);
    if (party === adventurer) {
      result += 1;
      party = 1;
      target = 0;
      continue;
    }
    party += 1;
  }

  console.log(result);
});
