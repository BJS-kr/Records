// Object.entries와 같은 함수들을 사용할 때 단점은 무엇일까요?
// 바로 모든 요소들을 즉시 평가한다는 것입니다.
// Lisp한 프로그래밍을 하려면 요소들을 iterable로 접근해야하는데 lazy접근 할 수 없게 만드는 것입니다.
// Object의 크기가 커지면 커질 수록 효율적이지 않겠지요
// 이를 해결하기 위해 각종 Object관련 메서드들을 lazy하게 구현해보겠습니다.

import { reduce } from './reduce.js';

export function* lazyValues(obj) {
  for (const k in obj) {
    yield obj[k];
  }
}

export function* lazyKeys(obj) {
  for (const k in obj) {
    yield k;
  }
}

export function* lazyEntries(obj) {
  for (const k in obj) {
    yield [k, obj[k]];
  }
}

// object에서 배열로 변환된 값도 다시 object로 만들수 있어야 하겠죠?
// 아래의 함수는 Map객체를 object로 변환할때도 사용할 수 있습니다
// 그 이유는 Map자체가 MapIterator 순회시 [key, value]를 순회하도록 되어있기 때문입니다.
// entries라는 이름 때문에 흔히 아는 key value가 포함된 이중배열만을 떠올리기 쉽지만, iterator에 집중해서 생각해야하는 예입니다.
export function objectify(entries) {
  return reduce((obj, [key, value]) => ((obj[key] = value), obj), {}, entries);
}

// Object를 map하는 함수입니다. 뭔가 개념이 이상하죠? object자체는 iterable하지 않으니까요
// 하지만 object의 모든 값에 일률적인 변환을 가하고 싶을때, 아래와 같이 구현하면 도움이 됩니다.
export function mapObject(f, obj) {
  return objectify(Object.entries(obj).map(([k, v]) => [k, f(v)]));
}

// object에서 원하는 prop만 들어있는 새로운 object를 만드는 것은 어떨까요?
export function pick(keys, obj) {
  return reduce(
    (picked, key) =>
      // undefined를 거르는 이유는 undefined가 말 그대로 무쓸모이기 때문입니다.
      // undefined는 시스템상으로 위험할 뿐더러, db에 저장할 수도, 클라이언트에서 서버로 보낼수도, 서버에서 클라이언트로 보낼수도 없는 말 그대로 무쓸모한 값입니다.
      // 굳이 undefined를 값으로 할당할 필요도 없을 뿐더러 애초에 undefined는 명시적인 사용을 금하는 것이 안정적인 프로그래밍을 할 수 있는 기초입니다.
      obj[key] !== undefined ? ((picked[key] = obj[key]), picked) : picked,
    {},
    keys
  );
}
