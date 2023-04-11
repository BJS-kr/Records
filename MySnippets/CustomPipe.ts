
type UnaryFunction<A = any, R = any> = (arg: A) => R;
type ResolvedUnaryFunction<A = any, R = any> = ((
  arg: Awaited<A>,
) => R) extends (arg: Awaited<Either<infer ET>>) => R
  ? (arg: ET) => R
  : (arg: Awaited<A>) => R;
type DefaultValue<T> = { defaultValue: T };
type Folded<T> = T extends Either<infer I>
  ? I
  : T extends Promise<Either<infer I>>
  ? I
  : T;
type PromiseEitherChained<T> = Promise<Either<Folded<T>>>;

function identity<T>(arg: T): T {
  return arg;
}

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
    rightFn: (result: T) => RR,
  ): LR | RR {
    return this.isRight() ? rightFn(this.value) : leftFn(this.value);
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
  syncPipe<A, B>(f1: UnaryFunction<A, B>): (arg: A) => Either<B>;
  syncPipe<A, B, C>(
    f1: UnaryFunction<A, B>,
    f2: UnaryFunction<B, C>,
  ): (arg: A) => Either<C>;
  syncPipe<A, B, C, D>(
    f1: UnaryFunction<A, B>,
    f2: UnaryFunction<B, C>,
    f3: UnaryFunction<C, D>,
  ): (arg: A) => Either<D>;
  syncPipe<A, B, C, D, E>(
    f1: UnaryFunction<A, B>,
    f2: UnaryFunction<B, C>,
    f3: UnaryFunction<C, D>,
    f4: UnaryFunction<D, E>,
  ): (arg: A) => Either<E>;
  syncPipe<A, B, C, D, E, F>(
    f1: UnaryFunction<A, B>,
    f2: UnaryFunction<B, C>,
    f3: UnaryFunction<C, D>,
    f4: UnaryFunction<D, E>,
    f5: UnaryFunction<E, F>,
  ): (arg: A) => Either<F>;
  syncPipe<A, B, C, D, E, F, G>(
    f1: UnaryFunction<A, B>,
    f2: UnaryFunction<B, C>,
    f3: UnaryFunction<C, D>,
    f4: UnaryFunction<D, E>,
    f5: UnaryFunction<E, F>,
    f6: UnaryFunction<F, G>,
  ): (arg: A, defaultValue: DefaultValue<G>) => Either<G>;
  syncPipe(...fns: UnaryFunction[]) {
    return (arg: any) =>
      fns.reduce<Either<unknown>>(
        (result, fn) => result.map(fn),
        Either.right(arg),
      );
  }

  asyncPipe<A, B>(
    f1: ResolvedUnaryFunction<A, B>,
  ): (arg: A) => PromiseEitherChained<B>;
  asyncPipe<A, B, C>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
  ): (arg: A) => PromiseEitherChained<C>;
  asyncPipe<A, B, C, D>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
  ): (arg: A) => PromiseEitherChained<D>;
  asyncPipe<A, B, C, D, E>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
  ): (arg: A) => PromiseEitherChained<E>;
  asyncPipe<A, B, C, D, E, F>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
  ): (arg: A) => PromiseEitherChained<F>;
  asyncPipe<A, B, C, D, E, F, G>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
  ): (arg: A) => PromiseEitherChained<G>;
  asyncPipe<A, B, C, D, E, F, G, H>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
  ): (arg: A) => PromiseEitherChained<H>;
  asyncPipe<A, B, C, D, E, F, G, H, I>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
  ): (arg: A) => PromiseEitherChained<I>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
  ): (arg: A) => PromiseEitherChained<J>;
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
    f10: ResolvedUnaryFunction<J, K>,
  ): (arg: A) => PromiseEitherChained<K>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J, K, L>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
    f10: ResolvedUnaryFunction<J, K>,
    f11: ResolvedUnaryFunction<K, L>,
  ): (arg: A) => PromiseEitherChained<L>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
    f10: ResolvedUnaryFunction<J, K>,
    f11: ResolvedUnaryFunction<K, L>,
    f12: ResolvedUnaryFunction<L, M>,
  ): (arg: A) => PromiseEitherChained<M>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
    f10: ResolvedUnaryFunction<J, K>,
    f11: ResolvedUnaryFunction<K, L>,
    f12: ResolvedUnaryFunction<L, M>,
    f13: ResolvedUnaryFunction<M, N>,
  ): (arg: A) => PromiseEitherChained<N>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
    f10: ResolvedUnaryFunction<J, K>,
    f11: ResolvedUnaryFunction<K, L>,
    f12: ResolvedUnaryFunction<L, M>,
    f13: ResolvedUnaryFunction<M, N>,
    f14: ResolvedUnaryFunction<N, O>,
  ): (arg: A) => PromiseEitherChained<O>;
  asyncPipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    f1: ResolvedUnaryFunction<A, B>,
    f2: ResolvedUnaryFunction<B, C>,
    f3: ResolvedUnaryFunction<C, D>,
    f4: ResolvedUnaryFunction<D, E>,
    f5: ResolvedUnaryFunction<E, F>,
    f6: ResolvedUnaryFunction<F, G>,
    f7: ResolvedUnaryFunction<G, H>,
    f8: ResolvedUnaryFunction<H, I>,
    f9: ResolvedUnaryFunction<I, J>,
    f10: ResolvedUnaryFunction<J, K>,
    f11: ResolvedUnaryFunction<K, L>,
    f12: ResolvedUnaryFunction<L, M>,
    f13: ResolvedUnaryFunction<M, N>,
    f14: ResolvedUnaryFunction<N, O>,
    f15: ResolvedUnaryFunction<O, P>,
  ): (arg: A) => PromiseEitherChained<P>;

  asyncPipe(...fns: UnaryFunction[]) {
    return (arg: any) =>
      fns.reduce(
        (result, fn) =>
          result.then((either) => {
            const value = either.getValue({ defaultValue: null });

            return value instanceof Promise
              ? value.then(
                  (resolved) =>
                    resolved instanceof Either
                      ? resolved.map(fn).fold(Either.left, Either.right)
                      : Either.right(resolved).map(fn),
                  Either.left,
                )
              : // left이거나 promise가 아닌 경우
                Promise.resolve(either.map(fn));
          }),
        Promise.resolve(Either.right(arg)),
      );
  }
}

export const { syncPipe, asyncPipe } = new Pipe();

function double(x: number) {
  return x * 2;
}

function halve(x: number) {
  return x / 2;
}

function addOne(x: number) {
  return x + 1;
}

const pipe1 = asyncPipe(double, double);
const pipe2 = asyncPipe(double, halve);
const pipe = asyncPipe(pipe1, pipe2, addOne);

pipe(1).then((either) => console.log(either.getValue({ defaultValue: null })));
