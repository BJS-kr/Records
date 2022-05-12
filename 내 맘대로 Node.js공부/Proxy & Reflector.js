const symbolKey = Symbol('SYMBOL');

const target = {
  // internal property
  _value: null,
  get getter() {
    return this._value;
  },
  set setter(v) {
    this._value = v;
  },
  stringKey: 'I am String!',
  symbolKey: 'I am Symbol!',
};

// proxy의 trap에 걸리지 않으면 모든 작업은 target에 직접 전달된다.
// 즉 아래와 같은 구현에서 proxy에 가하는 행위는 모두 target에 가하는 행위와 같다.
const proxy_0 = new Proxy(target, {});

const proxy_1 = new Proxy(target, {
  // target은 Proxy의 첫번째 인자 target이다.
  // property는 get을 호출하는데 사용된 property name이다.
  // receiver는 this로, 대게 자기 자신 즉, Proxy객체이다.
  get(target, property, receiver) {
    // target의 getter가 null이라면 0을 대신 반환
    return target[property] === null ? 0 : target[property];
  },
  // set에는 당연히 인자가 하나 더 들어가야합니다. value로 표현했습니다.
  set(target, property, value, receiver) {
    // null이나 undefined를 set하려고하면 false를 대신 set합니다.
    return (target.setter = value ?? false);
  },
});

console.log(target.getter); // null
console.log(proxy_1.getter); // null을 proxy가 가로채 0을 대신 반환합니다.
proxy_1.setter = undefined; // proxy가 undefined를 가로채 false를 대신 target에 set합니다.
console.log(target.getter); // 처음엔 null을 반환했지만 지금은 false를 반환합니다.

// https://stackoverflow.com/questions/35276559/benefits-of-es6-reflect-api
// https://www.stefanjudis.com/today-i-learned/the-global-reflect-object-its-use-cases-and-things-to-watch-out-for/

// repository 구현계획ㄴ
