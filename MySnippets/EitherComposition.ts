class Either<T> {
  static left(value) {
    return new Left(value);
  }

  static right(value) {
    return new Right(value);
  }

  constructor(private value) {}

  map<U>(fn:(v:T) => U) {
    try {
      return this.isRight() ? Either.right(fn(this.value)) : this;
    } catch (error) {
      return Either.left(error);
    }
  }

  getOrElse(defaultValue) {
    return this.isRight() ? this.value : defaultValue;
  }

  chain(fn) {
    return this.map(fn).getOrElse(null);
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

// type argument에서 L 타입은 개발팀마다 다를 것이므로 그냥 생략함
const right = <T>(value: T): Either<T> => Either.right(value);

const getUserName = (user: { name: string }): string => user.name;
const toUpperCase = (name: string): string => name.toUpperCase();
const getGreeting = (name: string): string => `Hello, ${name}!`;

const pipe = <T, U>(...fns: Array<(x: T) => U>): (x: T) => Either<U> => x =>
  fns.reduce((v, f) => right(f(v.getOrElse(null))), right(x));

const getGreetingForUser = pipe(getUserName, toUpperCase, getGreeting);

const user = { name: 'John Doe' };
const greeting = getGreetingForUser(user).getOrElse('Error');

console.log(greeting);