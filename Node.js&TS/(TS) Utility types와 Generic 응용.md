# TL;DR
하단은 이 글에서 설명할 타입들과 타입을 지정한 예시입니다.
```typescript
interface Object {
  stringMember?: string;
  numberMember: number;
};

type Require<T> = {[K in keyof T]: T[K]};
type Partial<T> = {[K in keyof T]?: T[K]};
type Pick<T, K extends keyof T> = {[P in K]: T[P]};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends string | number | symbol> = {[P in Exclude<keyof T, K>]: T[P]};
type ExcludeSpecificType1<T, S> = {[K in keyof T]:T[K] extends S ? never : K }[keyof T];
type ExcludeSpecificType2<T, S> = {[K in keyof T as T[K] extends S ? never : K]: T[K]};

var a:Require<Object> = { numberMember: 1}; // Error! missing property: stringMemeber
var b:Partial<Object> = {}; // OK
var c:Pick<Object, 'stringMember'> = {}; // OK
var d:Pick<Object, 'numberMember'> = {}; // Error! missing property: numberMember
var e:Exclude<keyof Object, 'stringMember'> = ''; // Error! not assignable to '"numberMember"'
var f:Exclude<keyof Object, 'numberMember'> = 'stringMember'; // OK
var g:Omit<Object, 'stringMember'> = { numberMember: 1 }; // OK
var h:Omit<Object, 'numberMember'> = {} // Error! missing property: stringMember

/**
* Pick<T, ExcludeSpecificType1<T, S>>와 ExcludeSpecificType2<T, S>는 완전히 같습니다. 
* ExcludeSpecificType2의 예시들은 ExcludeSpecificType1에 모두 동일하게 적용할 수 있습니다.
*/

var i:Pick<Object, ExcludeSpecificType1<Object, string>> = { numberMember: 1 }; // Error! Type 'undefined' is not assignable
/**
* 분명 string 타입의 key는 제외시켰는데 왜 에러일까요?
* key가 optional일경우 undefined와 union type이 됩니다. Pick type의 keyof constraint를 만족시키지 못하게 됩니다.
* 에러가 나지 않도록 하려면 모든 key에서 optional이 제거되어야 합니다. 아래와 같습니다.
*/ 
var j:Pick<Object, ExcludeSpecificType1<Require<Object>, string>> = { numberMember: 1}; // OK
var k:ExcludeSpecificType2<Object, string> = { numberMember: 1}; // OK
var l:ExcludeSpecificType2<Object, number> = {}; // OK. Pick type을 사용하지 않았기 때문에 optional key가 그대로 적용 됩니다
var m:ExcludeSpecificType2<Object, string> = { numberMember: 1, stringMember: '' }; // OK

/**
* 왜 m이 에러가 아닐까요?
* stringMember는 optional이기 때문에 자동으로 undefined와 union입니다. 그렇기 때문에 extends 가 true로 판명되지 않은 것입니다.
*
* 이를 해결하는 방법은 몇 가지가 있습니다.
* 1. 모든 key를 require로 만든다.
* 2. k의 타입을 ExcludeSpecificType2<Object, string|undefined>로 수정한다.
* 3. ExcludeSpecificType2의 구현부에서 ...extends S를 extends S|undefined로 수정한다.
* 
* 가장 범용적으로 편하게 쓸 수 있는 방법은 3번 같지만, 상황에 맞춰 그때 그때 변경하면 될 것 같습니다.
* 특정 optional key만 제외시키고 싶은 상황이 생길 수도 있기 떄문입니다.
* / 


```

#### 하단의 간단한 인터페이스에서 출발해보겠습니다.
```typescript
interface Object {
  stringMember?: string; // Optional
  numberMember: number; // Required
};
```

# 하나씩 뜯어봅시다
****
## Require
```typescript
type Require<T> = {[K in keyof T]: T[K]};
var required:Require<Object> = {numberMember: 1}; // Error!
```
위는 유효한 코드가 아닙니다. stringMember가 필요하다는 메세지와 함께 컴파일 되지 않을 것입니다. stringMember는 optional인데, Require 제네릭 타입으로 required로 변경되었기 때문입니다.

먼저 T와 K를 살펴봅시다.  keyof는 대상의 key들의 union을 제공합니다. 예를 들어, T가 {a:string, b:number}라면 keyof T는 ‘a’|’b’가 될 것입니다. in은 무엇일까요? union에 대하여 indexed signature를 정의할 때 사용합니다. JS에서 index가 될 수 있는 존재는 세가지 입니다. string, number, symbol이 그것입니다. 그러므로 in 연산자는 string, number, symbol 단일 혹은 union에 대하여 사용 할 수 있습니다. 우리는 이미 keyof로 어떤 타입의 index를 가져온 상태이니 in keyof는 항상 오류가 없겠지요?

다음은 T[K]의 부분입니다. 이는 key가 가지고 있던 타입을 그대로 다시 할당함을 의미합니다. 왜 일까요?

앞서 우린 K가 index가 되었음을 알았습니다. 타입은 마치 오브젝트처럼 동작합니다(완전히 같게 동작하지는 않습니다). 어떤 오브젝트의 키를 가지고 object[key]연산하면 그 값이 반환되는 것과 마찬가지입니다. T에 대한 K는 T의 index이니, 그 값이 반환될 것이고, T는 타입이므로 그 T가 가지고 있던 멤버에 할당된 타입이 그대로 반환되는 것입니다. 

## Partial
```typescript
type Partial<T> = {[K in keyof T]?: T[K]};
var partial:Partial<Object> = {}; // OK!
```
Partial은 Require와 정확히 반대의 원리입니다. 모든 논리는 같지만, index signature를 정의할 때 optional로 매핑하는 것이지요. 

## Pick
```typescript
type Pick<T, K extends keyof T> = {[P in K]: T[P]};
var pick1:Pick<Object, 'stringMember'> = {}; // OK
var pick2:Pick<Object, 'numberMember'> = {}; // Error! mission property numberMember
// if want to Pick multiple keys
var pick3:Pick<Object, 'stringMember'|'numberMember'> = { numberMember: 1 }; // OK
```
K는 keyof T constraint가 붙어있습니다. 이로 인해 K는 T에 존재하는  key로만 배정이 가능하도록 강제됩니다. Require에서 설명한 것처럼, in 연산자는 index signature를 정의합니다. 즉, K로 인해 T의 일부 타입들이 다시 매핑되어 K를 key로 가진 새로운 타입이 되는 것입니다.

K는 T 의 key를 extends한 것이기 때문에 optional을 명시하지 않아도 자동으로 매핑됩니다. pick1에서 오류가 발생하지 않는 이유입니다.  여러 key를 pick하고 싶다면 union타입을 활용하면 됩니다.

## Exclude
```typescript
type Exclude<T, U> = T extends U ? never : T;
var exclude1:Exclude<keyof Object, 'stringMember'> = 'numberMember'; // OK
var exclude2:Exclude<keyof Object, 'stringMember'> = undefined; // OK
var exclude3:Exclude<keyof Object, 'stringMember'> = null; // OK
```
이는 type에서 사용하는 특별한 문법입니다. keyof Object가 U를 extends할까요? 아닙니다. 그럼 모두 never가 되어야 할텐데 왜 U를 제외한 타입이 반환되는 것일까요? 이는 문법이라기보다는 타입의 규칙입니다. 분리된 타입에서 사용될 때, keyof Object extends ‘stringMember’는 map동작처럼 유니온의 각각의 타입들에 대하여 매핑됩니다. 이를 기본적인 동작이라고 오해하면 안됩니다. 이는 Omit 타입에서 확인할 수 있는데, Omit은 Exclude를 활용하여 구현되지만, Omit 내의 Exclude를 Exclude의 구현대로 치환한다면 어떻게 될까요? keyof Object extends ‘stringMember’는 항상 false가 반환됩니다.

exclude3에 null이 할당될 수 있다는 것은 이해할 수 있습니다. 그렇다면 undefined는 왜 OK일까요? keyof Object는 사실 ‘stringMember’|’numberMember’가 아니라 ‘stringMember’|’numberMember’|undefined 입니다. stringMember를 제외해도 undefined와 numberMember의 union이니 undefined를 할당해도 에러가 없는 것입니다. 

## Omit
```typescript
type Omit<T, K extends string | number | symbol> = {[P in Exclude<keyof T, K>]: T[P]};
var g:Omit<Object, 'stringMember'> = { numberMember: 1 }; // OK
var h:Omit<Object, 'numberMember'> = {} // Error! missing property: stringMember
```
Omit은 앞서 설명한 Exclude를 포함한 구현을 가집니다. Exclude로 단일 혹은 union 타입을 반환받은 후, in 연산자로 P를 매핑, T[P]로 타입을 그대로 key에 매핑합니다. K가 string|number|symbol인 이유는 앞서 설명한것 처럼 JS에서 key가 될 수 있는 타입은 string, number, symbol뿐이기 때문입니다.

## ExcludeSpecificType1
```typescript
type ExcludeSpecificType1<T, S> = {[K in keyof T]:T[K] extends S ? never : K }[keyof T];
var i:Pick<Object, ExcludeSpecificType1<Object, string>> = { numberMember: 1 }; // Error! Type 'undefined' is not assignable
var j:Pick<Object, ExcludeSpecificType1<Require<Object>, string>> = { numberMember: 1}; // OK
```
Pick과 복합적으로 사용해야 효과를 발휘합니다. ExcludeSpecificType1 자체는 string 혹은 string union타입입니다.
이제 K가 T의 key들로 매핑되었다는 것은 한 눈에 보이실겁니다. 문제는 뒷 부분인데, T[K]가 S를 extends하는지를 검증하고 있습니다.
이게 무슨 의미 일까요? S와 타입이 같다면 never 아니라면 K를 반환하고 있습니다. Key를 type으로 그대로 매핑한다는 의미입니다.
왜 일까요? 맨 뒷 부분에서 keyof T로 key의 타입을 다시 돌려받고 있는 것을 보실 수 있습니다. 타입이 특정한 string으로 매핑되었으니
index를 keyof T로 매핑하면 string union이 되겠지요? 이를 Pick으로 다시 타입을 생성하면 특정한 타입을 건너뛰는 타입이 완성되는 것입니다.

## ExcludeSpecificType2
```typescript
type ExcludeSpecificType2<T, S> = {[K in keyof T as T[K] extends S ? never : K]: T[K]};
var k:ExcludeSpecificType2<Object, string> = { numberMember: 1}; // OK
var l:ExcludeSpecificType2<Object, number> = {}; // OK
var m:ExcludeSpecificType2<Object, string> = { numberMember: 1, stringMember: '' }; // OK
```
as를 사용하면 ExcludeSpecificType1을 훨씬 개선시킬 수 있습니다. ExcludeSpecificType2를 정확히 이해하려면 as가 누구를 가리키고 있는지를 확실히 알아야합니다.
as가 어디에 적용된 것 처럼 보이시나요? 답은 K입니다. 'T의 key들로 이루어진 string union이 mapping된 K를 T[K]로'라고 정리가 가능하겠습니다. 이제 T[K]가 key에 할당된 type임은 알 수 있으실겁니다.
바로 이 type을 S와 즉시 비교합니다. true라면 건너뛰고, false라면 K를 그대로 다시 반환합니다. ExcludeSpecificType1보다 훨씬 직관적으로 타입이 완성됨을 확인 할 수 있습니다.
