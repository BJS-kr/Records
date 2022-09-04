/**
 * Variance(변성)
 * 타입 언어에서 variance가 중요한 이유는 Generic한 타입을 작성함에 있어서 type-safe한 코드를 작성하는 역량의 근간이 되기 때문이다.
 * 먼저 variance란, type hierachy에서 타입간의 관계가 어떠한지를 나타내는 개념이다.
 * T와 T'간의 관계? 어디선가 들어본 적이 있다. 바로 SOLID의 L, Liskov's Substitution principle이다.
 *
 * 또, supertype과 subtype도 제대로 짚고 넘어가도록 하자.
 * 어떤 타입 간의 관계가, supertype과 subtype은 언제나 고정되어 있는 것이 아니다.
 * 자세한 내용은 아래의 공변성과 반공변성을 살펴보며 설명하겠지만
 * 일단은 subtype은 supertype이 사용되는 곳에 그대로 사용이 가능해야 함만 기억하면 된다.
 *
 * 본격적으로 시작하기 전에 invariance만 짚고 넘어가도록 하자.
 * invariance란 type간에 variance가 없음을 뜻하는데, 이게 무슨 말일까?
 * 예를 들어, A의 subtype A'가 있다고 가정하자.
 * 그리고 generic function type인 T::(T) -> T가 존재한다고 가정하자
 * A'가 A의 subtype이라고 해서, A' -> A 함수 타입은 A -> A 함수 타입의 subtype일까?
 *
 * 답은 아니다 이다.
 *
 * parameter는 contravariant하고, return value는 covariant하기 때문이다. type cast가 불가능한것이다.
 */

/**
 * 어떻게 보면 황당하다고 느껴지는 부분은
 * TS는 사실 bivariant한 parameter를 사용한다는 것이다(https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant)
 * bivariant한 parameter는 당연하게도 느슨한 구현이다. type-safe하지 않다는 것이다.
 * 이를 해결하기 위해 strictFunctionsTypes 컴파일러 옵션을 활용핧 수 있으나, bivariant하게 작성된 수많은 기존 구현과의 충돌이 불가피할 것이기에
 * 노가다를 추가로 하던지, ts-ignore를 쓰던지, 자신이 작성하는 것만 제대로 작성하던지를 해야한다.
 *
 * 아래의 예시에서는 최종적으로 supertype과 subtype으로 어떻게 type-safe한 variance를 가진 함수를 작성할 수 있을지를 이해하는 것을 목표로 하겠다.
 */

// A_ <: A
// A_는 A의 서브타입이다. A를 대체할 수 있기 때문이다.
// A는 A_의 슈퍼타입이다. A_를 대체할 수 없기 때문이다.
type A = { a: number };
type A_ = { a: number; b: number };

const obj_a = { a: 1 };
const obj_ab = { a: 1, b: 2 };

const a: A = obj_ab; // OK
const a_: A_ = obj_a; // Error -> Property b is missing

/**
 * 위에서 covariant한 상황에서 super - sub 관계가 정해지는 것을 살펴보았다.
 * 상술했듯이, super - sub관계는 일정한 것이 아니다.
 * 똑같은 type을 활용하여 contravariant한 상황을 살펴보겠다.
 */
type Fa = (arg: A) => void;
type Fa_ = (arg: A_) => void;

/**
 * Error -> parameter subtype은 parameter type에 할당 될 수 없다.
 * -> a 인자만 처리하는 함수 타입에 a,b를 처리하는 함수를 할당할 수 없다.
 */
const f1: Fa = (arg: A_) => {};

/**
 * OK -> parameter type은 parameter subtype에 할당 된다.
 * -> a,b 인자를 처리하는 함수 타입에 a만 처리하는 함수를 할당할 수 있다.
 * 그 이유는, a,b인자를 처리하는 함수 타입의 추상성을 생각해보았을때, a를 처리하는 모든 구체적인 함수 구현을 포괄하기 때문이다.
 * 당연하게도 그 반대(a를 처리하는 함수 타입은 a,b를 처리하는 함수 구현을 포괄)는 성립하지 않는다.
 */
const f2: Fa_ = (arg: A) => {};

/**
 * 위의 함수 타입 예시로 보았듯이, parameter에서는 contravariant한 variance가 적용되고 있다.
 * 즉, A가 A_의 subtype으로 역전된 것이다.
 * 한 줄로 정리하자면, Fa <: Fa_가 된 것이다!
 * 또 하나 주목해볼만한 점은, 함수 타입에 void return은 상관이 없었다.
 * 이는 subtype과 supertype의 교집합은 자기 자신도 포함 된다는 것을 시사한다.
 *
 * 그래서 이게 뭐가 중요하다는 것일까?
 * 지금부터 위에서 살펴본 두 가지 요소를 결합해보겠다
 * 값과 인자를 결합하려면, [(인자) -> 반환 값] 의 함수 타입으로 살펴보면 될 것이다.
 * 위의 공변적, 반공변적 상황을 고려한 함수 타입을 작성해보자
 */
type F<T> = (arg: T) => T;

/**
 * 이제 Supertype A와 Subtype B가 존재한다고 가정해보자(B <: A)
 * B가 Subtype이라고 해서 F<B> <: F<A>일까?
 * 아니다. 위에서 살펴본 공변성과 반공변성이 동시에 적용되는 상황이 일어나기 때문이다.
 * 반환 값에는 공변성이 적용되고, 인자에는 반공변성이 적용되고 있어, 함수 타입끼리 Subtype이 되지 못하는 것이다.
 *
 * 아직도 와닿지 않을 수 있을 것이다.
 * 다시 한번 리스코프 치환원칙을 떠올려보자.
 * T가 T'로 대체 되었을 때도 정상동작이 가능해야한다.
 * T가 함수일 때, T'함수가 T의 서브 타입이려면 '인자'와 '반환값'이 모두 서브타입이어야 한다.
 * 그렇다면 어떤 T'를
 * "안전하게" 정의할 수 있어야하기 때문에 중요하다는 것이다
 *
 * 자, 마지막으로 정리해보자.
 * 어떤 함수 타입의 서브 타입이 되려면?
 * T는 T'에 대하여 ->
 * 1. 인자는 contravariant supertype이어야 하고,
 * 2. 반환값은 covariant한 supertype이어야 한다!
 */

// 이렇게까지 고찰해야할 필요성을 느끼지 못할 수도 있다.
// 왜일까? 기본적으로 IDE나 언어의 성능이 뛰어나기 때문이다.
// 컴파일되지 않도록 에러를 표시한다는 것이다.
// IDE가 정보를 시각적으로 전달함은 말할 것도 없다.
// 그러나 기본적으로 이러한 개념들은 '코드'자체로 바라 보며 고려해볼 핊요가 있다. 언어나 IDE의 도움이 없는 환경, 코드라는 문자열 자체로서 말이다.
// 컴파일 되지 않는다고 해도 왜 컴파일 되지 않는 지를 알아야함은 물론이다.
// 더구나, TS가 기본적으로 bivariant한 것처럼 언어 기능이 훌륭하지 않을 수도 있고 모든 contravariant를 잡아낼 수 있는 것도 아니다.
// kotlin처럼 공변성과 반공변성까지 조절할 수 있는 언어라면 모르겠지만 말이다.

// 이제 설명한 개념들을 한데 모은 예시를 작성해보자.
// 지금까지 설명했듯, 어떤 함수 타입에 대하여 subtype으로 대체하는 식으로 진행된다.
type Mammal = { breastfeed: true };
type Human = Mammal & { bipedal: true };
type Mongolian = Human & { skin: 'yellow' };
type African = Human & { skin: 'black' };

type GenericFunction<T> = (arg: T) => T;
type HmHm = GenericFunction<Human>;

// test_1: Ok! super-sub는 자신을 포함한다는 것을 기억하고 있을 것이다.
const test_1: HmHm = (arg: Human) => ({} as Human);
// test_2: Error! African은 parameter에서 Human의 subtype이 아니기 때문이다.
// test_2가 에러가 나지 않는다면 tsconfig의 설정 값에서 strictFunctionsType이 false로 지정되어 있을 것이다.
const test_2: HmHm = (arg: African) => ({} as Human);
// test_3: Ok! Mongolian은 return value에서 Human의 subtype이기 때문이다.
const test_3: HmHm = (arg: Human) => ({} as Mongolian);
// test_4: Error! Mammal은 return value에서 Human의 subtype이 아니다
const test_4: HmHm = (arg: Mammal) => ({} as Mammal);
// test_5: Ok! Mammal은 parameter에서 Human의 subtype이고, Mongolian은 return value에서 Human의 subtype이다
const test_5: HmHm = (arg: Mammal) => ({} as Mongolian);

// 모든 설명의 결론이 test_5에 녹아있다. 함수의 서브타입을 표현한 것이다.
// 지금까지 잘 이해했다면 사실상 test_1은 간접적으로 test_5를 표현한다는 것을 알 수 있다.

// TS가 모든 것을 잡아내지 못하므로 개발자가 이를 이해하고 코드를 짜야한다는 것이 무슨 말인지 알아보자
type HigherOrderFunction = (f: HmHm) => void;
// higher_1: Ok!...Ok...? 아니다 에러가 나야한다!
// 이는 contravariance나 strictFunctionsType과도 관계 없는 TS자체의 기능 부재다.
// 이러한 현상은 함수 타입 내부에 parameter가 함수일 때, 그 타입을 단순한 값처럼 평가해버리는데서 기인한다.
const higher_1: HigherOrderFunction = (f: (arg: Mongolian) => Human) => {};
// higher_2: Error...? 맞는 구현인데?
// 이건 더 황당하다. 올바른 구현에 TS가 에러를 표시하는 실수를 저지르고 있다.
const higher_2: HigherOrderFunction = (f: (arg: Mammal) => Human) => {};

// 위와 같은 현상을 해결하려면 함수 타입이 평가되는 부분을 분리해야한다
// Generic을 적극적으로 활용해보자
type FixedHigherOrderFunction<F extends HmHm> = (f: F) => void;

// 당연하게도 원래의 HigherOrderFunction 타입과 Fixed 타입은 사실상 같다!
// 단지 타입 파라미터를 받는 형식으로 분리했을 뿐이다.
// 정말로 TS의 동작이 달라지는지 확인해보자. 구현부는 higher_1, higher_2와 완전히 같다.

// Error! 정상적으로 에러가 난다. Mongolian은 Human parameter에 적합하지 않기 때문이다
const fixed_1: FixedHigherOrderFunction<(arg: Mongolian) => Human> = (
  f: (arg: Mongolian) => Human
) => {};
// Ok! 지겹게 살펴본대로 에러가 나지 않는다. Generic하게 바꿨을 뿐인데 말이다.
const fixed_2: FixedHigherOrderFunction<(arg: Mammal) => African> = (
  f: (arg: Mammal) => Human
) => {};

// 마지막 예제로 살펴 보았듯, 직접 이해하지 않고 컴파일러가 알아서 해주길 기대하면
// 옳은 구현과 올바르지 않은 구현을 구분할 수 없고, 당연히 그걸 올바르게 고칠 수도 없다.
// 이토록 길게 variance를 살펴본 이유다.
