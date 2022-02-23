// 테스트에 필요한 변수 및 함수 등을 export만 하는 곳입니다.

export const items = [
  {
    name: 'a',
    price: 1000,
  },
  { name: 'b', price: 2000 },
  { name: 'c', price: 3000 },
  {
    name: 'd',
    price: 2000,
  },
];

const m = new Map();

m.set('a', 1);
m.set('b', 2);
m.set('c', 3);
m.set('d', 4);

export { m };

export function* gen() {
  for (let i = 0; i < 10; i++) {
    yield i;
  }
}
