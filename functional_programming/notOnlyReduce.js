// reduce만으로 결과를 만드는 것을 지양하자는 것입니다.
// reduce만으로 결과를 만드는 것은 사실 명령형의 습관입니다.

import { lazyMap } from './map.js';
import { reduce } from './reduce.js';

let age = 20;

const users = [
  { name: 'a', age: age + 1 },
  { name: 'b', age: age + 2 },
  { name: 'c', age: age + 3 },
  { name: 'd', age: age + 4 },
  { name: 'e', age: age + 5 },
];

// 모든 유저들의 나이를 더한다고 생각해보겠습니다.
// reduce만을 가지고도 아래와 같이 가능합니다.
// 그러나, 보여지다시피 연산에서 가독성을 떨어뜨리는 부분들이 존재합니다.
// cur.age, 초깃값, 정체를 알 수 없는 객체(users) 등..
// 실무의 복잡한 코드를 reduce로 표현한다고 생각하면 복잡성은 훨씬 증대될 것입니다.
reduce((acc, cur) => acc + cur.age, 0, users);

// 이를 함수의 조합으로 바꿔보겠습니다.
const add = (a, b) => a + b;
reduce(
  add,
  lazyMap((user) => user.age, users)
);
// 어떤가요? 함수형은 계산이 복잡해진다고 해도 코드의 가독성이 딱히 저해되지 않습니다.
// 지금은 너무나 간단한 계산이기에 느껴지지 않을 수 있지만, 거대한 코드를 함수로 추상화해가면서 위와 같이 표현한다고 생각해보면 조금 더 체감이 됩니다.
