/**
 * Question
 * T에서 K 프로퍼티만 제거해 새로운 오브젝트 타입을 만드는 내장 제네릭 Omit<T, K>를 이를 사용하지 않고 구현하세요.
 */

// Answer
type MyExcluded<T, U> = T extends U ? never : T;
type MyOmit<T, U> = { [K in MyExcluded<keyof T, U>]: T[K] };

interface ToDo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<ToDo, 'description' | 'title'>;

const toDo: TodoPreview = {
  completed: false,
};
