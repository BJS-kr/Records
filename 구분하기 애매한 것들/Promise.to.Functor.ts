abstract class ListBase<T> {
  //implements Showable
  abstract matchWith<T1>(pattern: {
    empty: () => T1;
    cons: (v: T, rest: ListBase<T>) => T1;
  }): T1;
}
class Cons<T> extends ListBase<T> {
  matchWith<T1>(pattern: {
    empty: () => T1;
    cons: (v: T, rest: ListBase<T>) => T1;
  }): T1 {
    return pattern.cons(this.Value, this.Rest);
  }
  Rest: ListBase<T>;
  Value: T;
  constructor(value: T, rest: ListBase<T>) {
    super();
    this.Rest = rest;
    this.Value = value;
  }
}
