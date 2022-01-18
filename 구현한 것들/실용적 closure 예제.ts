// noImplicitAny, strictNullCheck은 기본적으로 true라고 생각하자
// 클로저를 사용할 땐 메모리 해제 조건을 필수로 생각할 것. 안일한 클로저는 메모리 누수로 이어진다.
// strictNullCheck이므로 null은 명시적으로 타입에 포함되어야 함. 제네릭으로 작성하는게 훨씬 재사용성이 높으니 NullUnion<T> 작성 

const closureFunc = () => {
  let count = 0;
  return { get count() { return count; }, set count(num:number) { count += num; } };
};

const counterFunc = () => {
  let count = 0;
  return { get counter() { return count; }, set counter(num:number) { count += num; } };
};

type NullUnion<T> = T extends (...args:any[]) => infer R ? R|null : never;

let encapsulated:NullUnion<typeof closureFunc> = closureFunc();
let counter:NullUnion<typeof counterFunc> = counterFunc();

const result = { count: 0 };

const closureControl = setInterval(() => {
  if (counter && counter.counter > 10) {
    console.log(result.count);
    console.log(counter.counter - 1);
    console.log(encapsulated?.count);
    encapsulated = null;
    counter = null;
    clearInterval(closureControl);
  } else if (encapsulated && counter) {
    encapsulated.count = 3;
    result.count += encapsulated.count;
    counter.counter = 1;
  }
}, 1000 * 3);
