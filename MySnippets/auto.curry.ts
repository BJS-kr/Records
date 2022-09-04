// Function 타입을 받아 자동으로 Curried된 타입을 만들어주는 타입을 작성해보았다
// Ramda의 curry 혹은 lodash/fp의 curry와 같은 안정성을 지니되
// 런타임 연산이 아닌 타입연산만으로 디자인 타임에서 구현이 가능한 것을 목표로 했다
type MergeFunction<T extends Function, P extends Function> = T extends (
  ...args: infer A
) => any
  ? (...args: A) => P
  : never;

type Curry<T> = T extends (...args: infer Arguments) => infer ReturnValue
  ? Arguments extends [infer FirstArgument, ...infer RestArguments]
    ? RestArguments extends []
      ? (arg: FirstArgument) => ReturnValue
      : MergeFunction<
          (arg: FirstArgument) => ReturnValue,
          Curry<(...args: RestArguments) => ReturnValue>
        >
    : never
  : never;

// 이 커리 함수는 모던 자바스크립트 튜토리얼을 참고했다.
// https://javascript.info/currying-partials
function curry(this: any, func: (...args: any[]) => any) {
  const curried = (...args: any[]) => {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return (...args2: any[]) => {
        return curried.apply(this, args.concat(args2));
      };
    }
  };

  return curried;
}

// original
const testFunction = (x: string, y: number, z: string) => x + y + z;

// curried
const testFunctionCurried: Curry<typeof testFunction> = curry(testFunction);

// example 1
console.log(testFunctionCurried('hello')(1)('hi'));

// example 2
const first = testFunctionCurried('hello');
const second = first(1);
const last = second('hi');

console.log(last);
