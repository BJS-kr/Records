const map = (f) => (U) => U.map(f); // Return: b[]
const id = (a) => a;
const identified = map(id)(['hel', 'lo']); // exactly the same value returned!

const compose = (f, g) => (x) => f(g(x));
const twice = (x) => x * 2;
const length = (x) => x.length;
const composeMapped = compose(map(twice), map(length))(['hel', 'lo']);
const mapComposed = map(compose(twice, length))(['hel', 'lo']);
console.log(composeMapped);
console.log(mapComposed);
import('util').then((util) =>
  console.log(util.isDeepStrictEqual(composeMapped, mapComposed))
); // true!
