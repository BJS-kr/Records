/**
 * Question
 * Implement permutation type that transforms union types into the array that includes permutations of unions.
 */

// Answer

// 진짜 엄청나게 헤맨 문제... 너무 힘들었다
// 결론은 특이한 타입 문법을 잘 숙지하지 않으면 풀 수 없는 문제였다.
// 엄청난 해설을 남겨둔 깃헙 유저에게 감사하며 링크를 남긴다.
// https://github.com/type-challenges/type-challenges/issues/614

// 일단 union타입을 loop하는 법에 대해 알아야한다.
type Loop<T extends string> = T extends T ? `loop ${T}` : never;
type loop = Loop<'a' | 'b' | 'c'>; // "loop a" | "loop b" | "loop c"
// 이것 뿐일까? 언뜻 의미 없어 보이는 T extends T는 특별한 의미를 지닌다.
// 다음에서 T와 K를 눈 여겨 살펴보자
type Loop2<T, K = T> = T extends T ? [T, K] : never;
type loop2 = Loop2<'a' | 'b' | 'c'>;
// 위의 결과는 ["a", "a" | "b" | "c"] | ["b", "a" | "b" | "c"] | ["c", "a" | "b" | "c"] 이다.
// 무슨 차이인지 보이는가? T는 분배되었지만 K는 분배되지 않았다.
// T extends T를 K extends K로 바꿔보자
type Loop3<T, K = T> = K extends K ? [T, K] : never;
type loop3 = Loop3<'a' | 'b' | 'c'>;
// 결과가 완전히 바뀌었다.
// ["a" | "b" | "c", "a"] | ["a" | "b" | "c", "b"] | ["a" | "b" | "c", "c"]
// 즉 T는 분배되지 않았고, K만 분배되었다.

// 이뿐이 아니다. never는 distributive extends 로 검증할 수 없다. 예를 들어보자
type ExtendsNever1<T> = T extends never ? true : false;
type extendsNever1 = ExtendsNever1<never>; // never
// true도 false도 아닌 never가 튀어나왔다. never는 검증할 수 없는 것일까?
// distributive type을 avoid하면 never도 검증할 수 있다.
// 정확히는 square bracket을 씌우면 가능하다. 이를 배열을 표현한 것으로 오해하면 안된다.
type ExtendsNever2<T> = [T] extends [never] ? true : false;
type extendsNever2 = ExtendsNever2<never>; // true
// 보너스로 distributive type이 무엇인지도 살펴보자
type CheckDistributive<T> = T extends any ? T[] : never;
type checkDistributive = CheckDistributive<string | number>; // string[] | number[]
// 타입이 T[]로 분배되어 새로운 유니온이 탄생했다. 이를 방지하려면 square bracket기법을 그대로 사용하면 된다.
type AvoidDistributive<T> = [T] extends [any] ? T[] : never;
type avoidDistributive = AvoidDistributive<string | number>; // (string | number)[]
// 타입이 분배되지 않고 T그대로 T[]타입이 된 것을 확인할 수 있다.

// 자, 지금까지 배운 내용을 종합해서 문제를 풀어보자! 기억해야할 내용을 요약하면 다음과 같다.
// T가 never일 경우, square bracket으로 검증이 가능하다.
// T extends T를 통해 T가 하나씩 분배된다. K는 분배되지 않는다.
// Exclude<K, T>가 never가 될 때까지 재귀적으로 타입을 계산한다는 의미이다.
// 재귀의 첫 부분만 파고 들어보자.
// 일단 아래의 [T, ...Permutation<Exclude<K, T>>]가 T의 분배로 인해 union이 되었음은 자명하다.
// ['A', ...Permutation<Exclude<'A' | 'B' | 'C', 'A'>>] | ['B', ...Permutation<Exclude<'A' | 'B' | 'C', 'B'>>] | ['C', ...Permutation<Exclude<'A' | 'B' | 'C', 'C'>>]
// -> Exclude('A'의 경우만 살펴보자)
// ['A', ...Permutation<'B'|'C'>]
// -> 재귀
// ['A', ...['B', Permutation<Exclude<'B'|'C', 'B'>>] | ['C', Permutation<Exclude<'B'|'C', 'C'>>]]
// -> 다음 단계의 재귀는 최소범위를 반환(['C', []], ['B', []])
// 최상단의 결과 외에는 모든 재귀가 spread되고 있으므로 최상단 결과 외의 모든 배열 깊이는 flat하게 됨
// 마지막으로, 결과가 6개가 되는 이유까지 확실히 짚고 넘어가도록 하자
// 아래의 예시는 Permutation 타입의 최상단에서 일어나는 일과 완전히 같다.
type DistributeInArray<T, A, U> = [T, ...([A] | [U])];
type distributeInArray = DistributeInArray<boolean, string, number>; // [boolean, string] | [boolean, number]
// 분배되어 union이 되었다. 아래의 Permutation에서 T는 세가지 타입의 union이지만 결과가 6개가 되는 이유이다.

type Permutation<T, K = T> = [T] extends [never]
  ? []
  : T extends T
  ? [T, ...Permutation<Exclude<K, T>>]
  : never;
type perm = Permutation<'A' | 'B' | 'C'>;
