class Either<T> {
  static left(value) {
    return new Left(value);
  }

  static right(value) {
    return new Right(value);
  }

  constructor(private value:any) {}

  map<U>(fn:(v:T) => U) {
    try {
      return this.isRight() ? Either.right(fn(this.value)) : this;
    } catch (err) {
      return Either.left(err);
    }
  }

  getOrElse({defaultValue}:{defaultValue:any}) {
    return this.isRight() ? this.value : defaultValue;
  }

  chain(fn) {
    return this.map(fn).getOrElse({defaultValue: null});
  }

  fold(leftFn, rightFn) {
    return this.isRight() ? rightFn(this.value) : leftFn(this.value);
  }

  isRight() {
    return this instanceof Right;
  }

  isLeft() {
    return this instanceof Left;
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

// type argument에서 L 타입은 개발팀마다 다를 것이므로 그냥 생