/**
* Type guard
* 모든 타입 가드를 범용으로 구현할 순 없습니다. 코드 스타일마다 다를 것이고(ex: 어떤 팀은 tagged union 사용, 어떤 팀은 특정 prop 검증) 상황에 따라 맞는 방법이 있을 것입니다.
* 그러나 어떤 인스턴스가 어떤 타입의 인스턴스인지와 typeof 연산으로 검증이 가능한 값들은 범용으로 구현할 수 있습니다.
*/

// 아래는 타입가드 함수에 사용할 타입들입니다.

// Function타입을 그대로 사용하지 않는 이유는 eslint 설정상 Ban Types에 Function이 포함되어 있을 가능성이 있기 때문입니다. 최대한 수정할 필요를 줄이고자 했습니다. 
export type AnyFunction = (...args: unknown[]) => unknown;
export type StringIndexedObject = { [key: string]: unknown };

// Class는 제네릭 타입으로 사용될 때, static side로 평가됩니다.
// 즉, constructor signature를 참조할 수 없는 상태입니다. 이를 개선하기 위해 아래와 같은 Class<T> 타입으로 변환 시켜줍니다.
// 만약 다른 타입검증을 하지 않고, 클래스의 instanceof 만을 검증하는 함수였다면 이런 과정은 필요하지 않습니다. T의 extends constraints를 정하지 않으면 되기 때문입니다.
// 반면, 함수의 인자로 들어갈 땐 instance side로 평가됩니다. 즉, 함수의 인자 타입은 Class<T>로 표시되지만 별다른 조치 없이 타입으로 사용된 클래스를 그대로 넣으면 됩니다.
// 이는 하단의 테스트 코드에서 구현되어있습니다.
export type Class<T> = new (...args: unknown[]) => T;

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
    type:
      // 제네릭 T를 입력하지 않을 경우 T는 ''가 됩니다. strict하게 사용하기 위해 T를 지정하지 않는 경우는 never로 처리합니다.
      // 이와 같은 처리를 하지 않으면 ''는 string을 extends하게 됩니다.
      T extends ''
      ? never
      : T extends string
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
    // type인자는 string일 수도, 클래스 혹은 undefined, null까지 될 수 있기 때문에 분기가 필요합니다.
    if (typeof type === 'string') {
      // typeof val === type이라고 작성할 수도 있습니다. 그러나, 이는 eslint설정이 문제가 될 가능성이 있습니다.
      // eslint의 설정 "valid-typeof": ["error", { "requireStringLiterals": true }]는 typeof 연산에 string literal 이외의 것에 에러를 반환하기 때문입니다.
      // 사실 이 설정을 비활성화해도 문제는 없습니다. 타입으로 인자를 고정시킬 수 있기 때문입니다. 
      // 그러나, 개발자의 타입 작성을 믿는 것은 개발자가 실수할 경우 에러를 유발 할 수 있기 때문에 최대한 strict한 방법으로 작성했습니다.
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

// 
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

