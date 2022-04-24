/**
 * Question
 * T에서 K 프로퍼티만 읽기 전용으로 설정해 새로운 오브젝트 타입을 만드는 제네릭 MyReadonly2<T, K>를 구현하세요. K가 주어지지 않으면 단순히 Readonly<T>처럼 모든 프로퍼티를 읽기 전용으로 설정해야 합니다.
 */
// Answer
type MyReadonly2<T, U extends keyof T> = {
  readonly [K in U]: T[K];
} & {
  [K in keyof T as K extends U ? never : K]: T[K];
};

interface Todo2 {
  title: string;
  description: string;
  completed: boolean;
}

const todo2: MyReadonly2<Todo2, 'title' | 'description'> = {
  title: 'Hey',
  description: 'foobar',
  completed: false,
};

todo2.title = 'Hello'; // Error: cannot reassign a readonly property
todo2.description = 'barFoo'; // Error: cannot reassign a readonly property
todo2.completed = true; // OK
