**부족한 제 자신이 조금이라도 이해하기 위해 작성하는 글이니 신랄한 비판과 가르침 언제든지 대환영입니다!!!**

# 거대한 의문
1. 액션이 포함된 함수(비순수함수)로도 함수형 프로그래밍이 가능한가? 함수형 자체가 순수함수가 전제인데? -> 답을 얻은 것 같다. 간단하다. 안된다.
2. 비순수함수의 부수효과를 모나드로 추상화하면 그건 순수함수임? 예를 들어서 IO monad. clojure는 느슨한 순수함수형 언어라고하고 하스켈은 엄격한 순수함수형 언어라고 하는데 난 하스켈의 IO monad부터 이해가 안간다.
3. DB read는 시점에 영향을 받기 때문에 액션이지만 상태를 변경시키는 것이 아니므로 상관없다고 주장하기도 하는 것 같다. 어떤게 맞는 것인가
4. UoW에는 순수함수와 비순수함수가 함께 동작해도 된다. 다만 겉으로 봤을때 작업단위가 순수해보이긴 한다. -> 이해완료. 사실 생각해보니 당연한 얘기
# 정리가 안되었지만 기억해둘만한 내용
1. rich hickey(clojure 창시자)가 말하길, 보이지 않는 부수 효과를 포함한 함수는 순수함수이다(????)
2. 1은 실용적 함수형과 순수한 함수형의 관점의 차이인듯??
3. js에 모나드를 사용하기는 쉽지 않다(네이티브가 아니니까).
다만, 함수형 장점들을 차용할 순 있다. 그래서 모나드를 구현한 js라이브러리들이 있는 것이다. 장점들이란 의존성을 떼내고 테스트하기 편하다는 것. 그리고 불변객체들로 인해 오류의 가능성이 적다는 것.

4. DB와 연동되어있다고 무조건 액션이라기보다는 DB에서 가져온 데이터를 메모리에서 조작하고, 원본 데이터와 비교하여 조작이 완료된 데이터가 변화가 있다면 DB에 반영함으로써 함수형을 실현한다.

5. 인터페이스가 순수해보이면 순수함수다
# Monad
Monad Functor와 동의어. 애초에 모나드가 Functor의 하위개념이다.
모나드. 처음에는 정상과 오류가 하나로 추상화된 형태정도로 생각했다. 그 다음에는 함수 합성을 위해 모든 결과값을 하나로 추상화하는 것으로 생각했다. 그 다음에는 혼란에 빠져들었다. Ramda, FantasyLand, PureScript등의 모나드 정의를 읽어봐도 읽으면 읽을 수록 정의하기가 모호해졌다. 프로그래밍 세계에서의 모나드와 수학에서의 모나드는 그 범위가 상당히 차이가 나는 것 같았다. 요즘들어 알게 된 것은 모나드의 종류가 꽤나 다양하다는 것이고, 그 다양한 형태들이 합쳐져 새로운 형태를 이루기도 한다는 것이다. 그리고 모나드를 이해하기 위해선 하위 혹은 관련 개념들도 알아야하는데 대표적으로 이항연산, functor, monoid, lamda calculus, 카테고리 이론, kleisli composition 등이 있는 것 같았다.

지금도 이해 수준이 바닥이지만 한번 최대한 의미에 집중하여 풀어가보려고 한다.
먼저 자주 발견되는 용어들부터 정리해야할 필요성을 느낀다.

## Curry
(curry, partial application등의 개념은 알고있을 것이라고 생각하고 넘어갑니다)
재사용성 극대화도 물론 너무 좋지만(OOP유저들은 잘 이해하지 못하지만 FP환경을 생각해보면 재사용성은 OOP의 몇 배는 뛰는 것 같다)핵심은 결국 합성이다. 더 algebraic하게 말하면 Chain의 가능성을 매우매우 높여준다. 가독성이 높아짐은 물론이거니와 예외처리도 단계별로 실행할 수 있어 훨씬 직관적으로 변한다.

# 카테고리 이론 for functional programming
Category, Functor, Monad등의 개념들은 원래 카테고리 이론에서 정의된것이다.
## Category
카테고리는 object들과 그들의 관계를 표현하는 대수학적 구조를 일컫는다. 예를 들어, 카테고리 C는 objects의 집합인 ob(C)와 화살표/사상(morphism)들의 집합인 hom(c)로 구성된다. 다른 말로 해서, 모든 화살표 f는 f가 잇는 [a,b]의 pair로 정의할 수 있다. 이것을 f: a → b 로 표현한다.

또 한, 카테고리는 화살표끼리의 합성도 정의한다. 예를 들어, f: a → b와 g:b → c의 합성은 g ∘ f로 표현되고, 이는 최종적으로 g ∘ f: a → c이다.

objects와 arrows는 특정 조건을 만족해야 카테고리로 평가된다. 다음과 같다.
* 모든 화살표에 대하여 h ∘ (g ∘ f) = (h ∘ g) ∘ f가 성립할 때
* 모든 object인 a는 자신을 가리키는(i(a): a → a) identity arrow인 i(a)를 가질 것(이는 자신으로부터 자신에게 도달할 수 있어야 함을 의미한다)
* 모든 identities는 모든 f: a → b 에 대하여 i(b) ∘ f = f = f ∘ i(a)임이 명백할 것. 다르게 말해, identities는 합성에 대하여 중립적(영향을 끼치지 않음)일 것

아래는 4개의 objects의 카테고리이다.
![category](https://nikgrozev.com/images/blog/Functional%20Programming%20and%20Category%20Theory%20Part%201%20-%20Categories%20and%20Functors/category.jpg)

OOP에서 클래스 계층구조는 카테고리 형태이다. 카테고리 object들은 type들이다.  
(카테고리 이론은 타입이론이다. https://cs.stackexchange.com/questions/3028/is-category-theory-useful-for-learning-functional-programming)  
우리는 A와 B가 존재할 때, A가 B의 subtype이라면 화살표로 연결되었을 것으로 생각한다. 이런 화살표들은 합성가능한데 그 이유는 A와 B의 관계 뿐 아니라 B가 C의 subtype일 것이기에 A는 C의 subtype이기 때문이다(계층 구조니까). 게다가 A는 A의 subtype이므로 identity arrow 조건도 충족한다.

#### The Hask Category
Hask objects란 하스켈 언어의 모든 타입을 일컫는다. 이 타입들은 다른 언어의 타입들로도 일반화 될 수 있다. 프로그래밍적으로 생각해보자. 두 가지 다른 타입A,B가 있다. 그리고 변환 함수를 통해 A타입은 B로 변환될 수 있다(즉, 화살표). 그러므로 화살표의 합성은 프로그래밍적으로 함수의 합성이다. identity arrow는 자기 자신을 반환하는 identity function과 correspond하다. 

#### Functor
Functor F는 별개의 카테고리인 A와 B사이의 변환이다. 이걸 F : A → B라고 표현할 수 있다. F는 A에서 B로 object와 arrow 모든 것을 매핑해야한다. 무언가 빠진 변환이라는 것은 없다. 모두 변환되어야 한다. 즉, 다음이 성립한다. 
1. a ∈ ob(A) 일 때,  F(a) ∈ ob(B) -> object가 모두 변환되므로 F: A->B일 때 a도 변환되어서 B에 속하게 되었을 것이므로 성립한다.
2. f ∈ Hom(A) 일 때, F(f) ∈ Hom(B) -> arrow가 모두 변환되므로 F: A->B일 때 f화살표도 변환되어서 B에 매핑되었을 것이기 때문에 성립한다.

Functor F의 변환이 A카테고리 내부에서 일어나게 되면 이를 endofunctor라고 부르며, :A->A라고 할 수 있다.
즉, a ∈ ob(A) 일 때, F(a) ∈ ob(A)가 성립한다.

이 개념을 프로그래밍적으로 해석하면 어떻게 보일까?

먼저 type constructor라는 개념을 이해해보자. 핵심은 type constructor가 type을 parameter로 받는 generic type 이라는 사실이다. T라는 제네릭 파라미터를 본적이 있을텐데, T를 specify해야지 concrete type이 완성됨은 이미 이해하고 있을 것이다. 

사실, Functor라는 개념은 프로그래밍에선 훨씬 좁은 의미를 가진다. FP에서 모든 Functor는 그저 Hask내의 endofunctor에 지나지 않는다. 게다가, 각 Functor F는 type constructor TC[_]와 관련되어있다. Hask내의 각 타입 A는 TC[A]로 변환된다. 예를 들어, TC가 List라면 F:int → List[int]이다. 다른 말로 하면, type constructor는 unique하게 Hask objects의 매핑을 정의한다.

Functor를 정의하기 위해선 arrow 매핑도 정의해야 한다. arrows는 Hask에서 그저 함수일 뿐이다. 때문에 우리는 map: (A → B) → (TC[A] → TC[B])와 같은 시그니처를 가진 map함수가 필요하다(함수를 함수에 매핑하는 형태이다). 모든 arrow/function인 f:A->B는 또한 함수인 F(f):TR[A] → TC[B] projection/mapping을 반환한다.

요약하자면, FP의 Functor는 type constructor인 TC[_]와 상술한 시그니쳐를 가진 map함수에 의해 uniquely defined된다. 아래의 그림은 type constructor가 List인 Functor를 표현한다.

![functor_in_fp](https://nikgrozev.com/images/blog/Functional%20Programming%20and%20Category%20Theory%20Part%201%20-%20Categories%20and%20Functors/haskfunctor1.jpg)

# fantasy-land specification
js에는 아주 유명한 algebraic structure specifications가 있는데, 바로 fantasy-land이다. fp 솔루션을 제공하는 js의 거의 모든 라이브러리가 이 spec을 바탕으로 제작되었다고 해도 과언이 아니다. 모든 것을 살펴봐도 좋지만 바쁜 현대인들 답게 우선순위를 정해서 살펴보는 것이 좋겠다.

Monad 자체도 algebraic structure이지만 이 Monad는 또 다시 다른 타입들에 의존하고 있으므로 그 시작인 Functor의 spec부터 살펴보겠다.
(참고로 모나드에 이르는 길은 Functor -> Apply -> Chain, Applicative -> Monad이다)

# Functor in fantasy-land
Functor가 무엇인지는 살펴보았으니, 그 핵심조건을 js적으로 표현해보겠다.
되짚자면 Functor의 핵심요건은 Identity와 Map이다.
```ts
// map :: (a -> b) -> Array a -> Array b
// 아래는 직관성을 위한 타이핑입니다. 타입 변환이라는 의미에 집중하시면 됩니다
const map = <T1, T2>(f:(a:Array<T1>) => b:Array<T2>) => (U:T1[])=> U.map(f) // Return: b[]
const id = a => a
const identified = map(id)(['hel','lo']) // exactly the same value returned!

const compose = (f, g) => x => f(g(x))
const twice = x => x * 2
const length = x => x.length
const composeMapped = compose(map(twice), map(length))(['hel','lo'])
const mapComposed = map(compose(twice, length))(['hel','lo'])

import('util').then(util => console.log(util.isDeepStrictEqual(composeMapped, mapComposed))) // true!
```
위의 구현은 전적으로 js의 Array 구현에 의존하고 있다. 첫 줄의 U.map은 U가 Array이기 때문에 실행되는 것이다. 그러나 지금은 구현의 범용성에 관해 이야기할 때가 아니다. 중요한 것은 Array가 Functor의 핵심인 Map을 내장하고 있고, Identity와 Composition을 구현하고 있다는 것이다. 

참고로 변수 mapComposed는 1번의 loop(map)으로 두 번의 맵을 사용하는 composeMapped와 동일한 결과를 내고 있다. 인접한 두 loop을 한번으로 끝낼 수 있는 mapComposed와 같은 형태를 loop fusion이라고 부른다.

자, Array가 Functor의 요건을 갖추었음은 살펴보았다. 그런데 js로 다른 Functor들을 만들 순 없을까? 물론 가능하다.
```ts
// 더 이상 x는 Array타입이라는 제한이 없다.
const Functor = (x: any) => ({
  // map의 기본 형태: map :: Functor f => f a ~> (a -> b) -> f b
  // map이 Identity이도록 구성해보자
  // map :: Identity a ~> (a -> b) -> Identity b
  map: (f: Function) => Functor(f(x)),
  get getX() {
    return x;
  },
});

const id = (x: any) => x;
const hello = 'hello!';

console.log(Functor(hello).map(id).getX === Functor(id(hello)).getX); // true
console.log(Functor(hello).map(id).getX === Functor(hello).getX); // true

// Composition이라고 다를까? fantasy-land의 스펙에 맞춰 구현해보자
// u['fantasy-land/map'](x => f(g(x))) is equivalent to u['fantasy-land/map'](g)['fantasy-land/map'](f)
const getLength = (s: string) => s.length;
const multiply = (n: number) => n * 2;

console.log(
  Functor(hello).map((x: string) => multiply(getLength(x))).getX ===
    Functor(hello).map(getLength).map(multiply).getX
); // true
```

### Maybe
개념적인 접근은 충분하다. 실용적인 예를 들어보자. 지금까지 배운 것을 토대로 Maybe를 만들어보면 어떨까?
일단 Maybe는 두 가지로 이루어져 있는데, Nothing과 Just이다. 전혀 혼란을 느낄 필요가 없다. Boolean타입이 True와 False로 이루어져 있는 것과 완전히 동일한 개념이다.

이렇게 상위 개념에 하위 개념들이 묶여 있는 경우, 하위 개념들은 동일한 인터페이스를 구현해야한다. 아래의 구현을 참고해보면 Just와 Nothing 모두 map과 fold를 구현하고 있다는 것을 알 수 있다. 다만, 인터페이스만 같은 것이지 동작은 전혀다르다.

먼저, Just와 Nothing을 구현해 Maybe를 완성해보자!
```ts
const Just = (x: any) => ({
  map: (f: Function) => Just(f(x)),
  // fold는 단지 값을 꺼내오기 위한 것이니 무시해도 상관없다
  fold: (_: unknown, f: Function) => f(x),
});

// Nothing에 대하여 map을 실행한다고 해도 그 어떤 일도 일어나지 않는다.
// fold로 값을 찾으면 단지 default value만 return된다.
const Nothing = (x: any) => ({
  // 굳이 unknown으로 지정한 이유는 딱히 쓸 일이 없다는 걸 강조하기 위해서다
  map: (f: unknown) => Nothing(null),
  // d는 default를 뜻한다.
  fold: (d: any, _: unknown) => d,
});

const Maybe = (x: any) => ([null, undefined].includes(x) ? Nothing : Just)(x);

const getLengthAndPlus3 = (maybe: ReturnType<typeof Maybe>) => {
  return maybe
    .map((x: any) => x.length)
    .map((x: any) => x + 3)
    .fold('DEFAULT_VALUE', (x: any) => x);
};

console.log(getLengthAndPlus3(Maybe(null))); // 'DEFAULT_VALUE'
console.log(getLengthAndPlus3(Maybe([1, 2, 3, 4]))); // 7
```

### Either
Functor의 spec으로 Either도 만들 순 없을까?
물론 가능하다. Left와 Right를 지니고 '잘 못된 값'은 Left로 넘기되, 에러가 발생하건 제대로 연산 수행되건 무조건 끝까지 Either라는 하나의 형태로 파이프 전체를 타고 내려간다는 것만 기억하면 된다.
```js
const Right = (x: any) => ({
  map: (f: Function) => {
    try {
      return Right(f(x));
    } catch (e) {
      return Left(e);
    }
  },
  fold: (_: unknown, R: Function) => R(x),
});

const Left = (x: any) => ({
  // Left는 Right와 다르게 함수를 실행하지 않음
  // 아무것도 하지 않는 다는 면에서 Nothing과 비슷하지만
  // Nothing이 아무런 값도 지니지 않는 다는 것에 비해서
  // Left는 실제 값(x)를 가진 상태이다.
  map: (_: unknown) => Left(x),
  fold: (L: Function, _: unknown) => L(x),
});

const Either = (x: any) => ([null, undefined].includes(x) ? Left(x) : Right(x));

const fns = [
  (e: any) => console.log('Either got Error!', e),
  (v: any) => console.log('result:', v),
] as const;

const Eithered = (x: any) =>
  Either(x)
    .map((x: any) => x.toUpperCase())
    .map((x: any) => x.substring(0, 5))
    .fold(...fns);

Eithered([1, 2, 3, 4]); // 첫 번째 map에서 발생한 에러를 끝까지 가지고 fold에 도달해 출력합니다.
Eithered('hellow!'); // 에러가 발생하지 않았으니 HELLO가 출력됩니다!
```

### Function
더 재밌는 것은, Function도 Functor가 될 수 있다는 사실이다. 사실 자바스크립트 프로토타입을 활용하면 map을 Function객체(js에선 그냥 다 객체다)에 끼워넣은 것은 쉽다.
```js
// arrow function을 쓰면 안된다!
// function keyword를 써야만 this가 Function객체가 된다.
Function.prototype.map = function (f) {
  return (x) => f(this(x));
};

const mapped = ((x) => {
  return x;
})
  .map((x) => x + '! ')
  .map((x) => x + 'I love FP!')('hi');

console.log(mapped); // hi! I love FP!
```
# lambda calculus & javascript
1. 람다 대수는 함수형 프로그래밍 언어를 구축하는 근간이 되었다.
2. 람다 대수는 튜링-완전하다.
3. 함수가 이름을 가질 필요는 없다. 예를 들어, 흔히들 표현하는 Identity에서 I(x) => x와 같은 형태로 표현하곤 하는데 이는 x => x와 정확히 같다.

abstraction, application 등을 wikipedia의 람다 대수 설명을 읽고 적용해보았습니다.

## 왜 Promise는 Functor or Monad or Applicative가 아닌가?

