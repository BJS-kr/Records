# 타입가드
모든 타입 가드를 범용으로 구현할 순 없다. 코드 스타일마다 다를 것이고(ex: 어떤 팀은 tagged union 사용, 어떤 팀은 특정 prop 검증) 상황에 따라 맞는 방법이 있을 것이다.
그러나 어떤 인스턴스가 어떤 타입의 인스턴스인지와 typeof 연산으로 검증이 가능한 값들은 범용으로 구현할 수 있다.

```typescript
const typeGuards = {
  isTypeOfClass:
  <C>(
    instance:unknown,
    className: new (...args:any[]) => C):
    instance is C => instance instanceof className,
  isTypeOf: 
    <T extends string|number|bigint|boolean|symbol|Function|object|undefined>(
    val:unknown,
    typeStringLiteral:
    T extends string ?
    'string' :
    T extends number ?
    'number' :
    T extends bigint ?
    'bigint' :
    T extends boolean ?
    'boolean' :
    T extends symbol ?
    'symbol' :
    T extends Function ?
    'function' :
    T extends undefined ?
    'undefined' :
    T extends object ?
    'object' :
    never
    ): val is T => typeof val === typeStringLiteral,
};
```
