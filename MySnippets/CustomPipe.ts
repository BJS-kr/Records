type UnaryFunction<A = any, R = any> = (arg: A) => R;

type ResolvedUnaryFunction<A = any, R = any> = ((
  arg: Awaited<A>
) => R) extends (arg: Awaited<Either<infer ET>>) => R
  ? (arg: ET) => R
  : (arg: Awaited<A>) => R;

type Folded<T> = T extends Either<infer I>
  ? I
  : T extends Promise<Either<infer I>>
  ? I
  : T;
type PromiseEitherChained<T> = Promise<Either<Folded<T>>>;

export type EitherT<T extends Either<any>> = T extends Either<infer I>
  ? I
  : never;
export class Either<T> {
  static left(value) {
    return new Left(value);
  }

  static right(value) {
    return new Right(value);
  }

  constructor(private value: any) {}

  map<U>(fn: (v: T) => U): Either<any> {
    try {
      return this.isRight() ? Either.right(fn(this.value)) : this;
    } catch (err) {
      return Either.left(err);
    }
  }

  getValue({ defaultValue }: { defaultValue: T }): T {
    return this.isRight() ? this.value : defaultValue;
  }

  chain(fn) {
    return this.map(fn).getValue({ defaultValue: this.value });
  }

  fold<LR, RR>(
    leftFn: (error: any) => LR,
    rightFn: (result: T) => RR
  ): LR | RR | Promise<LR | RR> {
    if (this.isRight()) {
      if (this.value instanceof Promise) {
        return this.value.then(
          (r) => (r instanceof Either ? r.fold(leftFn, rightFn) : rightFn(r)),
          leftFn
        );
      }
      return rightFn(this.value);
    }

    if (this.value instanceof Promise) {
      return this.value.then(
        (r) => (r instanceof Either ? r.fold(leftFn, leftFn) : leftFn(r)),
        leftFn
      );
    }
    return leftFn(this.value);
  }

  isRight(): boolean {
    return this instanceof Right;
  }
}

class Left<T> extends Either<T> {
  constructor(value) {
    super(value);
  }
}

class Right<T> extends Either<T> {
  constructor(value) {
    super(value);
  }
}
class Pipe {
  asyncPipe<A, B>(
    f1: ResolvedUnaryFunction<A, B>
  ): (arg: A) => PromiseEitherChained<B>;
  asyncPipe<A, B, C>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>
  ): (arg: A) => PromiseEitherChained<C>;
  asyncPipe<A, B, C, D>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>
  ): (arg: A) => PromiseEitherChained<D>;
  asyncPipe<A, B, C, D, E>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>
  ): (arg: A) => PromiseEitherChained<E>;
  asyncPipe<A, B, C, D, E, F>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>
  ): (arg: A) => PromiseEitherChained<F>;

  asyncPipe(...fns: UnaryFunction[]) {
    return (arg: any) =>
      fns.reduce(
        (result, fn) =>
          result.then((either) => {
            const value = either.getValue({ defaultValue: null });
            return value instanceof Promise
              ? value
                  .then((resolved) =>
                    // pipe의 연산 결과를 받을 경우
                    resolved instanceof Either
                      ? // resolve된 값이 Either라면 안전하게 map할 수 있다.
                        resolved.map(fn)
                      : // Either.right(fn(resolved))는 아래와 다르다. fn의 연산 중의 에러가 발생한다면 left로 변환할 수 없기 때문이다.
                        Either.right(resolved).map(fn)
                  )
                  .catch(Either.left)
              : // left이거나 promise가 아닌 경우
                Promise.resolve(either.map(fn));
          }),
        // 어떤 인자건 아래와 같이 출발 시킨다.
        Promise.resolve(Either.right(arg))
      );
  }
}

export const { asyncPipe } = new Pipe();

function double(x: number) {
  return x * 2;
}

function halve(x: number) {
  return x / 2;
}

function addOne(x: number) {
  return x + 1;
}

function rejector(x: number) {
  return Promise.reject(x);
}

function thrower(x: number) {
  throw x;
}

const log = <F extends (arg: any) => any>(fn: F, prefix: string) =>
  asyncPipe(fn, (x: ReturnType<F>) => {
    console.log(prefix);
    console.dir(x, { depth: null });
    return x;
  }) as F;

const doubleWithLog = log(double, "double");
const halveWithLog = log(halve, "halve");
const addOneWithLog = log(addOne, "addOne");

// start from 1
const pipe1 = asyncPipe(doubleWithLog, doubleWithLog); // 2 -> 4
const pipe2 = asyncPipe(doubleWithLog, halveWithLog); // 8 -> 4
const pipe3 = asyncPipe(pipe1, pipe2, addOneWithLog, rejector); // 8 -> 16 -> 32 -> 16 -> 17 -> Left(17)
const pipe4 = asyncPipe(pipe1, pipe2, pipe3);

const pipeline = asyncPipe(pipe1, pipe2, pipe3, pipe4);

pipeline(1).then((either) =>
  either.fold(
    (e) => console.error("error detected:", e),
    (r) => console.log("result:", r)
  )
);
