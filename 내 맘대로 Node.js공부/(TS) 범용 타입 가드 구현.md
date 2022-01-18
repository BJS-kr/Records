# 타입가드
모든 타입 가드를 범용으로 구현할 순 없다. 코드 스타일마다 다를 것이고(ex: 어떤 팀은 tagged union 사용, 어떤 팀은 특정 prop 검증) 상황에 따라 맞는 방법이 있을 것이다.
그러나 어떤 인스턴스가 어떤 타입의 인스턴스인지와 typeof 연산으로 검증이 가능한 값들은 범용으로 구현할 수 있다.

```typescript
// only can use when strictNullCheck of tsconfg is true
  function isTypeOf<
    // any 대신 unkown을 쓴 이유: https://stackoverflow.com/questions/51439843/unknown-vs-any
    T extends
      | string
      | number
      | bigint
      | boolean
      | symbol
      | AnyFunction
      | StringIndexedObject
      | undefined
      | null
      | Array<unknown>
      | Class<unknown>
  >(
    val: unknown,
    type: T extends string
      ? 'string'
      : T extends number
      ? 'number'
      : T extends bigint
      ? 'bigint'
      : T extends boolean
      ? 'boolean'
      : T extends symbol
      ? 'symbol'
      : T extends AnyFunction
      ? 'function'
      : T extends undefined
      ? 'undefined'
      : T extends StringIndexedObject
      ? 'object'
      : T extends Array<unknown>
      ? 'array'
      : T extends Class<unknown>
      ? T
      : T extends null
      ? null
      : never,
  ): val is T {
    if (typeof type === 'string') {
      if (type === 'string') {
        return typeof val === 'string';
      }
      if (type === 'number') {
        return typeof val === 'number';
      }
      if (type === 'bigint') {
        return typeof val === 'bigint';
      }
      if (type === 'boolean') {
        return typeof val === 'boolean';
      }
      if (type === 'symbol') {
        return typeof val === 'symbol';
      }
      if (type === 'function') {
        return typeof val === 'function';
      }
      if (type === 'undefined') {
        return typeof val === 'undefined';
      }
      if (type === 'object') {
        if (Array.isArray(val) || val === null) {
          return false;
        }
        return typeof val === 'object';
      }
      if (type === 'array') {
        return Array.isArray(val);
      }
    } else if (type === null) {
      return val === null;
      // typeof class의 결과는 'function'입니다. constructor때문입니다.
    } else if (typeof type === 'function') {
      // right expression of instanceof must be assignable to any or Function type but both can't be used in type guard function
      // so it has to be an any when return
      return val instanceof (type as any);
    }
    // type이 never인 경우. 애초에 실행 될 수 없지만 is 반환은 암묵적 void를 허용하지 않기 때문에 명시적으로 return false를 지정해야 합니다
    return false;
  }
```
# 예시
```typescript
  describe('type guard test', () => {
    class Test {}
    class Test2 {}

    const test = new Test();
    const test2 = new Test2();

    it('should return true if type matches (string)', () => {
      expect(UtilService.isTypeOf<string>('haha', 'string')).toBe(true);
      expect(UtilService.isTypeOf<string>(99, 'string')).toBe(false);
    });

    it('should return true if type matches (number)', () => {
      expect(UtilService.isTypeOf<number>(123, 'number')).toBe(true);
      expect(UtilService.isTypeOf<number>('merong', 'number')).toBe(false);
    });

    it('should return true if type matches (boolean)', () => {
      expect(UtilService.isTypeOf<boolean>(false, 'boolean')).toBe(true);
      expect(UtilService.isTypeOf<boolean>('haha', 'boolean')).toBe(false);
    });

    it('should return true if type matches (string indexed object)', () => {
      expect(
        UtilService.isTypeOf<StringIndexedObject>({ hi: 'merong' }, 'object'),
      ).toBe(true);
      expect(
        UtilService.isTypeOf<StringIndexedObject>(['wayne', 'hills'], 'object'),
      ).toBe(false);
      expect(UtilService.isTypeOf<StringIndexedObject>(null, 'object')).toBe(
        false,
      );
      expect(
        UtilService.isTypeOf<StringIndexedObject>(undefined, 'object'),
      ).toBe(false);
    });

    it('should return true if type matches (symbol)', () => {
      expect(UtilService.isTypeOf<symbol>(Symbol(), 'symbol')).toBe(true);
      expect(UtilService.isTypeOf<symbol>(0, 'symbol')).toBe(false);
    });

    it('should return true if type matches (bigint)', () => {
      expect(
        UtilService.isTypeOf<bigint>(BigInt(9007199254740991), 'bigint'),
      ).toBe(true);
      expect(UtilService.isTypeOf<bigint>(9007199254740991, 'bigint')).toBe(
        false,
      );
    });

    it('should return true if type matches (class)', () => {
      expect(UtilService.isTypeOf<Class<Test>>(test, Test)).toBe(true);
      expect(UtilService.isTypeOf<Class<Test>>(test2, Test)).toBe(false);
    });

    it('should return true if type matches (function)', () => {
      expect(
        UtilService.isTypeOf<AnyFunction>(UtilService.isTypeOf, 'function'),
      ).toBe(true);
      expect(
        UtilService.isTypeOf<AnyFunction>('im not function', 'function'),
      ).toBe(false);
    });

    it('should return true if type matches (array)', () => {
      expect(UtilService.isTypeOf<Array<any>>([1, 2, 3], 'array')).toBe(true);
      expect(UtilService.isTypeOf<Array<any>>({ wayne: 'hi!' }, 'array')).toBe(
        false,
      );
    });

    it('should return true if type matches (null)', () => {
      expect(UtilService.isTypeOf<null>(null, null)).toBe(true);
      expect(UtilService.isTypeOf<null>(11, null)).toBe(false);
    });

    it('should return true if type matches (undefined)', () => {
      expect(UtilService.isTypeOf<undefined>(undefined, 'undefined')).toBe(
        true,
      );
      expect(UtilService.isTypeOf<undefined>('defined', 'undefined')).toBe(
        false,
      );
    });
  });
```
