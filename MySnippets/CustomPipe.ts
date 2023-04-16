import { v4 } from "uuid";

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
  private handleRejection = (e, leftFn) => {
    if (e instanceof Promise) {
      return e.then(
        (r) => (r instanceof Either ? r.fold(leftFn, leftFn) : leftFn(r)),
        (e) => Either.left(e).fold(leftFn, leftFn)
      );
    }

    return leftFn(e);
  };

  private handleResolved = (r, leftFn, rightFn) => {
    if (r instanceof Either) {
      return r.fold(leftFn, rightFn);
    }

    return rightFn(r);
  };

  private handle(leftFn, rightFn) {
    if (this.value instanceof Promise) {
      return this.value.then(
        (r) => this.handleResolved(r, leftFn, rightFn),
        (e) => this.handleRejection(e, leftFn)
      );
    }

    return rightFn(this.value);
  }

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
    /**
     * Promise.resolve의 체인은 then으로 모두 해결되나, Promise.reject(Promise.resolve())의 경우 then해도 reject까지만 실행되기 때문에
     * catch된 값이 Promise인지는 다시 한번 검사해야한다.
     */
    if (this.isRight()) {
      return this.handle(leftFn, rightFn);
    }

    return this.handle(leftFn, leftFn);
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

const feedExecutionId =
  (executionId) =>
  <F extends (arg: any) => any>(fn: F) =>
    asyncPipe(fn, (r: ReturnType<F>) => {
      console.log(executionId);
      console.dir(r, { depth: null });
      return r;
    }) as F;
const log = feedExecutionId(v4());
// start from 1

const pipe1 = asyncPipe(double, double); // 2 -> 4
const pipe2 = asyncPipe(double, halve); // 8 -> 4
const pipe3 = asyncPipe(pipe1, rejector, pipe2, addOne); // 8 -> 16 -> 32 -> 16 -> 17 -> Left(17)
const pipeline = asyncPipe(log(pipe1), log(pipe2), log(pipe3));

pipeline(1).then((either) =>
  either.fold(
    (e) => (console.log("error: ", e), e),
    (r) => r
  )
);
