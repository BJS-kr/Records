// 이 함수는 순회 비용을 절감하기 위해 만들어진 함수입니다.
// 대상을 구분하는 identity값을 index로 만드는 함수입니다.
// 즉, 배열 내에 특정 대상을 찾기 위해 매번 순회를 할 필요없이,
// 먼저 identity를 key로 가진 object로 변환시켜 찾기 쉽게 만드는 것이지요
// 로직 내에서 순회가 여러번 필요할 경우 쓸모가 있다는 것을 기억해야합니다.
// 한번 순회하고 사용되지 않을 배열이라면 굳이 indexed object로 변환하는 비용이 더 많이 들겠죠?

import { reduce } from './reduce.js';
import { filter } from './filter.js';
import { lazyEntries, objectify } from './objectMethods.js';

// 명확한 예시를 들기 위해 id라고 이름 붙였지만 구분자면 뭐든지 가능합니다. Unique이기만 하면 된다는 것이지요.
const users = [
  { id: 1, name: 'a', age: 3 },
  { id: 5, name: 'b', age: 25 },
  { id: 159, name: 'c', age: 17 },
  { id: 33, name: 'd', age: 88 },
  { id: 67, name: 'e', age: 32 },
];

function indexBy(f, iter) {
  return reduce((acc, cur) => ((acc[f(cur)] = cur), acc), {}, iter);
}

// 약간의 변형을 가해보겠습니다. 이러한 변형은 함수형 프로그래밍에서 아주 쉽습니다.
// 아래는 그저 하나의 예시일 뿐입니다. 상황에 맞게 필요한 함수를 즉시 제작할 수 있다는 것을 보여주는 것이지요.
// 조건에 따라 filter후 indexed된 object를 반환하도록 만들어보겠습니다.
function indexByFiltered(filterF, indexF, iter) {
  return reduce(
    (acc, cur) => ((acc[indexF(cur)] = cur), acc),
    {},
    filter(filterF, iter)
  );
}

// 또 다른 용도를 생각해보겠습니다. 이미 objectify된 객체를 걸러내야할 상황도 있지 않을까요?
function filterObj(f, obj) {
  return objectify(filter(f, lazyEntries(obj)));
}

const indexedUsers = indexBy(({ id, _ }) => id, users);

// id값이 index가 된 object가 생성되었음을 확인 할 수 있습니다. 반복적인 순회대신 사용하면 비용절감에 좋겠지요?
console.log(indexedUsers);

// 먼저 filter한 후, indexBy를 실행합니다. 가장 범용성있고 실용적인 구성입니다.
console.log(
  indexByFiltered(
    (user) => user.age > 20,
    (user) => user.id,
    users
  )
);

// 위와 다르게, objectify된 이후에 동적으로 필터링이 필요할 수도 있겠죠?
// 되도록이면 이미 filter된 결과를 objectify하는게 좋겠지만 여러 상황에 대처할 수 있다는 것은 좋은 일이지요
// 훌륭하게 작동하네요. object에 대해서도 filter가 가능해졌습니다!
console.log(filterObj(([_, { age }]) => age > 20, indexedUsers));
