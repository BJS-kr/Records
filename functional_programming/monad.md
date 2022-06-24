**부족한 제 자신이 조금이라도 이해하기 위해 작성하는 글이니 신랄한 비판과 가르침 언제든지 대환영입니다!!!**

# Monad
모나드. 처음에는 정상과 오류가 하나로 추상화된 형태정도로 생각했다. 그 다음에는 함수 합성을 위해 모든 결과값을 하나로 추상화하는 것으로 생각했다. 그 다음에는 혼란에 빠져들었다. Ramda, FantasyLand, PureScript등의 모나드 정의를 읽어봐도 읽으면 읽을 수록 정의하기가 모호해졌다. 프로그래밍 세계에서의 모나드와 수학에서의 모나드는 그 범위가 상당히 차이가 나는 것 같았다. 요즘들어 알게 된 것은 모나드의 종류가 꽤나 다양하다는 것이고, 그 다양한 형태들이 합쳐져 새로운 형태를 이루기도 한다는 것이다. 그리고 모나드를 이해하기 위해선 하위 혹은 관련 개념들도 알아야하는데 대표적으로 이항연산, functor, monoid, lamda calculus, 카테고리 이론, kleisli composition 등이 있는 것 같았다.

지금도 이해 수준이 바닥이지만 한번 최대한 의미에 집중하여 풀어가보려고 한다.
먼저 자주 발견되는 용어들부터 정리해야할 필요성을 느낀다.

# 카테고리 이론 for functional programming
Category, Functor, Monad등의 개념들은 원래 카테고리 이론에서 정의된것이다.
## Category
카테고리는 object들과 그들의 관계를 표현하는 대수학적 구조를 일컫는다. 예를 들어, 카테고리 C는 objects의 집합인 ob(C)와 화살표/사상(morphism)들의 집합인 hom(c)로 구성된다. 다른 말로 해서, 모든 화살표 f는 f가 잇는 [a,b]의 pair로 정의할 수 있다. 이것을 f: a → b 로 표현한다.

또 한, 카테고리는 화살표끼리의 합성도 정의한다. 예를 들어, f: a → b와 g:b → c의 합성은 g ∘ f로 표현되고, 이는 최종적으로 g ∘ f: a → c이다.

objects와 arrows는 특정 조건을 만족해야 카테고리로 평가된다. 다음과 같다.
* 모든 화살표에 대하여 h ∘ (g ∘ f) = (h ∘ g) ∘ f가 성립할 때
* 모든 object인 a는 자신을 가리키는(i(a): a → a) identity arrow인 i(a)를 가질 것
* 모든 identities는 모든 f: a → b 에 대하여 i(b) ∘ f = f = f ∘ i(a)임이 명백할 것. 다르게 말해, identities는 합성에 대하여 중립적(영향을 끼치지 않음)일 것

아래는 4개의 objects의 카테고리이다.
![category](https://nikgrozev.com/images/blog/Functional%20Programming%20and%20Category%20Theory%20Part%201%20-%20Categories%20and%20Functors/category.jpg)


# Functor
함수형 프로그래밍에서 functor란 카테고리 이론에서 영감을 얻은 디자인 패턴이다. Generic type의 구조를 바꾸지 않고 generic type 내부에 function을 적용할 수 있게 한다(이해 못함).
functor는 연산 전에 functional effects를 모델링하는데 매우 유용하다. Functor는 Applicative, Monad, Comonad등 더 복잡한 추상화의 바탕이 된다.


