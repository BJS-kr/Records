// 더 이상 x는 Array타입이라는 제한이 없다.
const Functor = (x: any) => ({
  // map의 기본 형태: map :: Functor f => f a ~> (a -> b) -> f b
  // map이 Identity이도록 구성해보자
  // map :: Identity a ~> (a -> b) -> Identity b
  map: (f: Function) => Functor(f(x)),
  get getX() {
    return x;
  },
});

const id = (x: any) => x;
const hello = 'hello!';

console.log(Functor(hello).map(id).getX === Functor(id(hello)).getX);
console.log(Functor(hello).map(id).getX === Functor(hello).getX);

// Composition이라고 다를까? fantasy-land의 스펙에 맞춰 구현해보자
// u['fantasy-land/map'](x => f(g(x))) is equivalent to u['fantasy-land/map'](g)['fantasy-land/map'](f)
const getLength = (s: string) => s.length;
const multiply = (n: number) => n * 2;

console.log(
  Functor(hello).map((x: string) => multiply(getLength(x))).getX ===
    Functor(hello).map(getLength).map(multiply).getX
);
