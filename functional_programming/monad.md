**부족한 제 자신이 조금이라도 이해하기 위해 작성하는 글이니 신랄한 비판과 가르침 언제든지 대환영입니다!!!**

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

Functor F의 변환이 A카테고리 내부에서 일어나게 되면 이를 endofunctor라고 부르며, F:A->A라고 할 수 있다.
즉, a ∈ ob(A) 일 때, F(a) ∈ ob(A)가 성립한다.

이 개념을 프로그래밍적으로 해석하면 어떻게 보일까?

먼저 type constructor라는 개념을 이해해보자. 핵심은 type constructor가 type을 parameter로 받는 generic type 이라는 사실이다. T라는 제네릭 파라미터를 본적이 있을텐데, T를 specify해야지 concrete type이 완성됨은 이미 이해하고 있을 것이다. 

사실, Functor라는 개념은 프로그래밍에선 훨씬 좁은 의미를 가진다. FP에서 모든 Functor는 그저 Hask내의 endofunctor에 지나지 않는다. 게다가, 각 Functor F는 type constructor TC[_]와 관련되어있다. Hask내의 각 타입 A는 TC[A]로 변환된다. 예를 들어, TC가 List라면 F:int → List[int]이다. 다른 말로 하면, type constructor는 unique하게 Hask objects의 매핑을 정의한다.

Functor를 정의하기 위해선 arrow 매핑도 정의해야 한다. arrows는 Hask에서 그저 함수일 뿐이다. 때문에 우리는 map: (A → B) → (TC[A] → TC[B])와 같은 시그니처를 가진 map함수가 필요하다(함수를 함수에 매핑하는 형태이다). 모든 arrow/function인 f:A->B는 또한 함수인 F(f):TR[A] → TC[B] projection/mapping을 반환한다.

요약하자면, FP의 Functor는 type constructor인 TC[_]와 상술한 시그니쳐를 가진 map함수에 의해 uniquely defined된다. 아래의 그림은 type constructor가 List인 Functor를 표현한다.

![functor_in_fp](https://nikgrozev.com/images/blog/Functional%20Programming%20and%20Category%20Theory%20Part%201%20-%20Categories%20and%20Functors/haskfunctor1.jpg)

# Apply
Apply 또한 Functor의 하위개념이다. Fantasy Land 스펙 기준으로 설명하도록 하겠다. 

# lambda calculus & javascript
1. 람다 대수는 함수형 프로그래밍 언어를 구축하는 근간이 되었다.
2. 람다 대수는 튜링-완전하다.
3. 함수가 이름을 가질 필요는 없다. 예를 들어, 흔히들 표현하는 Identity에서 I(x) => x와 같은 형태로 표현하곤 하는데 이는 x => x와 정확히 같다.

abstraction, application 등을 wikipedia의 람다 대수 설명을 읽고 적용해보았습니다.

## 왜 Promise는 Functor or Monad or Applicative가 아닌가?


