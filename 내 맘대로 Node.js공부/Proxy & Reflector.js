/**
 * 기억해야할 포인트부터 설명하고 넘어가겠습니다.
 *
 * 1. Proxy는 internal method를 trap으로 intercept한다.
 *   즉, 원래 개발자가 직접 호출할 수 없는 내부메서드에 대한 관여를 가능하게 해준다.
 *
 * 2. 철자까지 모두 대응되는 것은 아니지만 어쨌든 모든 내부메서드에 대응하는 트랩들이 있다.
 *    https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots 에서 확인 가능하다.
 *
 *
 * 3. Reflect가 Proxy와 함께 쓰이는 경우가 많은 것은 Reflect가 Proxy의 구현을 단순화 시키는 built-in 객체이기 때문이다.
 *    Reflect는 Proxy의 모든 트랩에 상응하는, spell도 일치하는 메서드들을 보유하고 있다.
 *    Reflect의 이러한 메서드들은 내부 메서드에 상응하는 minimal wrapper들이다.
 *    이러한 특성에 따라 Proxy의 트랩 내에서 상응하는 내부메서드를 실행하기 위한 용도로 많이 쓰인다. 예를 들어 get 트랩의 구현 내에 Reflect.get이 있는 형식이다.
 *    또한 Reflect의 operation들은 '겉보기엔' 다시 js의 idiomatic operation들로 대체가 가능하다(idiomatic operation이 내부메서드를 호출하니까)
 *
 *    그러나, 이를 Reflect의 메서드들이 idiomatic operation과 차이가 없다고 인식하면 안된다.
 *    이에 대한 것은 하단의 코드에서 살펴보도록 하겠다.
 *
 * 4. 추가로, operation을 Reflect의 method로 가지는 것은 functional 스타일의 프로그래밍을 할때도 유용하다.
 *
 */

// Proxy와 Reflect의 활용 예제는 https://ko.javascript.info/proxy에서 찾아볼 수 있다.

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

const proxy = new Proxy(target, {
  // target은 Proxy의 첫번째 인자 target이다.
  // property는 get을 호출하는데 사용된 property name이다.
  // receiver는 this로, 대게 자기 자신 즉, Proxy객체이다.
  get(target, property, receiver) {
    // target의 getter가 null이라면 0을 대신 반환
    // Reflect의 params는 Proxy의 그것과 identical하므로 아래와 작성하는 것이 오히려 실수의 위험이 적다.
    const got = Reflect.get(...arguments);
    return got === null ? 0 : got;
  },
  // set에는 당연히 인자가 하나 더 들어가야합니다. value로 표현했습니다.
  set(target, property, value, receiver) {
    // null이나 undefined를 set하려고하면 false를 대신 set합니다.
    return Reflect.set(target, 'setter', value ?? false);
  },
});

console.log(target.getter); // null
console.log(proxy.getter); // null을 proxy가 가로채 0을 대신 반환합니다.
proxy.setter = undefined; // proxy가 undefined를 가로채 false를 대신 target에 set합니다.
console.log(target.getter); // 처음엔 null을 반환했지만 지금은 false를 반환합니다.

// 이제 idiomatic한 js와 Reflect의 연산들이 무슨 차이가 있는지 알아봅시다.
// 일단 receiver의 의미를 좀더 자세히 알아보겠습니다.
// receiver는 this입니다. 더 이상의 의미는 없습니다만, 이 this가 누가 될지가 중요합니다.
// 예를 들어, idiomatic하게 get을 호출한다면 this는 당연히 target이 될 것입니다.
// 그러나, receiver를 활용해 reflect로 get을 호출한다면 receiver 덕분에 this는 바뀝니다.
// 하지만 이러한 예로는 'receiver'의 의미를 정확히 알 수 없습니다.
// receiver는 대개 Proxy자신이 되지만, 상속받은 객체를 사용할땐 상속받은 객체가 되기도 합니다.

// receiver가 Proxy가 되는 상황, 상속받은 객체가 되는 상황 두 가지의 예를 모두 알아보겠습니다.

// https://stackoverflow.com/questions/35276559/benefits-of-es6-reflect-api
// https://www.stefanjudis.com/today-i-learned/the-global-reflect-object-its-use-cases-and-things-to-watch-out-for/

const foobar = {
  get foo() {
    return this.bar;
  },
  bar: 3,
};

const handler = {
  get(target, propertyKey, receiver) {
    if (propertyKey === 'bar') return 2;
    console.log(Reflect.get(target, propertyKey, receiver)); // 2
    console.log(target[propertyKey]); // 3
  },
};

const proxy_ = new Proxy(foobar, handler);
proxy_.foo; // 2와 3이 연속으로 출력된다

// 위와 같은 동작이 일어나는 이유를 생각해봅시다
// foo getter는 .method형태로 idiomatic하게 내부 메서드 [[Get]]을 호출하여 bar를 반환받고 있습니다.
// Reflect는 receiver를 전달받았습니다. 이 때 receiver는 proxy 자신입니다.
// 그 이유는 proxy에 대하여 foo를 호출했기 때문입니다. Getter를 receive하는 존재가 자기 자신이라는 것입니다.
// 여기서 idiomatic과 차이가 생깁니다.
// 위의 예제에서 Reflect.get부분의 arguments를 생각해보면, 다음과 같습니다.
console.log(Reflect.get(foobar, 'foo', proxy_));
// 뭔가 이상하지 않나요? foo를 호출하는데 this가 proxy_라면 foobar는 왜 적는건가요?
// receiver.foo라면 무한히 트랩이 실행되는 것 아닌가요? (실제로 receiver.foo를 호출하면 콜스택 리미트 에러가 발생합니다)
// receiver의 의미는 이와는 조금 다릅니다.
// 위의 get트랩에서 target을 출력해보면: { foo: [Getter], bar: 3 } 와 같이 나옵니다.
// 그리고 MDN의 Reflect.get을 읽어보면 receiver는 getter를 encountered 했을 때 동작하게 된다는군요
// 즉, Reflect.get(foobar, 'foo', proxy_) != proxy_.foo이고 대신
// foobar.foo -> Getter(encountered!) -> this.bar는 proxy_.bar가 되는 것입니다.
// 위와 같은 이유로 단순히 receiver를 this라고만 설명하면 혼동이 오기 쉽습니다.
// 단순히 this라면 js 명세에도 thisArg와 같은 형태로 적혀있었을 것입니다. target과 receiver를 따로 적을 필요도 없었겠지요.
// 3이 출력되는 이유는 target[propertyKey] 때문이고 Getter가 동작하는 this또한 바뀌지 않았으므로 foobar에서 미리 설정한 bar의 값 3이 그대로 출력됩니다.

// 다음은 receiver가 상속받은 객체가 되는 경우입니다.
// 모던 자바스크립트에서 발췌한 예입니다. 살짝 변형을 가했습니다.

let user = {
  _name: 'Guest',
  get name() {
    return this._name;
  },
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    console.log(Reflect.get(...arguments));
    console.log(target[prop]);
  },
});

let admin = {
  __proto__: userProxy,
  _name: 'Admin',
};
admin.name;
// Admin과 Guest가 연속으로 실행됩니다. 작동순서는 이러합니다.
// admin에 name이라는 property는 없습니다. 즉, prototype chain을 타고 검색을 시작합니다.
// __proto__가 userProxy로 할당되어있으니, userProxy.name이 되겠네요.
// get에 대한 trap이 설정되어있으니 연산이 시작됩니다. 여기서 문제가 생깁니다.
// userProxy의 target은 user입니다. idiomatic하게 name을 찾게되면 user[name]과 같으므로 Guest가 출력되어야 할 것입니다.
// 그러나 receiver를 활용한다면? 위에서 설명했듯 즉시 this가 바뀌는 것은 아닙니다. user[name]을 찾되 Getter를 encounter하면 receiver가 this로 동작하게 되는 것이지요.
// Reflect.get을 MDN을 읽어보면 receiver는 Proxy에서 쓰일경우 target으로 부터 상속받은 객체가 될 수 있다고 하네요
// 즉, user.name이 반환하는 값은 admin._name이 됩니다.

/**
 * Proxy는 몇 가지 극복할 수 있는 한계점 혹은 극복할 수 없는 한계점들이 존재합니다.
 *
 * 1. Proxy는 target의 internal slot에 접근할 수 없습니다.
 *    예를 들어, target이 Map객체인 Proxy는 proxy.set('mapKey', 'v')와 같은 동작을 수행할 수 없습니다.
 *    Map객체에만 존재하는 [[MapData]] internal slot이 Proxy에 존재하지 않기 때문에, set이 MapData에 접근할 수 없기 때문입니다.
 *    이는 극복 할 수 있는 한계점입니다. get트랩안에(map의 메서드명이 set일지라도 단지 'set'이라는 key name에 불과합니다. [[Get]]로 'set'을 호출하면 그 메서드의 동작은 [[Set]]이 되는 것이지요)
 *    set동작에 target을 bind해주면 됩니다. 먼저 Reflect.get으로 'set'이라는 prop을 찾은 후, 찾아낸 값에 target을 bind해서 return하면 됩니다.
 *    외부에선 bind후 return 함수를 다시 call하므로 proxy.set('mapKey', 'v')이 정상적으로 동작하게 됩니다.
 *
 *    마찬가지의 이유로 Proxy는 #접두어가 붙은 private hash field에 접근할 수 없습니다. internal slot을 사용하기 때문입니다.
 *    해결법 또한 마찬가지로 bind해서 접근해야합니다.
 *
 * 2. Proxy는 property가 없는 exotic object라고 했던 것을 기억하시나요?
 *    하지만 그렇다고 해서 target과 Proxy로 감싸여진 target이 같은 것은 아닙니다.
 *    외부에서 바라볼때(출력시 완전 동일) 같다고 하더라도, JS는 이 둘을 다른 객체로 취급합니다.
 *
 * 3. strict equal연산을 trap으로 intercept 할 수 없습니다. 이는 극복이 불가능한 한계점입니다.
 *
 */

// 마지막으로 revocable proxy에 대해 알아보겠습니다.
// revocable proxy는 Proxy.revocable(target, trap)의 형태로 작성되며, proxy와 revoke라는 함수를 반환합니다.
// revocable이 시사하는 바는 간단합니다. revoke를 호출하는 순간, 모든 internal reference를 제거합니다.
// 즉, 즉시 proxy의 모든 동작을 disable 시킵니다.
// reference를 제거한다는 점 때문에 weakMap과 함께 쓰이면 강력한 편의를 제공합니다.

let revokes = new WeakMap();

let object = {
  data: 'Valuable data',
};

let { proxy, revoke } = Proxy.revocable(object, {});

revokes.set(proxy, revoke);

revoke = revokes.get(proxy);
revoke();
// weakMap에 proxy => revoke 형태로 저장하고 revoke를 따로 관리할 필요없이 모든 프록시와 revoke를 하나의 객체에서 간단히 관리할 수 있습니다.
// 또한 가비지컬렉션 시키고 싶다면 revokes.get(proxy)()하면 추가적인 로직이 필요없네요! 이는 proxy를 관리하는 일반적인 방식이므로 기억해둘 필요가 있습니다.
