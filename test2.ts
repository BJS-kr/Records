const Just = (x: any) => ({
  map: (f: Function) => Just(f(x)),
  // fold는 단지 값을 꺼내오기 위한 것이니 무시해도 상관없다
  fold: (_: unknown, f: Function) => f(x),
});

// Nothing에 대하여 map을 실행한다고 해도 그 어떤 일도 일어나지 않는다.
// fold로 값을 찾으면 단지 default value만 return된다.
const Nothing = (x: any) => ({
  // 굳이 unknown으로 지정한 이유는 딱히 쓸 일이 없다는 걸 강조하기 위해서다
  map: (f: unknown) => Nothing(null),
  // d는 default를 뜻한다.
  fold: (d: any, _: unknown) => d,
});

const Maybe = (x: any) => ([null, undefined].includes(x) ? Nothing : Just)(x);

const getLengthAndPlus3 = (maybe: ReturnType<typeof Maybe>) => {
  return maybe
    .map((x: any) => x.length)
    .map((x: any) => x + 3)
    .fold('DEFAULT_VALUE', (x: any) => x);
};

console.log(getLengthAndPlus3(Maybe(null))); // 'DEFAULT_VALUE'
console.log(getLengthAndPlus3(Maybe([1, 2, 3, 4]))); // 7
