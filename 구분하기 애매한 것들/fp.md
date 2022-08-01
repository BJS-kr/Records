**부족한 제 자신이 조금이라도 이해하기 위해 작성하는 글이니 신랄한 비판과 가르침 언제든지 대환영입니다!!!**
# Monad
Monad Functor와 동의어. 애초에 모나드가 Functor의 하위개념이다.
모나드. 처음에는 정상과 오류가 하나로 추상화된 형태정도로 생각했다. 그 다음에는 함수 합성을 위해 모든 결과값을 하나로 추상화하는 것으로 생각했다. 그 다음에는 혼란에 빠져들었다. Ramda, FantasyLand, PureScript등의 모나드 정의를 읽어봐도 읽으면 읽을 수록 정의하기가 모호해졌다. 프로그래밍 세계에서의 모나드와 수학에서의 모나드는 그 범위가 상당히 차이가 나는 것 같았다. 요즘들어 알게 된 것은 모나드의 종류가 꽤나 다양하다는 것이고, 그 다양한 형태들이 합쳐져 새로운 형태를 이루기도 한다는 것이다. 그리고 모나드를 이해하기 위해선 하위 혹은 관련 개념들도 알아야하는데 대표적으로 이항연산, functor, monoid, lamda calculus, 카테고리 이론, kleisli composition 등이 있는 것 같았다.

지금도 이해 수준이 바닥이지만 한번 최대한 의미에 집중하여 풀어가보려고 한다.
먼저 자주 발견되는 용어들부터 정리해야할 필요성을 느낀다.

## Curry
(curry, partial application등의 개념은 알고 있을 것이라고 생각하고 넘어갑니다)
재사용성 극대화도 물론 너무 좋지만(OOP유저들은 잘 이해하지 못하지만 FP환경을 생각해보면 재사용성은 OOP의 몇 배는 뛰는 것 같다)핵심은 결국 합성이다. 더 algebraic하게 말하면 composition의 가능성을 높여준다. 가독성이 높아짐은 물론이거니와 예외처리도 단계별로 실행할 수 있어 훨씬 직관적으로 변한다.

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

#### Functor
Functor F는 별개의 카테고리인 A와 B사이의 변환이다. 이걸 F : A → B라고 표현할 수 있다. F는 A에서 B로 object와 arrow 모든 것을 매핑해야한다. 무언가 빠진 변환이라는 것은 없다. 모두 변환되어야 한다. 즉, 다음이 성립한다. 
1. a ∈ ob(A) 일 때,  F(a) ∈ ob(B) -> object가 모두 변환되므로 F: A->B일 때 a도 변환되어서 B에 속하게 되었을 것이므로 성립한다.
2. f ∈ Hom(A) 일 때, F(f) ∈ Hom(B) -> arrow가 모두 변환되므로 F: A->B일 때 f화살표도 변환되어서 B에 매핑되었을 것이기 때문에 성립한다.

Functor F의 변환이 A카테고리 내부에서 일어나게 되면 이를 endofunctor라고 부르며, :A->A라고 할 수 있다.
즉, a ∈ ob(A) 일 때, F(a) ∈ ob(A)가 성립한다.

이 개념을 프로그래밍적으로 해석하면 어떻게 보일까?

먼저 type constructor라는 개념을 이해해보자. 핵심은 type constructor가 type을 parameter로 받는 generic type 이라는 사실이다. T라는 제네릭 파라미터를 본적이 있을텐데, T를 specify해야지 concrete type이 완성됨은 이미 이해하고 있을 것이다. 

사실, Functor라는 개념은 프로그래밍에선 훨씬 좁은 의미를 가진다. FP에서 모든 Functor는 그저 endofunctor에 지나지 않는다. 게다가, 각 Functor F는 type constructor TC[_]와 관련되어있다. 각 타입 A는 TC[A]로 변환된다. 예를 들어, TC가 List라면 F:int → List[int]이다. 다른 말로 하면, type constructor는 unique하게 objects의 매핑을 정의한다.

Functor를 정의하기 위해선 arrow 매핑도 정의해야 한다. arrows는 함수일 뿐이다. 때문에 우리는 map: (A → B) → (TC[A] → TC[B])와 같은 시그니처를 가진 map함수가 필요하다(함수를 함수에 매핑하는 형태이다). 모든 arrow/function인 f:A->B는 또한 함수인 F(f):TR[A] → TC[B] projection/mapping을 반환한다.

요약하자면, FP의 Functor는 type constructor인 TC[_]와 상술한 시그니쳐를 가진 map함수에 의해 uniquely defined된다. 아래의 그림은 type constructor가 List인 Functor를 표현한다.

![functor_in_fp](https://nikgrozev.com/images/blog/Functional%20Programming%20and%20Category%20Theory%20Part%201%20-%20Categories%20and%20Functors/haskfunctor1.jpg)


# Composition
함수형 프로그래밍을 이해하기 위한 기초단계에 진입해보자. Composition은 사실상 함수형 프로그래밍의 전체에 관여하므로 잘 이해하고 다음 단계로 넘어가야한다.
```js
const compose = (f, g) => x => f(g(x));
```
간단하다. x가 f와 g함수의 파이프를 타고 있다. Composition은 축산업과 굉장히 유사하다. 원하는 결과물(새끼)를 얻기 위해 두 마리를 신중하게 선택하고 교배시킨다.
중요한 것은, 소(함수)와 소를 교배시키면 당연히 소가 태어난다는 것이다.

함수와 함수를 합성하면 새로운 함수가 된다.
Composition은 Associativity를 만족한다. 아래와 같은 형태이다.
```js
compose(f, compose(g, h)) === compose(compose(f, g), h)
```
위와 같은 Associativity 덕분에 우리는 compose를 아래와 같은 형태로 고쳐쓸 수 있다.
```js
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
```
처음 작성했던 compose는 오직 함수 두 개씩만 합성이 가능했지만 compose를 통해 반환된 함수도 또한 compose할 수 있다는 사실이 증명되었기 때문에, reduceRight해도 결과는 완전히 같음 또한 알 수 있다.

우리는 이런 식으로 함수를 조합(파이프 제작)해나갈 수 있으며, 이는 함수형이 가진 강력한 힘이다. 

여기서 주목할 만한점은 또 하나 있다. 이런 순간에 Currying이 매우 유용하다는 것이다. 
compose되는 함수들은 항상 1 input 1 output을 따라야한다. 당연하게도, 이를 지키지 않으면 파이프를 이어붙이기가 힘들다(당연히 불가능하진 않지만, 추가적인 노력이 들어가야하고 가독성을 심각하게 저해시킬 것이다).




### Pointfree
pointfree 스타일은 함수 합성이 간편하고 가독성을 좋게 만든다는 점에서 자주 쓰인다. 더 정확히말하면 동작만을 나열함으로써 매우 Declarative한 코드를 완성할 수 있다.
실제로 우리가 아는 거의 모든 함수형 라이브러리들이 pointfree 스타일로 쓰여있음을 기억하자.

이미 rxjs(rxjs는 functional programming 솔루션이 아니다. 그러나 사용할 수 있는 가능성은 충분하다), ramda, lodash/fp등을 접해본 독자라면 아래의 pointfree 스타일을 본적이 있을 것이다.

```js
// not pointfree because we mention the data: word
const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_');

// pointfree
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```
# 다시 카테고리로
카테고리 이론을 상단에서 살펴보았다면, 이제 이 카테고리를 실제로 어떻게 코드에 적용할 수 있을지 고민해보야한다.

프로그래밍과 대응시키기 위해 카테고리가 무엇으로 이루어져있는지 번호로 정의해보겠다.
1. object의 모임 = 타입(string, boolean 등)
2. morphism의 모임 = 순수 함수
3. morphism 중, identity = (x) => x 와 같은 morphism을 일컫는 것이다.
```js
compose(id, f) === compose(f, id) === f;
```

4. morphsim에서, composition의 개념 = 예를 들어, 어떤 morphism이 string에서 int를 가리키고 있다. 그리고 그 int에서 뻗어나온 morphism이 boolean을 가리키고 있다면 두 morphism은 string -> boolean으로(string -> int -> boolean) 합성가능하다.
맞다. 위에서 살펴본 compose다.


# Container
Functor를 코드에 적용하기 위해 먼저 컨테이너를 떠올려보자. 컨테이너는 강철문으로 굳게 닫혀 있어 열어보기 전까지 무엇이 들어있는지 알 수 없다. 일단 가장 기본적인 형태의 컨테이너를 코드로 작성해보자
```js
class Container {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Container(x);
  }
}
```
처음 보는 메서드가 설명도 없이 등장했다. of는 new 키워드를 대신하는 역할 정도로 생각해도 지금은 충분하다(물론 더 많은 역할이 있다). 일단은 of를 컨테이너에 값을 넣는 적절한 방법으로 이해하자.

위의 컨테이너 구현의 특징은 다음과 같다.
1. 컨테이너는 한 개의 프로퍼티를 가진 객체이다.$value라는 not specific한 이름을 지었다.
2. $value는 한 가지 타입에 국한되지 않는다.
3. 데이터는 삽입된 후 Container에 머문다.

## Container를 Functor로!
Container에 데이터를 넣었다. 그래서 어떻게 하라는 것인가? 우리는 Container에 들어있는 값에 대하여 연산을 수행할 수 있어야 한다. Container에 메서드를 하나 추가해야겠다.
```js
// (a -> b) -> Container a -> Container b
Container.prototype.map = function (f) {
  return Container.of(f(this.$value));
}
```
너무나도 직관적인 map이 완성되었다. Container가 가진 value에 대하여, 우리가 수행하고자 하는 연산(f)를 수행한 값을 가지고, 다시 새로운 Container를 반환한다. 굉장한 것은, 우리가 절대 Container를 벗어나지 않는다는 것이다. 그러므로 map을 끝없이 이어서 실행하는 것도 가능하다. 

그리고 이 모양 어디서 분명히 본적 있지 않은가? 바로 composition이다. Functor의 조건이란 바로 composition과 identity가 가능한 map임을 되짚어보자.

## Functor를 Maybe로!
Maybe능 Nothing과 Just로 이루어진다. Nothing이라면 default value를, Just라면 연산을 수행한 결과를 가지고 있다.
```js
class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this: Maybe.of(fn(this.$value))
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`
  }
}
```
Maybe를 완성(한참 구현할게 남았지만)했다. map에 isNothing을 참조하는 과정을 넣은 것 빼곤 거의 차이가 없다. null혹은 undefined를 감내하는 클래스가 완성되었다.

pointfree style로 항상 Functor.map형식으로 호출되어야하는 상황을 바꿔보자.
```js
// map :: Functor f => (a -> b) -> f a -> f b
const map = curry((f, anyFunctor) => anyFunctor.map(f))
```
완벽하다. 

사소하지만, Functor f라는 말은 f가 반드시 Functor여야함을 나타낸다. 잊지말자.


## IO(그리고 추상화에 대하여)
함수형 프로그래밍을 하다보면 무조건 마주치게 되는 문제가 있다. 아무리 순수 함수를 작성하려고 해도 도저히 불가능할 때가 있는데, 바로 외부와 소통하는 상황(fs, db 등등..)즉, IO이다. 

순수함수의 의미를 되짚어보자. 순수 함수란 dictionary와 하등 다를바 없는 mapping이라는 것을 이해하고 있으면 된다. 이와 같은 특성으로 인해 순수함수는 cacheable하고, parallel으로 실행하기에 완벽하다. 또한 순수함수는 절대로 외부(partial application으로 인한 클로저를 제외한 상위 스코프, 외부 프로세스 등등...) 참조하지 않는다. 즉 함수가 실행된 컨텍스트에서 모든 것이 일어난다. 이러한 특성으로 인해 순수 함수는 '시점'과 '횟수'에 아무런 영향을 받지 않는다. 

보통 거의 모든 글이 위의 문단에서 설명을 끝낸다.
잠시만 진행을 멈추고 생각해보자. 윗 문단의 내용이 과연 맞는 말인가?

답은, 틀렸다 이다.

사실 프로그래밍은 '무조건 비순수'하다. 프로그램은 개념이 아니라 실체에 의해 동작하기 때문에 수학과 근본적으로 다르기 때문이다. 아주 간단한 예를 들어보자.  커널에서 에러를 일으킬 수도 있고, 누군가가 캐시전략을 해괴망측하게 세워두는 바람에 Redis가 메모리를 다 잡아먹어버려 함수를 실행하는 순간 메모리 한계에 도달할 수도 있다. 혹은 당신이 사용중인 클라우드 가상 컴퓨터 서비스가 원인을 알 수 없이 나가버릴 수도 있다. 이런 상황들은 실제로 전세계 어딘가에서 당연한 것처럼 매일 발생하고 있다. 개념의 영역에서 벗어나는 순간 부수효과를 일으킬 수 있는 요소는 말 그대로 셀 수 없게 된다. 그에 반해 수학은? 우주가 멸망하는 날까지 수학의 함수는 올바르다.

지나치게 극단적인 상황을 다룬다고 생각하는 사람들이 있을 것이다. 맞다. 합리적인 생각이다. 그 합리적인 생각이 지금부터 설명할 추상화의 근간이다.

### 추상화
예를 들어보자. 우리는 nodejs가 잘 동작하는지를 테스트하려고 들지 않는다. 혹은 cpu가 코드를 잘 실행하는지를 검사하려고 들지 않는다. 잘 동작할 것이라는 확신이 있기 때문이다. 우리는 경험적으로 CPU나 프로그래밍 언어가 오작동을 일으킬 확률이 극히 적다는 것을 알고 있고, 유능한 엔지니어들이 온갖 테스트를 했을 것을 확신하기 때문이다. 조금 더 높은 수준으로 올라가서, 테스트로 생각해보자. 어떤 어플리케이션을 배포할 때 테스트를 하지 않고 올리지는 않을 것이다. 개발자들이 심혈을 기울여 엄청난 완성도의 테스트 코드를 만들어 100% 통과를 확인하고 배포를 했다고 가정하겠다. 이 어플리케이션은 오류가 없을까? 당연하게도 개발자들은 버그와 싸워야할 것이다(물론 엄청나게 줄여주겠지만).

하고 싶은 말은, 프로그래밍은 수학이 아니라 과학에 훨씬 가깝다는 것이다. 동작 확률이 100%(애초에 100%를 달성하는 것 자체가 불가능)가 아니라 99%이기 때문에 자신있게 배포한다는 것이다. 로켓 발사 성공 확률이 100%가 아님에도 불구하고 목숨을 거는 우주 비행사들과 같은 것이다.

즉, 함수형 프로그래밍에선 극히 낮은 확률로 일어날 부수효과에 대해선 퉁(추상화) 친다. 어떤 개발자도 이 전제에서 벗어날 수 없다.

문제는 그 '극히 낮은 확률'이라는 것은 정의하기 나름이라는 것이다. 이런 특성때문에 함수형 프로그래밍에서 '순수 함수'라는 단어가 갖는 의미는 꽤 복잡하다. abstraction level을 어느 정도로 설정하느냐에 따라 어떤 함수가 순수함수일 수도 있고, 아닐 수도 있다(!). 이는 처음에는 혼란스럽게 느껴지지만, 이내 추상화(퉁)가 함수형 프로그래밍이 가지는 묘미 중 하나임을 알게 될 것이다.

혹자는 꽤 실망했을 지도 모른다(저는 그랬습니다). 함수형이 마치 엄청나게 sophisticated한 기술이라서, 순수함을 항상 보장(추상화 없이)할 수 있다고 믿는 사람(제가 그랬습니다)들도 있을 것이다. 또 누군가는, 추상화를 피할 수 없다고 해도 최대한 줄이는 것이 좋다고, 그게 올바른 함수형이라고 생각하는 사람들도 있을 것이다. 물론 시도 때도 없이 추상화를 하면 안되지만, '추상화를 줄인다 = 좋은 함수형 프로그래밍'인 것은 또 아니다. 나의 의견을 뒷 받침할 두 개의 링크를 첨부한다.

Functional Programming Doesn't Work: https://prog21.dadgum.com/54.html  
85% functional language purity: https://www.johndcook.com/blog/2010/04/15/85-functional-language-purity/

누군가는 여전히 순수성을 위해 많은 것들을 포기해도 된다고 생각할지도 모른다. 그것은 의견의 차이다. 나의 의견은 다음 소프트웨어 개발 격언으로 압축된다.

**"실용성은 순수성을 이긴다"**

### 추상화와 IO
앞서 언급한 물리적, 컴퓨터 구조적 한계를 추상화해서 격리한다고 해도 impure function은 여전히 문제이며, 그 대표격이 IO이다. 물론 추상화 없이 모든 것을 pure하게 만들 수도 있다. 그러나 그런 프로그램은 비즈니스적인 가치를 지닐 확률이 매우 낮다(위에서 첨부한 링크를 읽어봐도 좋고, DB, FS, cloud service와 소통하지 않는 웹 서버를 상상해봐도 좋다). 그렇기 때문에 functional일지라도 impurity를 프로그램 내에 포함하는 것은 당연하다시피 여겨진다.

IO는 '무조건 비순수'하다. 의문을 제기하는 사람이 분명히 있을 것이다. 예를 들어 DB에서 값을 읽어오는 것은 '비순수'하다고 하기 힘들다고 생각하는 사람도 있을 것이다. 그러나 이런 관점은 프로그래밍적으로 Action(impure), Calculation(pure), Data의 분류를 제대로 이해하지 못해서 생기는 오해다. SQL로 SELECT문을 DB에 날린다고 생각해보자. 어제 A서비스에 가입된 가입자 수는 10명이다. 오늘 A서비스에 가입된 가입자 수는 20명이다. 전체 회원의 정보를 조회하는 쿼리를 DB에 전송하는 함수를 제작했다고 생각해보자. 이 함수를 실행시킨 결과는 '시점'에 영향을 받고 있다. 어제 실행한 함수의 결과는 10이고, 오늘 실행한 함수의 결과는 20이기 때문이다. DB가 에러를 반환할 위험 역시 항상 내재되어있는 부수효과다.

### IO side-effect 밀어내기
IO는 앞서말했듯이 비순수하기 때문에 순수한 연산에 포함시키기가 골치아프다. 이 때 기억해야할 것은 함수를 값으로 취급할 수 있는 함수형 프로그래밍의 특징이다.
흔히 사용하는 기법은, '함수의 평가를 미루는 것'이다. IO함수의 평가를 미뤘으니 합성될 함수들도 평가될 수 없다. 이 때 함수들을 체이닝하여 하나의 커다란 함수를 만드는 식으로 순수한 연산을 만들 수 있다. 뭔가 아쉽지 않은가? 아쉬운 이유는 어차피 함수 체이닝을 완료한 시점에는 비순수함수가 호출되어야 하기 때문이다. 이것은 IO가 가지는 본질적인 한계다. 앞서 말한 impurity는 결국 포함될 수 밖에 없는 상황이 이런 것이다. 그러나 이것만으로도 우리는 얻는 것이 많다. 첫 번째, impurity를 격리했다. Action은 그 Action을 포함하는 함수 자체를 Action으로 만든다(99% pure, 1% impure라고 하더라도 그 함수는 무조건 Action이다). 순수한 연산과 비순수한 함수 호출을 분리함으로써 안전한 영토를 꽤 많이 확보 했다. 두 번째, 부수효과 핸들링의 편의성이다. 비순수한 함수를 특정 위치에서 실행하며 그 부수효과를 처리하는 과정을 일관된 형태로 작성할 수 있다는 것이다.

### IO side-effect 격리하기
여전히 답답하다! 우리에겐 Monad(or Functor)가 있기 때문이다. 그래서 윗 문단은 '밀어내기'이고 이번 문단은 '격리하기'이다. 에러를 일으킬 값들을 추상화해서 격리시키거나(ex: Maybe) 에러 자체를 추상화하거나(ex: Either)혹은 둘다 활용해도 된다. 다시 말하지만 추상화 레벨을 결정하는 것은 철저히 개발자의 몫이다. 밀어내기와 격리하기를 둘다 활용해도 되고, 격리하기만 활용해도 되고, 아무것도 활용하지 않아도 된다(비순수함을 유지). 

현대의 IO는 아무리 순수함수보다 위험하다고 해도 그 작동성을 꽤나 보장받는다(개발자가 오타가 포함된 쿼리를 날리는 등의 경우는 작동성의 영역이 아니다). 그러므로 '항상 동작한다'를 가정해도 문제가 없다(이미 많은 함수형 프로그래밍 솔루션에서 채택하는 방식이다). '항상 동작한다'와 에러를 함께 추상화해서 EitherIO 라고 이름 붙여도 좋다. 이런 컨벤션은 실제로 fp-ts에서 활용하는 방식이다. Folktale의 Task는 이와 이름은 달라도 마찬가지의 동작을 수행한다.

# Functor의 identity와 compose가 뜻하는 의미
먼저 만족해야하는 조건부터 살펴보자
```js
// identity rule
map(id) === id;

// composition rule
compose(map(f), map(g)) === map(compose(f, g));
```
처음봤을 때는 identity라는 것이 왜 필요한지 난해하게 느껴졌다. compose는 뭐라도 하지만 id는 말 그대로 자신이 자신과 같다는 것이 뭐가 그리 중요한가 싶었다. 핵심은 map(id)부분에 있다. id가 자기 자신인 것은 당연하지만 map(id)가 자기 자신을 반환하는 것은 map이 그렇게 설계되어있어야 한다는 뜻이다. map(id)가 id라면(f -> f(x)라면), 또 compose를 올바르게 구현했다면 composition또한 성립할 것이다.

카테고리 이론에서, 펑터들은 카테고리의 객체와 사상들을 받아 다른 카테고리로 map하는 역할을 한다. 상술했듯 객체와 사상들은 빠짐없이 map되야한다. identity도 포함해서 말이다. 그러나 앞서 살펴본 카테고리 이론에서 언급했듯 프로그래밍에서 functor는 항상 endofunctor다. 즉, Category -> Another Category가 아니라, Category -> Subcategory이다. 

또 하나 중요한 것은 사상이 향하는 가리키는 방향이 일치하면, 결과의 타입 또한 일치한다는 것이다. 예를 들어 f(a) -> b라면 map(f(F a)) -> F b라는 것이다(a가 b로).
마찬가지로 of라면 F.of(a) -> a 이고 F.of(b) -> b이다(같은 타입 반환).

# of의 진짜 역할
of메서드가 포함된 functor를 pointed functor라고 한다. of의 역할은 항상 new ClassName(constructorParam)형태의 호출이 아닌 어떤 값이던 즉시 같은 타입의 펑터로 감싸여진 값을 얻기위해 사용된다. X타입의 펑터를 만들고 map하고 싶다면 X.of(value).map(fn)와 같은 형태로 즉시 가능하게 만들어 준다는 것이다. default minimal context라는 말이 이를 잘 표현해준다. 타입의 값을 제거한 후 어떤 펑터의 어떤 행동이던간에 평소대로 map할 수 있게 한다는 것이다.

사실 Left.of는 말이 안된다. 각 펑터는 값을 넣을 하나의 방법을 가져야하는데 Either의 경우라면 new Right(value)이다. 즉, Either.of는 Right를 사용한다는 것인데, 그 이유는 map을 실행하면 map이 동작해야하기 때문이다(Left는 아무런 동작도 하지 않는다).

pure, point, unit, return등 여러 이름으로 불리지만 다 of의 또 다른 이름들일 뿐이다.

# 드디어, Monad
지금까지 배운 것들을 바탕으로 Monad의 요건을 살펴보자: "Monads are pointed functors that can flatten". join(flat), of, 모나드의 조건들을 가지는 functor는 모나드이다.
flat한다는 것이 상당히 중요한데, 예를 들어 지금까지 살펴본 functor를 반환하는 함수를 compose하면 어떤 일이 일어날까?
```js
const container_X = x => new Container(x);
const container_Y = y => new Container(Y);
const XY = compose(map(container_X), container_Y)
// === Container('hi').map(container_X)

XY('hi!')
// === Container(Container('hi!'))
```
즉, 우리가 원하는 값인 'hi!'를 얻기 위해선 XY('hi!').fold().fold()라고 실행해야 하는 것이다. 문제는, 이런 상황이 매우 자주 일어나고 더욱 여러번 중첩되는 경우들이 생겨난다는 것이다.

모나드는 Flat할 수 있다고 위에서 언급했으므로, 이런 원리를 그대로 사용하는 Maybe의 join을 살펴보자
```js
Maybe.prototype.join = function join() {
  return this.isNothing() ? Maybe.of(null) : this.$value;
}
```
isNothing은 단순히 객체가 Nothing인지를 판별하는 것이고, Nothing이 맞다면 아무런 값도 가지지 않아야 함은 이미 살펴본바 있다. Nothing이 아니라면 value를 반환하고 있는데, 이런 구현으로 우리는 중첩된 객체를 한꺼풀 한꺼풀씩 벗겨낼 수 있다. IO펑터라면 함수로 구성한 값들일테니 join을 실행하면 그 함수를 실행하면 된다. fold와 같은 원리로 unsafePerformIO등의 이름으로 IO펑터안에 메서드가 존재할 것이므로 합성 중간중간에 join을 끼워넣으면 여전히 순수한 연산을 유지함과 동시에 연결된 함수를 평가할 때는 join도 실제로 실행되면서 꺼풀을 벗겨내게 되는 것이다.

## 뭔가 이상하다..
join한꺼풀 씩 layer들을 벗겨낸다면, 최종 결과가 IO(IO(IO('hi!')))와 같은 경우 compose에는 join이 세번이나 들어가야한다. 너무나 불편하게 느껴진다. 매번 펑터 껍질이 생기는 부분을 인지하면서 join을 파이프에 수기로 작성하라는 것은 개발의 효율을 전혀 늘려주지 않는다. 차라리 IO(IO(IO('hi!'))).join().join().join()을 실행하는 것이 개발 속도를 높여줄 것 같다.

## Chain: 패턴에 주목하자
사실 윗 문단에서 살펴본 동작에는 패턴이 존재하는데, 보통 새로운 layer가 생기는 부분이 map이라는 것이다. 그렇다면... map을 실행할 때 자동으로 join을 시키면 되는 것 아닐까?
```js
// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = curry((f, m) => m.map(f).join());
// or
const chain = f => compose(join, map(f));
```
정답이다. map에 들어가는 함수가 새로운 펑터를 반환할 경우 map -> join -> map -> join하기 보다는 chain -> chain으로 하면 훨씬 깔끔해질 것이다.
```js
// map/join
const container_hi = hi => new Container('hi')

const hi_mapJoin = compose(
  join,
  map(container_hi),
  join,
  map(container_hi),
  container_hi,
);

// chain
const hi_chain = compose(
  chain(container_hi),
  chain(container_hi),
  container_hi,
);
```
참고로 chain, bind, flatMap등은 모두 동일한 동작을 일컫는다.
## Monad's Rule
규칙은 두 가지이며 순차적으로 살펴보겠다.
첫 번째은 Associativity이다.
```js
compose(join, map(join)) === compose(join, join);
```
중요한 것은, map(join)과 join은 같지 않다는 것이다. 또다시 Container를 불러내어 예를 들어보자. Container.prototype에 정의한 적은 없지만, 내부 값을 꺼내는 join메서드가 정의되어 있다고 가정한다.
```js
const nestedContainer = new Container(new Container('hi'))
// map(join)은 this.$value(Container('hi'))에 대하여 호출된다. 
// 즉, join(Container('hi')) -> 'hi'이지만
// map이 자기 자신의 타입으로 감싸 반환하므로
// map(join)의 결과는 Container('hi')가 된다.
// 이후 join으로 한 꺼풀 더 벗겨져 최종적으로 'hi'가 된다
compose(join, map(join))(nestedContainer);

// 두 번 꺼풀이 벗겨져 'hi'가 된다.
compose(join, join)(nestedContainer);
```

두 번째 규칙은 Identity이며 아래와 같다.
```js
// identity for all (M a)
compose(join, of) === compose(join, map(of)) === id;
```
사실 첫 번째 법칙이 이해가 됐다면 두 번째 법칙은 자동해결이다. of가 자신의 타입으로 한꺼풀 감싼다는 것만 기억하면 된다. 결과적으로 두 번째 규칙의 세 경우에 대하여 인자가 M a라면, 결과 또한 M a이다. 이 형태를 두고 triangle identity라고 한다.

Identity? Associativity? 그렇다. 카테고리다. 그렇다면 monad compose를 작성하는 것도 분명히 가능할 것이다.
```js
const mcompose = (f, g) => compose(chain(f), g);
```
mcompose는 아래의 규칙들도 모두 만족한다. 이해를 위한 설명을 덧붙이자면 아래의 f,g,h,M은 모두 어떻든간에 monad를 반환하는 함수들이다. M은 id함수로 이해하면 된다.
```js
// left identity
mcompose(M, f) === f;

// right identity
mcompose(f, M) === f;

// associativity
mcompose(mcompose(f, g), h) === mcompose(f, mcompose(g, h));
```
참고로, 어떤 category의 모든 object가 monad이며 모든 사상은 chained function일 때 이를 kleisli category라고 한다.
# Applicative
대망의 Applicative까지 도달하고야 말았다. 괄목할만한 일이다. 바로 chain과 applicative가 fantasy-land에서 정의하는 monad의 laws이기 때문이다. 기초적이더라도 monad를 이해했다고 볼 수 있는 단계에 도달했다는 것이다.

보통 ap라는 메서드로 표현되는 apply functor는 어떤 연산을 functor로 감싸인 값에 적용하기 위해 사용된다. ap는 단지 코드양을 줄여줄 뿐 아니라 sequential evaluation에서 벗어날 수 있게 해준다. 예제로 살펴보자.

```js
// ap가 없을 때
Container.of(2).chain(two => Container.of(3).map(add(two)));
```
2와 3은 동시에 생성되어도 아무 상관 없으나 단지 코드의 진행 때문에 3이 2보다 늦게 instantiate될 것은 자명하다. 

먼저 ap를 정의해보자. 중요한 것은 $value가 function이어야 한다는 것이다.
```js
// ap 정의
Container.prototype.ap = function (otherContainer) {
  return otherContainer.map(this.$value);
};
```
지금까지 써오던 map과의 구조를 비교해보도록 하자.
```js
F.of(x).map(f) === F.of(f).ap(F.of(x));
```
이 연산에서 주목할 만한 점은 left-to-right으로 코드를 작성할 가능성을 보여준다는 것이다. 또 다시 예를 들어보자
```js
Container.of(2).map(add).ap(Container.of(3)) === 
Container.of(add).ap(Container.of(2)).ap(Container.of(3))
```

아직 이게 뭐가 그리 장점인지 와닿지는 않을 것이다. 가독성이 올라가는 것도 좋지만 ap의 진짜 힘은 병렬평가에 있다.

```js
Task.of(renderPage).ap(Http.get('/destinations')).ap(Http.get('/events'));
```
renderPage함수는 항수가 2이고 curry되었으며, 각 인자로 HTML을 생성해 반환하는 함수라고 가정한다. Http의 메서드는 Task(Folktale)를 사용해 비동기 처리를 수행 중이며 새로운 Task객체를 반환한다고 가정한다.

원래 쓰던 코드와 다른 점은 두 개의 Http 요청이 즉시 실행될 것이며, renderPage는 요청들이 모두 완료된 후 실행된다는 것. 즉, sequential evaluation에서 벗어난 것이다.
이는 renderPage가 curried되었기 때문에, 두 개의 인자가 모두 들어온 후에야 작동함을 보장받고 있기에 가능한 일이다.
### Pointfree로 바꿔보기
우리가 ap메서드까지 작성한 시점에서, map은 of/ap와 같아진다(map(g) === of(g).ap).
그러므로 다음과 같은 코드를 작성할 수 있다.
```js
const liftA2 = curry((g, f1, f2) => f1.map(g).ap(f2));
const liftA3 = curry((g, f1, f2, f3) => f1.map(g).ap(f2).ap(f3));
// liftA4, liftA5, ..., liftAn
```
g는 함수이며, f들은 모두 applicative functor이다.  A2, A3등과 같은 이름들이 굉장히 불편하게 느껴질 수 있지만, 이런 naming convention은 self descriptive하고 인자의 갯수를 변경할 수 없다는 점에서 안정성이 높으므로 널리 사용된다.

새롭게 작성한 lift함수들을 사용하여 위에서 작성한 예제들을 재작성해보자
```js
liftA2(add, Maybe.of(2), Maybe.of(3));
// Maybe(5)

liftA2(renderPage, Http.get('/destinations'), Http.get('/events'));
// Task('<div>some page with dest and events</div>')
```
코드의 양이 줄어듦은 물론이거니와 가독성이 극대화되었다.

## ap를 활용해 map 재정의하기
```js
X.prototype.map = function map(f) {
  return this.constructor.of(f).ap(this)
}
```
of/ap가 map과 같음은 상술했으니 생략하겠다. 다만, monad(chain 보유)라고 생각하면 구현을 조금 다르게 할 수 있다. 

여기서 잠시 chain을 곱씹어볼 필요가 있다. chain을 map과 join 구현이 선행된 상태에서 prototype에 추가한다고 생각해보자.
```js
X.prototype.chain = function(f) { return this.map(f).join(); }
```
그런데 chain은 사실 'map와 join이 일어나는 것과 같다'면 어떤 식으로 작성하더라도 상관없다. chain은 단지 새로운 monad가 반환된다면 그 값을 연결시키는 역할이다. 꼭 map과 join구현이 완성된 상태에서 구현해야하는 메서드가 아니라는 것이다.

그렇다면 chain의 구현이 map보다 선행되었을 경우로 뒤집어서 생각해 볼 수 있다. map이 chain을 통해 구현되는 것이다.

아래의 구현에서 map을 정의하는 과정에서 a 인자는 'any value'로 받아들이면 된다.
this(of를 통해 생성된 객체)의 value가 a이다. 어떤 식이던, chain의 내부 구현은 $value를 사용하도록 작성되어있다고 가정하는 것이다.

반면 두번째 구현인 ap에 할당되고 있는 함수에서, f 인자는 this.$value가 function일때 만 가능(이해가 안된다면 ap의 목적을 다시 읽어보자)하기 때문에 f라고 명시한것이다.
```js
X.prototype.map = function map(f) {
  return this.chain(a => this.constructor.of(f(a)));
};

X.prototype.ap = function ap(other) {
  return this.chain(f => other.map(f));
};
```
이런식으로 만약 모나드를 작성(chain이 포함된 functor)할 수 있다면, 우리는 자동으로 functor(map)와 applicative(ap)를 얻게 된다. 이런 방식은 구조적으로 상위의 메서드를 구현하면 하위 메서드를 구현 할 수 있다는 것을 보여준다는 점에서 주목할만 하지만, 위와 같은 방식의 chain을 통해 ap를 구현하면 ap의 동시성(병렬 평가)을 잃는다는 점에 주의해야 한다.

일단 applicative functor는 "closed under composition"이라는 것을 기억하자(monad가 아닐 때. 즉 chain을 통해 펑터 꺼풀을 벗겨내지 않을때). 이는 타입이 섞이지 않음을 보장할 수 있다는 점에서 monad대신 applicative functor를 사용할 중요한 이유가 된다(상황에 따라 다른 것).

예를 들어보자
```js
const tOfM = compose(Task.of, Maybe.of);

liftA2(liftA2(concat), tOfM('Rainy Days and Mondays'), tOfM(' always get me down'));
// Task(Maybe(Rainy Days and Mondays always get me down))
```
tOfM 타입(Task(Maybe(v)))이 각각 생성되었음에도 불구하고 그대로 유지된채 결과가 반환되었다.

의문이 들 수 있다. 왜 굳이 functor, applicative functor, monad 등을 힘들게 구분하는가? 어차피 monad는 functor의 모든 구현을 가지고 있으니 항상 monad를 사용하면 되는 것 아닌가? 하는 생각을 할 수 있다. 그러나, 자신이 필요한 만큼의 구현만을 가진 다는 것은 상당히 중요한 문제다. 개발자가 문제와 해결책을 정확하게 파악하고 있는지를 가늠할 수 있을 뿐 아니라, 추가적인 functionality는 오히려 예측할 수 없는 작동을 내재하고 있다. 
적은 구현은 그만큼 직관적이고 예측 가능성을 높여준다. 이러한 이유로 항상 monad만 쓰면 된다는 주장은 옳지 않다.

## applicative functor laws
#### identity
```js
A.of(id).ap(v) === v;
``` 
앞서 살펴본 바와 같다. ap를 적용하려면 ap의 this.$value는 function이어야하고, id function은 x => x이며, ap의 인자 v는 functor이다. 주목할 만한 점은 of/ap가 map과 같음을 살펴보았으므로 자동으로 map(id) === id까지 함께 충족한다는 것이다.

#### homomorphism(준동형 혹은 준동형 사상)
두 구조 사이의, 모든 연산 및 관계를 보존하는 함수. functor는 category사이의 homomorphism임을 떠올려보자.
```js
A.of(f).ap(A.of(x)) === A.of(f(x));
```
위의 검증은 A.of(f).ap(A.of(x))가 준동형을 만족함을 검사하는 것이다.

#### interchange
함수를 left or right에 두던 상관없음을 검증해보자. v는 function을 value로 가지고있는 functor이고, x는 any value이다.
```js
v.ap(A.of(x)) === A.of(f => f(x)).ap(v);
```
예를 들어 다음과 같다.
```js
const v = Task.of(reverse);
const x = 'Sparklehorse';

v.ap(Task.of(x)) === Task.of(f => f(x)).ap(v);
```

#### composition
아래에서 u,v는 함수고, w는 인자라고 이해해보자(당연히 u,v,w 모두 functor로 감싸져있다). 함수를 무한정 받을 수 있는 compose를 위에서 완성시켜보았지만 여기선 함수 두 개를 인자로 받는 기본적인 compose로 생각하자.
```js
A.of(compose).ap(u).ap(v).ap(w) === u.ap(v.ap(w))
```
compose(u, v)(w)와 u(v(w))가 같음을 ap가 실현할 수 있는지를 검증하는 것이다. 

## applicative를 마치며
applicative는 multiple functor arguments가 필요할 때 유용하다는 것을 기억해두자. 모든 연산을 functor내에서 실행할 수 있게 해주는 존재다. 물론 monad를 통해 이와 비슷한 구현(chain)을 했지만 monadic specific functionality가 필요하지 않다면 applicative functor를 선호해야함을 기억하자. 

# Natural Transformation(자연변환)
자연변환은 한 줄로 압축된다: "Morphism between functors".
값이 바뀌는 것이 아니라 값을 감싸고 있는 functor의 type이 바뀌는 것이다.

fp에서 이 개념이 중요한 이유는 NT를 실행하지 않은 경우 functor가 끝없이 nest된다는 점이다. 앞에서 nested functor를 해결하지 않았냐고 물을 수 있다. 그 때는 nest된 예제들이 모두 하나의 타입이었다는 것이 차이점이다. 지금 말하는 nested functor는 마치 Functor A(Functor B(Functor C(Functor A(Functor C(v))))) 와 같은 경우를 말하는 것이다.

functor 내부의 값을 바꾸는 것이 아니라는 점에서 다음이 성립한다.
```js
// nt :: (Functor f, Functor g) => f a -> g a
compose(map(f), nt) ===  compose(nt, map(f))
```
nt의 예제를 살펴보자
```js
// idToMaybe :: Identity a -> Maybe a
const idToMaybe = x => Maybe.of(x.$value);

// idToIO :: Identity a -> IO a
const idToIO = x => IO.of(x.$value);
```
간단하다. 값을 꺼내서 새로운 functor에 넣고 있다.
좀 더 복잡한 예제를 살펴보자

```js
// eitherToTask :: Either a b -> Task a b
const eitherToTask = either(Task.rejected, Task.of);

// ioToTask :: IO a -> Task () a
const ioToTask = x => new Task((reject, resolve) => resolve(x.unsafePerform()));
```
eitherToTask는 Task에서 Either의 Left와 Right에 대응되는 값을 대입하고 있다. 물론 이는 either라는 함수가 Left position과 Right position을 인자로 받는 형태라고 가정했기에 가능한 것이다.

ioToTask는 IO functor의 값을 평가(unsafePerform)하여 Task객체로 resolve하고 있다.

이해도를 높이기 위해 조금만 더 복잡한 예제를 살펴보자
```js
// maybeToTask :: Maybe a -> Task () a
const maybeToTask = x => (x.isNothing ? Task.rejected() : Task.of(x.$value));

// arrayToMaybe :: [a] -> Maybe a
const arrayToMaybe = x => Maybe.of(x[0]);
```
Maybe에는 isNothing이 구현되어 있다. Maybe는 잠재적으로 Nothing 혹은 Just이므로 자신이 Nothing이라면 true를 반환하는 간단한 메서드이다. 이름 참조해 Task의 하위 타입으로 변환한다.

다음 예제가 더욱 중요하다. Array는 거의 모든(사실상 모든) 언어에 구현되어 있으며 가장 기본적이고 직관적인 Functor이다. 잠시 Array가 functor가 맞는지 identity와 compose로 검증해보자.

객체를 ===로 비교할 수 없지만 직관적인 표현을 위한 것이니 너그럽게 이해해주길 바란다.
```js
const arr = [1,2,3]
// identity
arr.map(x => x) === arr // Ok

// compose
arr.map(x => f(g(x))) === arr.map(x => g(x)).map(x => f(x)) // Ok
```

이러한 Natural Transformations에서 눈 여겨봐야할 점은 변환이 항상 더 넓은 범위 쪽으로 흐른다는 것이다. 예를 들어 살펴본 예제에서 IO가 Task로 변환되는 이유는 IO가 동기(IO자체가 동기라는 것이 아니고 IO functor는 단지 함수만을 값으로 연산하므로 동기)이고 Task가 비동기이기 때문이다. Array가 Maybe로 변환되는 이유는 Array는 '실패'를 포함하지 않지만 Maybe는 포함하기 때문이다. 넓은 쪽이 좁은 쪽으로 변환되는 것은 불가능함을 주의하자. 특히 IO가 Task로 NT되는 것은 주위에서 가장 많이 찾아볼 수 있는 케이스일 것이다. 

#### 기능 가져오기
이런 특성은 다른 functor에 존재하는 기능을 사용하고자 할 때 매우 유용한데, 다음을 살펴보자
```js
// arrayToList :: [a] -> List a
const arrayToList = List.of;

const doListyThings = compose(sortBy(h), filter(g), arrayToList, map(f));
const doListyThings_ = compose(sortBy(h), filter(g), map(f), arrayToList); // law applied
```
sortBy라는 메서드가 List객체에만 존재한다고 가정한다. array에는 sortBy가 존재하지 않으므로, array를 list로 nt한 후 sortBy를 실행한다.

#### 자연변환과 isomorphism(동형 사상)
구조가 동일한 두 대상 사이에서 모든 구조가 보존되면 그것을 동형 사상이라고 한다. 두 대상 사이에 동형 사상이 존재하면 두 대상은 동형이라고 한다. 동형인 두 대상은 구조가 같아 서로 구분할 수 없다.

대표적인 예는 무엇일까? 바로 Array와 List이다. Array와 List는 동형이며 서로 간의 변환이 가능하다. 프로그래밍에서 이는 각 functor가 지니고 있는 데이터가 서로 간의 형 변환에 따라 소실되지 않음을 의미한다. 예를 들어, Array [3] 을 List [3]으로 변환한다고 해서 3이라는 데이터는 전혀 소실되지는 않는다. 

구체적인 예를 들어서 살펴보자
```js
// promiseToTask :: Promise a b -> Task a b
const promiseToTask = x => new Task((reject, resolve) => x.then(resolve).catch(reject));

// taskToPromise :: Task a b -> Promise a b
const taskToPromise = x => new Promise((resolve, reject) => x.fork(reject, resolve));

const x = Promise.resolve('ring');
taskToPromise(promiseToTask(x)) === x;

const y = Task.of('rabbit');
promiseToTask(taskToPromise(y)) === y;
```
Task와 Promise는 동형이며 NT하더라도 데이터는 전혀 소실되지 않는다.

그렇다면 isomorphic하지 않은 상황을 살펴보자
```js
// maybeToArray :: Maybe a -> [a]
const maybeToArray = x => (x.isNothing ? [] : [x.$value]);

// arrayToMaybe :: [a] -> Maybe a
const arrayToMaybe = x => Maybe.of(x[0]);

const x = ['elvis costello', 'the attractions'];

// isomorphic하려면 서로 간 형변환을 해도 데이터 소실이 없어야 함을 기억하자
// 아래의 예는 'the attractions'가 소실되었다.
maybeToArray(arrayToMaybe(x)); // ['elvis costello']

// 그러나 NT임에는 분명하다!
compose(arrayToMaybe, map(replace('elvis', 'lou')))(x); // Just('lou costello')
// ==
compose(map(replace('elvis', 'lou'), arrayToMaybe))(x); // Just('lou costello')
```

### NT 함수를 항상 정의하는 것만이 답?
물론 아니다. 사실 monad에서 살펴본 chain을 활용하면 자연스럽게 NT를 진행할 수 있다. 생각해보면 join을 통해 한 꺼풀 벗긴 값을 새로운 functor에 할당하면 NT가 된다는 것은 자연스러운 발상이다. 예제를 통해 살펴보자
```js
// getValue :: Selector -> Task Error (Maybe String)
// postComment :: String -> Task Error Comment
// validate :: String -> Either ValidationError String

// saveComment :: () -> Task Error Comment
const saveComment = compose(
  chain(postComment),
  chain(eitherToTask),
  map(validate),
  chain(maybeToTask),
  getValue('#comment'),
);
```
AtoB와 같은 NT 함수가 포함되어있지 않음에도 불구하고 자연스럽게 NT가 완료되었음을 확인할 수 있다.

## NT의 효과
를 정리해보자면, 
1. 필요한 기능을 포함하고 있는 타입으로 변환할 수 있다.
2. Nested 된 구조를 해결할 수 있다.

# Traversal
어떤 functor가 다른 functor와 중첩되어있을 때 functor를 반전시킬 순 없을까?
예를 들어서, [Task('hail the monarchy'), Task('smash the patriarchy')] 라면
Task(['hail the monarchy', 'smash the patriarchy'])로 말이다(array도 functor임을 기억하자). 이런 동작을 왜 해야할까? 예를 들어 join을 하고자 할 때 이런 식의 동작이 필요하다. IO(Maybe(IO('hi')))가 있다고 생각해보자. IO(IO(Maybe('hi')))로 만들어서 IO를 join시켜서 꺼풀을 벗겨낼 수 있다는 것이다.

### sequence와 traverse
sequence, traverse는 Traversal이 되기 위한 interface이다. sequence의 역할은 functor를 반전시켜 rearrange하는 것이다. 예를 들어 살펴보자. 첫 번째 인자는 모두 Applicative.of이고, 두 번째 인자는 Traversable들이다.
```js
sequence(List.of, Maybe.of(['the facts'])); // [Just('the facts')]
sequence(Task.of, new Map({ a: Task.of(1), b: Task.of(2) })); // Task(Map({ a: 1, b: 2 }))
sequence(IO.of, Either.of(IO.of('buckle my shoe'))); // IO(Right('buckle my shoe'))
sequence(Either.of, [Either.of('wing')]); // Right(['wing'])
sequence(Task.of, left('wing')); // Task(Left('wing'))
```
of로 인해 functor가 rearrange되고 있음을 확인 할 수 있다.
sequence가 구현되어있다는 가정하에 pointfree sequence의 명세를 분석해보자.

**sequence :: (Traversable t, Applicative f) => (a -> f a) -> t (f a) -> f (t a)**
a -> f a인 함수(of)를 인자로 받아, 두 번째 인자 t (f a) 즉, traversable(f a)하여 f (t a)로 반전시킨다. 사실 첫 번째 인자인 a -> f a는 typed language라면 필수가 아니다(애초에 Applicative 타입만 받으면 되니까). 그래서 sequence의 필수 인자는 엄밀히 말해 t (f a)하나이다.

이런 동작을 하는 sequence 메서드가 정의되어있다고 가정하고, 이를 pointfree로 표현하면 다음과 같다.
```js
const sequence = curry((of, x) => x.sequence(of));
``` 

위에서 sequence가 메서드로 구현되어 있다고 가정한 이유는 사실 sequence가 종류에 따라 구현이 달라져야 함이 자명하기 때문인데, 예를 들어 다음과 같다.
```js
class Right extends Either {
  // ...
  sequence(of) {
    return this.$value.map(Either.of);
  }
}
```
$value에 대해 곧장 map을 호출할 수 있는 이유는, $value가 Applicative임을 가정하기 때문이다. of를 인자로 받아놓고 쓰지 않는 이유는 인터페이스의 통일성 때문이다. Right와 Left는 같은 인터페이스를 사용하되 세부구현은 다르다는 것을 떠올려보자. Left의 sequence는 다음과 같은 형태일 것이다.

```js
class Left extends Either {
  // ...
  sequence(of) {
    return of(this);
  }
}
```
typed language에서 outer type은 추론할 수 있으므로(Applicative만 사용할 수 있게 하면 되므로) 명시적으로 of를 사용할 필요는 없다는 사실도 기억해두자.

### 효과를 정리해보기
functor가 어떤 순서로 중첩되어 있느냐에 따라 그 값이 내포하는 효과는 달라진다. 예를 들어, [Maybe a]라면 possible values[](Left와 Right가 포함)다. 그러나 Maybe [a]라면 Nothing(default value) 혹은 a[](Right 값) 일 것, 즉 All or Nothing일 것이다. 

좀 더 자세한 예를 들어보자
```js
// fromPredicate :: (a -> Bool) -> a -> Either e a

// partition :: (a -> Bool) -> [a] -> [Either e a]
const partition = f => map(fromPredicate(f));

// validate :: (a -> Bool) -> [a] -> Either e [a]
const validate = f => traverse(Either.of, fromPredicate(f));
```
partition은 signature에서 보이듯 array를 인자로 받는함수이며, map의 결과 당연하게도 [Either e a]가 되었다. 그러나 traverse를 사용한 validate 함수는 마찬가지로 array를 인자로 받았음에도 불구하고 결과는 Either e [a]로, 모든 값이 array안에 포함되버린 partition과는 다른 결과를 보여주고 있다.

둘 중에 뭐가 더 좋고 나쁘다는 우선순위를 가져선 안된다. 예를 들어, 모든 값이 array안에 그대로 보관된다면 여러 값들에 대한 함수 실행 결과를 그대로 관찰할 수 있게 된다. 반대로 validate와 같이 올바른 경우만 걸러내고 싶을 수도 있다. 상황에 따라 올바른 방식을 선택하면 된다.

traverse의 구현의 예를 살펴보자. 복잡하게 느껴질 수 있으니 설명을 덧붙이겠다.
```js
traverse(of, fn) {
    return this.$value.reduce(
      (f, a) => fn(a).map(b => bs => bs.concat(b)).ap(f),
      of(new List([])),
    );
  }
```
일단 $value가 reduce를 포함한 객체임을 가정하고 있다. reduce는 predicate와 seed를 인자로 취함을 알고 있을 것이다. seed는 빈 List를 값으로 가진 functor이다. 예를 든 것처럼 Either.of를 of인자로 넘기는 상황이라면 Right([])이 될 것이다. traverse가 인자로 받고 있는 fn은 functor를 반환하는 함수여야 한다. reduce가 받고 있는 f, a에서 f는 accumulator이며, a는 iteree이다. 함수의 진행을 살펴보면, fn(a)로 인해 functor가 생성되고, map하며 b에는 fn(a)로 인해 반환된 functor의 $value를 받고, bs -> bs.concat(b)함수를 리턴하고 있다. 여기까지 도달하면 functor의 $value가 함수가 되었으니 ap를 실행할 수 있다. ap의 대상은 functor이므로 여기까지 도달하면 f가 functor이며, f.$value는 concat메서드를 가지고 있어야 가능함을 알 수 있다. 위의 구현에선 f.$value(bs 인자)는 List이므로 concat을 가지고 있다.

결론적으로 accumulator는 Either e [a]로 출발하여 같은 타입으로 마무리하고 결과를 반환하게 된다.

## Traversable Laws
피해갈 수 없는 법칙 검증의 시간이다. Identity, Composition, Naturality를 살펴볼 것이다.
#### Identity
```js
u.traverse(F, F.of) === F.of(u)
```
예를 들어보자
```js
const identity1 = compose(sequence(Identity.of), map(Identity.of));
const identity2 = Identity.of;

identity1(Either.of('stuff'));
// Identity(Right('stuff'))

identity2(Either.of('stuff'));
// Identity(Right('stuff'))
```
이전의 Identity들과는 다르게 언뜻 이해가 되지 않을 수도 있다. 일단, identity1의 map단계에 도달했을 때의 상태는 Right(Identity('stuff'))이다. 그 다음 차례인 sequence가 중요한데, Right에 대하여 sequence는 of인자를 받음에도 불구하고 그 인자를 구현에서 무시한다는 것을 기억해야한다. Right의 sequence는 $value에 대하여 map(Either.of)이므로, Identity.of('stuff').map(Either.of)와 같다. 이 때문에 Right가 다시 한번 만들어지게 되고, map은 자신의 타입으로 감싸 반환하므로 Identity(Right('stuff'))가 결과물이 되는 것이다.

#### Composition
아래 코드에서 등장하는 Compose.of라는 것을 이해하기 위해선 다음의 링크를 참고하자. 또 다른 algebraic structure일 뿐이니 걱정하지 않아도 된다: https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/appendix_b.md
아래의 코드는 의사코드라고 생각하는 편이 적절하다. 물론 첨부한 링크의 createCompose가 F,G를 모두 수집하고 실행된 이후라고 생각해도 되지만, 아래의 Compose.of는 단지 Compose객체가 생성되었다는 것만을 표시하기 위한 것이기 때문이다.
sequence에 도달했을때 sequence가 호출되는 펑터는는 Identity이므로 Identity의 sequence와 traverse가 어떻게 구현되었는지도 살펴봐야한다. 마찬가지로 첨부한 링크에 Identity의 세부 구현도 나와있으니 꼭 참고하여 해석을 위해 노력해도록 하자.

**!중요!**

*아래의 예제는 https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch12.md 에서 발췌한 것이지만, 원본의 comp1의 예제는 올바르지 않은 형식으로, open issue 상태이다. issue는 https://github.com/MostlyAdequate/mostly-adequate-guide/issues/555 에서 확인할 수 있으며, 원본의 형식은 차용했지만 필자가 임의로 comp1을 수정한 예제로 대체한다.*
```js
const comp1 = compose(map(map(sequence(Compose.of))), map(sequence(Compose.of)), Compose.of);
const comp2 = (Fof, Gof) => compose(Compose.of, map(sequence(Gof)), sequence(Fof));

comp1(Identity(Right([true])));
// Compose(Right([Identity(true)]))

comp2(Either.of, Array)(Identity(Right([true])));
// Compose(Right([Identity(true)]))
```
해석은 각 function에 '도달했을 때'라고 이해하면 된다.

일단 comp1부터 자세히 들여다보자.
1. Compose.of: Compose(Identity(Right([true])))
2. map(sequence(Compose.of)): Compose(Right(Identity([true])))
3. map(map(sequence(Compose.of))): Compose(Right([Identity(true)]))

comp2는 다음과 같다.
1. sequence: Right(Identity([true]))
2. map(sequence(Gof)): Right(Identity([true])).map(sequence(Array)) -> Right(Identity([true]).sequence(Array)) -> Right([true].map(Identity.of)) -> Right([Identity(true)])
3. Compose.of: Compose(Right([Identity(true)]))

#### Naturality
```js
t(u.traverse(F, id)) === u.traverse(G, t)
```
어떤 functor에 대하여 traverse를 작성했다면 위의 법칙이 성립해야 함을 의미하는 것으로, 각 객체마다 traverse의 구현은 매우 상이므로 한 가지 형태가 존재한다고 오해해선 안된다.

여기서 traverse의 시그니처를 살펴볼 필요가 있다:  
Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
```ts
traverse(A: Applicative, f: Function):Applicative {...}
```
주의할 점은, A는 반드시 Applicative한 functor여야 한다는 것이고 f는 A의 타입 functor를 반환해야한다는 것이다. 또 한, traverse의 반환 값도 A타입이어야 한다.

이를 바탕으로 규칙을 해석해보자.
일단 F혹은 G는 반드시 Applicative여야하고, id와 t는 F혹은 G가 반환하는 Applicative를 반환해야 한다. 그렇다면 직관적으로 이해가 된다!

즉, naturality는 규칙을 충실히 따랐다면 성립하지 않는 것이 불가능하게 되는 것이다(traverse와 t가 반환하는 타입이 같으니까).

예제를 살펴보자. 위에서 살펴본 스펙에 맞추어 이해가 가능하므로 설명은 생략하도록 하겠다.
```js
const natLaw1 = (of, nt) => compose(nt, sequence(of)); // t(u.traverse(F, id))
const natLaw2 = (of, nt) => compose(sequence(of), map(nt)); // u.traverse(G, t)

// maybeToEither :: Maybe a -> Either () a
const maybeToEither = x => (x.$value ? new Right(x.$value) : new Left());

natLaw1(Maybe.of, maybeToEither)(Identity.of(Maybe.of('barlow one')))
// Right(Identity('barlow one'))

===

natLaw2(Either.of, maybeToEither)(Identity.of(Maybe.of('barlow one')))
// Right(Identity('barlow one'))
```

## 그래서 Traversable이 뭔데요?
장황하게도 적었지만 한 마디로 표현하기가 어렵다. sequence와 traverse, 특히 traverse가 구현된 functor면 Traversable이라고 부른다. sequence는 중첩된 계층을 역전시키는 역할을 하고, traverse는 말하자면 sequence + map을 함께 수행하는 역할이다. 
지금껏 살펴본 것처럼 traverse를 이용해서 sequence를 만들어도 좋고, sequence를 이용해서 traverse를 만들어도 된다. 정해진 것은 없다.
# Monoid
정확히 따지자면 monoid는 monad전에 등장했어야 한다. 모나드의 정의가 모노이드에 의존하고 있기 때문이다. 함수형 프로그래밍에서, 함수 합성은 모노이드의 형태를 띈다. 물론 인자 및 반환타입에 신경쓸 수 밖에 없기 때문에 엄밀히 말해 모노이드가 아니지만, 그렇게 할 수 있다는 것이다.

**모나드는 내부 함자 범주의 모노이드 대상이다(monad is a monoid in the category of endofunctors. ~~What is the problem?~~).** 여담으로 보통 philip wadler(one of Haskell founders)가 했다고 알고 있는 이말은, 사실 james iry라는 사람이 쓴 글(Brief, Incomplete and Mostly Wrong History of Programming Languages)에서 마치 와들러가 말 한 것처럼 와전되어서 전해진 것이다. 

이번엔 모노이드를 조금 더 자세히 살펴보고 위의 정의를 파헤쳐보도록 하겠다.
**모노이드는 항등원을 갖는, 결합 법칙을 따르는 이항 연산을 갖춘 대수 구조이다.**
지루한 법칙 검증을 제대로 이해하기 위해 항등원의 정의도 짚고 넘어가자. **집합 S와 S에 대하여 닫힌 이항연산 · 즉, magma(이항연산을 갖춘 집합을 의미. S, ·)가 있을 때, S의 모든 원소 a에 대하여 좌항등원(eL)과 우항등원(eR)이 같다면 e를 두고 항등원이라 한다. 즉, 다음 세 가지가 모두 만족되어야 한다. 1) eL * a = a, 2) a * eR = a, 3) eL = eR = e .** eL을 left identity element, eR을 right identity element, e를 identity element라고 부른 것을 볼 수 있는데, 결국 지금까지 검증했던 left right identity들은 이것들이 monoid인지를 검사하고자 했던 것임을 알 수 있다. 

그런데 모노이드를 설명하자면 반군(semigroup)을 설명하지 않을 수 없다. 이들의 포함관계 때문이다.
**반군은 결합법칙을 따르는 하나의 이항 연산이 부여된 대수 구조이다.** ·:S x S → S가 결합법칙을 만족하는 이항연산이라는 설명이 따라 붙게 되는데, S는 Set이지만 일단 type으로 이해하여도 문제가 없다. 같은 타입을 사용한 이항연산이 같은 타입을 반환한다는 것으로, 'S는 연산·에 대하여 닫혀있다'이다. 결합법칙은 지금껏 계속 살펴보았지만 정의를 짚고 넘어가자면 **한 식에서 연산이 두 번 이상 연속될 때, 앞 쪽의 연산을 먼저 계산한 값과 뒤 쪽의 연산을 먼저 계산할 결과가 항상 같음**을 의미한다.
참고로 ·는 cdot이라는 기호인데 function을 의미한다.

즉, semigroup은 monoid를 포함한다. 하나의 조건(항등원이 존재할 것)이 추가되었기 때문이다:

마그마와 반군과 모노이드 군은 순서대로 진부분집합 관계이다. 이를 표현하면 다음과 같다: 마그마 ⊋ 반군 ⊋ 모노이드 <- 이 포함관계를 잘 기억하고 있자.

![Algebraic_structures](https://user-images.githubusercontent.com/78771384/178227778-2dd9b916-df1c-4672-a3b3-cdb642d1dc18.png)

수학적 정의는 이쯤 해두고 프로그래밍적으로 이런 개념들이 어떻게 적용되는지 살펴보자.
먼저 semigroup이다.

semigroup에는 concat이라는 ·:S x S → S를 만족하는 이항연산이 자리할 것이다. 숫자를 예로 들어보자
```js
const Sum = x => ({
  x,
  concat: other => Sum(x + other.x)
})
```
semigroup 자체는 pointed도 아니고 functor도 아니다. 그러니 map도 필요없다. map이 필요없는 이유도 직관적이다. semigroup은 transform 시켜선 안되니 map이 존재해야할 이유가 없다.

위의 예에서 주목할 만한점은 Sum함수가 계속 반환 객체를 재생산 할 수 있다는 점이다.

이런 구현은 Sum뿐 아니라 곱하기, 최솟값, 최댓값 등에도 모두 구현할 수 있다.
```js
const Product = x => ({ x, concat: other => Product(x * other.x) })

const Min = x => ({ x, concat: other => Min(x < other.x ? x : other.x) })

const Max = x => ({ x, concat: other => Max(x > other.x ? x : other.x) })
```
아니면 숫자에서 벗어날 수도 있다. 함수의 구체적 구현은 제시하지 않도록 하겠다.
```js
Any(false).concat(Any(true)) // Any(true)
Any(false).concat(Any(false)) // Any(false)

All(false).concat(All(true)) // All(false)
All(true).concat(All(true)) // All(true)

[1,2].concat([3,4]) // [1,2,3,4]

"miracle grow".concat("n") // miracle grown"

Map({day: 'night'}).concat(Map({white: 'nikes'})) // Map({day: 'night', white: 'nikes'})
```
concat을 좀 더 쓸모있게 사용해보자. 지금까지 다루었던 functor에 concat을 추가 시키는 것은 어떨까?
```js
Identity.prototype.concat = function(other) {
  return new Identity(this.__value.concat(other.__value))
}

Identity.of(Sum(4)).concat(Identity.of(Sum(1))) // Identity(Sum(5))
Identity.of(4).concat(Identity.of(1)) // TypeError: this.__value.concat is not a function
```
놀라운 가능성이 엿보인다. 우리가 어떤 연산이던 concat이라는 메서드를 정의해두면 위의 인터페이스로 무엇이던지 처리할 수 있을 것이다. 단지 인자를 semigroup으로 넘긴다는 것 으로 말이다. 당연히 Identity 뿐 아니라 다른 functor들에도 concat만 정의한다면 사용할 수 있다. 이런 방식은 array에도 추가구현 없이 그대로 사용가능하다는 점이 특히 더 유용하게 느껴진다.

좀 더 쓸모가 느껴지는 연산으로 바꿔보자
```js
serverA.get('/friends').concat(serverB.get('/friends')) 
// Task([friend1, friend2])

// loadSetting :: String -> Task Error (Maybe (Map String Boolean))
loadSetting('email').concat(loadSetting('general')) // Task(Maybe(Map({backgroundColor: true, autoSave: false})))
```
이런 식으로 원하는 결과 값을 합치기가 아주 간편해진다. 물론 number와 array를 concat하는 것은 불가능하다. 애초에 semigroup의 조건에서 벗어나니 말이다.
그런데 우리가 S를 정의하면 어떻게 될까? 현실성이 없는 예이긴 하지만 number와 array가 하나로 추상화된다면 semigroup화 될 수 있다.

concat을 보면서 chain을 해주거나 ap처럼 처리해도 될 것이라고 생각할 수 있는데, concat의 목적은 말 그대로 combination이기 때문에 훨씬 간결하게 접근하는 것이 올바르다는 것을 기억하기를 바란다. combine의 의미를 단지 더 하기, 쌓기 정도로 접근하는 것은 바르지 않다. 말 그대로 combine되어 같은 S가 나오기만 하면 될 뿐이다. 

semigroup에 대한 이해는 이 정도면 충분하다. monoid를 살펴보도록 하자.
앞서 언급했듯이, monoid는 semigroup에서 항등원을 추가하여 획득할 수 있다.

와닿을 수 있는 실례를 들어보자. monoid는 자바스크립트에서 흔하게 찾아볼 수 있는데, number addition, string concatenation등이 그렇다. 예를 들어보자.
```js
// number
1 + 1 === 2 // magma
(1 + 2) + 3 === 1 + (2 + 3) // associativity
1 + 0 === 0 + 1 === 1 // 0은 neutral value
``` 
string도 마찬가지이다. string의 neutral value는 빈 문자열("")이며 세 가지 조건을 모두 만족한다.neutral, empty, identity등의 용어는 상관없다.

이런 항등원들을 다음과 같이 정의해두는 것도 방법이다.
```js
Array.empty = () => []
String.empty = () => ""
Sum.empty = () => Sum(0)
Product.empty = () => Product(1)
Min.empty = () => Min(Infinity)
Max.empty = () => Max(-Infinity)
All.empty = () => All(true)
Any.empty = () => Any(false)
```

그래서 monoid가 언제 쓸모가 있는가? monoid의 특성은 사실 매일같이 reduce와 함께 강력한 힘을 발휘하고 있다.
```js
reduce(concat, neutral_value)
```
concat은 monoid이고, monoid는 magma, associative하니, reduce의 결과도 또한 마찬가지 일 것을 알 수 있다. 또한 reduce의 시작은 neutral value로 처리할 수 있다.

associative가 주는 장점은 하나 더 있는데, 연산을 분리할 수 있다는 것이다. number를 예로 들어보자.
```js
const add = (x, y) => x + y;
add(reduce(add, 0)([1,2,3,4,5]), reduce(add, 0)([6,7,8,9,10])) ===
reduce(add, 0)([1,2,3,4,5,6,7,8,9,10])
```
보이는 것과 같이 범위를 나워서 계산한 결과를 또 다시 concat하는 것과 전체를 한번에 concat하는 것은 차이가 없으므로, 필요한 만큼 연산을 나눠 진행할 수 있다.

### fold로 유연한 연산하기
일단 semigroup만 떠올려 연산을 한다고 가정해보자. 가령,
```js
[].reduce(fn) // Error! empty array with no initial value
```
과 같은 상황이 발생할 것이다. 그러나 우리는 항등원의 존재로 reduce를 안전하게 수행할 수 있음을 위에서 이미 살펴보았다. 이 개념을 통해 fold를 정의해보자.
```js
// fold :: Monoid m => m -> [m] -> m
const fold = reduce(concat)
```
reduce는 arity 3인 함수이므로 initial value와 target(js적으로 표현하면 this)을 주입하는 식으로 작성이가능하다.
예를 들어보자.
```js
const foldSum = fold(Sum.empty())
const foldAny = fold(Any.empty())
const foldEitherMax = fold(Either.of(Max.empty()))

foldSum([Sum(1), Sum(2)]) // Sum(3)
foldSum([]) // Sum(0) <- 더 이상 에러가 나지 않는다!

foldAny([Any(false), Any(true)]) // Any(true)
foldAny([]) // Any(false)

fold(Either.of(Max.empty()), [Right(Max(3)), Right(Max(21)), Right(Max(11))]) // Right(Max(21))
fold(Either.of(Max.empty()), [Right(Max(3)), Left('error retrieving value'), Right(Max(11))]) // Left('error retrieving value')
```
foldEitherMax가 직관적으로 느껴지지 않는다면 위의 Identity.prototype에서 concat을 지정하는 부분을 다시 읽고 학습하길 추천한다. 우리는 모든 S에 대하여 공통적인 interface를 사용하기 위하여 단순한 덧셈에도 concat이라는 메서드를 지정했음을 기억하자.

#### 그럼 그냥 monoid만 쓰면 안되나요?
monoid는 semigroup의 진부분집합임을 기억하자. 항등원이 존재하지 않는 경우도 쉽게 찾아볼 수 있다는 말이다. 예를 들어보자.
```js
const First = x => ({ x, concat: other => First(x) })

Map({id: First(123), isPaid: Any(true), points: Sum(13)}).concat(Map({id: First(2242), isPaid: Any(false), points: Sum(1)}))
// Map({id: First(123), isPaid: Any(true), points: Sum(14)})
```
위의 코드를 해석하자면 이렇다. First는 한 번 생성된 후로 값을 바꾸지 않는다. Map의 concat은 각 prop에 대하여 concat을 실행한다. 그 결과 First는 바뀌지 않았고, Any는 true가 하나라도 존재하니 true이고, Sum은 14가 되었다.

First에 대하여 empty value를 지정할 순 없다.

### 모나드를 깊게 이해하기 위한 모노이드의 이해
category theory에서 monoid로 판단하기 위해선 object M과 두 가지 사상이 필요한데, multiplication(μ:M ⊗ M → M)과 unit(η:I → M)이다. 이를 두고 카테고리에서 모노이드를 (M, μ, η)과 같이 표현한다. 

![화면 캡처 2022-07-13 013657](https://user-images.githubusercontent.com/78771384/178546397-d6bc7de6-868f-4fcb-8645-b6f28b0208e2.jpg)  
위의 다이어그램은 모나드를 이해하는데 핵심이 된다.

모나드의 정의를 다시 한번 떠올려보자: monoid in the category of endofuctors. 
endofunctors: C → C, C'→ C', ...가 있다. 이들 사이의 자연 변환들을 사상으로 하는 카테고리가 category of endofunctors이다. 또한 이 'category of endofunctors'는 모노이드 범주(monoidal category)인데, 이 때문에 우리는 '모노이드 대상'을 정의할 수 있다. 위 정의에서 'monoid'란 'monoid object'와 동의어인데, monoid object란 monoid와 같은 성질을 가진 object를 일컫는다. monoid object를 설명하기 위해, monoidal category에서 필요한 개념만 가져와서 설명하겠다.

monoidal category로 부터 출발할 필요는 없다. 모노이드 대상으로 부터 bottom-up으로 살펴보도록 하자. 먼저 monoidal category를 이루는 여러 요소 중에는 범주 C가 있다. 바로 이 C의 모노이드 대상이 우리의 타겟이다. monoid object는 (M, m, e)로 이루어진다. 핵심은 M, m, e 모두 C내부의 존재들이라는 것이다. 다시 말해, 범주 C가 모노이드 범주를 이루고 있는 요소일 때, C 내부의 M, m, e로 모노이드 대상을 정의한다는 것이다. M은 단지 C안의 대상일 뿐이니 크게 고려할 사항이 없다. m과 e는 사상인데, m(M ⊗ M → M)은 모노이드의 이항연산이고, e(I → M)는 모노이드의 항등원이다. 뜬금 없이 정의 되지 않은 I와 ⊗가 튀어나왔다! 바로 이 I와 ⊗가 monoidal category를 이루고 있는 요소들 중 일부이다. monoidal category의 정의에서 I란 "unit **object**" 또는 "identity **object**"이며 C에 속해 있다(I∈C). ⊗: C x C → C이다. 여기까지 살펴봤을 때, MC(C(M, I∈M, m, e), ⊗)임을 알 수 있다. category of endofunctors는 monoidal category에 속하기 때문에 M, m, e도 마찬가지로 존재하며, Monoid(M, m, e)가 바로 모나드인 것이다. 더 자세히 말하면 M들은 모두 endofunctors(fp에서 모든 functor는 endofunctor. map했을때 functor들이 항상 자신을 반환하는 것을 기억하자)이고, m은 위에서 살펴본 multiplication 즉, chain(혹은 flatMap)이며, e는 unit(I가 존재하니 성립)이다.

지금까지 **모나드는 내부 함자 범주의 모노이드 대상이다** 라는 말의 의미를 살펴보았다.

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

## Apply
Apply는 Functor다. Monad도 Functor다. 지겹게 들어봤을 법한 말들이다. 그렇다면 차이는 무엇인가? 왜 필요한가? 직관적으로 알아보자. 정확히 말해서, Apply는 Functor의 요구사항에서 'ap'라는 메서드가 추가된 형태이다.

먼저 fantasy-land의 조건과 명세를 파악해보자
1. 조건: v['fantasy-land/ap'](u['fantasy-land/ap'](a['fantasy-land/map'](f => g => x => f(g(x))))) is equivalent to v['fantasy-land/ap'](u)['fantasy-land/ap'](a)

2. 명세: fantasy-land/ap :: Apply f => f a ~> f (a -> b) -> f b

제한 사항도 있다.
1. b는 함수여야한다.
2. b는 Apply여야한다.
3. a는 any value의 Apply여야한다.
4. ap메서드로 인해 반환된 Apply는 a,b와 같은 형태여야한다.
5. ap메서드는 Apply b의 function을 Apply a의 value에 적용해야 한다. 반환 값은 check되지 않아도 된다.
# lambda calculus & javascript
1. 람다 대수는 함수형 프로그래밍 언어를 구축하는 근간이 되었다.
2. 람다 대수는 튜링-완전하다.
3. 함수가 이름을 가질 필요는 없다. 예를 들어, 흔히들 표현하는 Identity에서 I(x) => x와 같은 형태로 표현하곤 하는데 이는 x => x와 정확히 같다.

abstraction, application 등을 wikipedia의 람다 대수 설명을 읽고 적용해보았습니다.

## 왜 Promise는 Functor or Monad or Applicative가 아닌가?

## Promise를 Functor로 확장하기
```ts
Promise.prototype.map = function <T1>(f: (v: any) => T1) {
 return new Promise<T1>((resolve, reject) => {
 this.then(x => resolve(f(x))).catch(reject);
 });
};
```
위와 같은 확장을 추가하면, 아래와 같은 형태의 연산이 가능해진다.

```ts
MockSomething
.methodReturningPromise()
.map(x => x.someProp)
.then(prop => prop.someMethod())
.catch(e => console.error(e))
```


