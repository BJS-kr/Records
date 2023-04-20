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

type PromiseEitherFolded<T> = Promise<Either<Folded<T>>>;
type Chain<T> = T extends PromiseEitherFolded<infer I> ? Chain<I> : T;

type OrPromise<T> = T | Promise<T>;

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

  map<U>(fn: (v: T) => U): Either<any> | Promise<Either<any>> {
    try {
      if (this.isRight()) {
        const result = fn(this.value);
        if (result instanceof Promise) {
          return result.then(
            (resolved) =>
              resolved instanceof Either ? resolved : Either.right(resolved),
            Either.left
          );
        }
        return Either.right(result);
      }

      return this;
    } catch (err) {
      return Either.left(err);
    }
  }

  getValue({ defaultValue }: { defaultValue: T }): T {
    return this.isRight() ? this.value : defaultValue;
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
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<B>>;
  asyncPipe<A, B, C>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<C>>;
  asyncPipe<A, B, C, D>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<D>>;
  asyncPipe<A, B, C, D, E>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<E>>;
  asyncPipe<A, B, C, D, E, F>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<F>>;
  asyncPipe<A, B, C, D, E, F, G>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<G>>;
  asyncPipe<A, B, C, D, E, F, G, H>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<H>>;
  asyncPipe<A, B, C, D, E, F, G, H, I>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<I>>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<J>>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J, K>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
    f10: ResolvedUnaryFunction<J, K>
  ): (arg: OrPromise<A>) => PromiseEitherFolded<Chain<K>>;

  asyncPipe(...fns: UnaryFunction[]) {
    return (arg: any) =>
      fns.reduce(
        (result, fn) =>
          result.then((either) => {
            const value = either.getValue({ defaultValue: null });
            return value instanceof Promise
              ? value
                  .then((resolved) =>
                    resolved instanceof Either
                      ? resolved.map(fn)
                      : Either.right(resolved).map(fn)
                  )
                  .catch(Either.left)
              : Promise.resolve(either.map(fn));
          }),
        // 어떤 인자건 아래와 같이 출발 시킨다.
        Promise.resolve(Either.right(arg))
      );
  }
}

export const { asyncPipe } = new Pipe();

const resolver = (a: number) => Promise.resolve(a);
const rejector = (a: number) => Promise.reject(a);
const double = (a: number) => a * 2;
const halve = (a: number) => a / 2;
const add = (a: number) => (b: number) => a + b;

const pipe = asyncPipe(
  asyncPipe(
    resolver,
    asyncPipe(
      double,
      asyncPipe(resolver, double),
      asyncPipe(
        resolver,
        asyncPipe(resolver, asyncPipe(resolver, asyncPipe(halve))),
        asyncPipe(add(1)),
        asyncPipe(double, rejector, asyncPipe(add(3))), // <- rejector is here!
        halve
      )
    )
  )
);

pipe(3).then(
  (e) =>
    e.fold(
      (e) => console.log("error", e),
      (e) => console.log("result", e)
    ) // error 14
);
