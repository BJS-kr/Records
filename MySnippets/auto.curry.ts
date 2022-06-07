// Function 타입을 받아 자동으로 Curried된 타입을 만들어주는 타입을 작성해보았다
// TypeChallenge로 TS연습하길 잘했다는 생각이 들었다.

type TestFunction = (x: number, y: string, z: number) => string;

type MergeFunction<T extends Function, P extends Function> = T extends (
  ...args: infer A
) => infer R
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
    : (...lastArgs: Arguments) => ReturnValue
  : never;

const testFunction: Curry<TestFunction> =
  (x: number) => (y: string) => (z: number) =>
    x + y + z;
