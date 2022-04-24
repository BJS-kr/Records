/**
 * Question
 * 객체의 프로퍼티와 모든 하위 객체를 재귀적으로 읽기 전용으로 설정하는 제네릭 DeepReadonly<T>를 구현하세요.
 * 이 챌린지에서는 타입 파라미터 T를 객체 타입으로 제한하고 있습니다. 객체뿐만 아니라 배열, 함수, 클래스 등 가능한 다양한 형태의 타입 파라미터를 사용하도록 도전해 보세요.
 */

// Answer
type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type X = {
  x: {
    a: 1;
    b: {
      ㄱ: 1;
      ㄴ: 2;
    };
  };
  y: 'hey';
};

type Expected = {
  readonly x: {
    readonly a: 1;
    readonly b: {
      ㄱ: 1;
      ㄴ: 2;
    };
  };
  readonly y: 'hey';
};

type Todo3 = DeepReadonly<X>; // should be same as `Expected`

const t: Todo3 = {
  x: {
    a: 1,
    b: {
      ㄱ: 1,
      ㄴ: 2,
    },
  },
  y: 'hey',
};

t.x.b.ㄱ = '3'; // Error! ㄱ is readonly
