import { pipe } from './pipe.js';
import { curry } from './curry.js';
import { lazyFilter } from './filter.js';
import { lazyMap } from './map.js';
import { reduce } from './reduce.js';
import { map } from './map.js';

const possibleQueryParams = {
  a: 1,
  b: undefined,
  c: 'stringParam1',
  d: 'stringParam2',
};

// 명령형을 lisp형태로 바꾸는 연습을 더 해봅시다.
// 아래와 같이 객체를 쿼리형태로 바꿔주는 함수가 존재한다고 생각해봅시다.
function query_1(obj) {
  let res = '?';
  for (const k in obj) {
    const v = obj[k];
    if (v === undefined) continue;
    if (res !== '?') res += '&';
    res += `${k}=${v}`;
  }
  return res;
}

// 동작은 완벽하지만 딱 봐도 보기 부담스럽지 않나요?
console.log(query_1(possibleQueryParams)); // ?a=1&c=stringParam1&d=stringParam2

// 일단 js내장 함수를 이용해 바꿔봅시다.
// 조~금 나아지긴 했지만... 여전히 함수명 없이는 뭘 하고 싶은건지 바로 알아볼 수 없겠죠?
function query_2(obj) {
  return Object.entries(obj).reduce((query, [k, v], i) => {
    if (v === undefined) return query;
    return `${query}${i > 0 ? '&' : '?'}${k}=${v}`;
  }, '');
}

console.log(query_2(possibleQueryParams)); // ?a=1&c=stringParam1&d=stringParam2

// iterable protocol을 따르는 함수들로 바꿔봅시다.
function query_3(obj) {
  return reduce(
    (query, kv) => {
      return query !== '?' ? `${query}&${kv}` : `${query}${kv}`;
    },
    '?',
    lazyMap(
      ([k, v]) => `${k}=${v}`,
      lazyFilter(([_, v]) => v !== undefined, Object.entries(obj))
    )
  );
}

console.log(query_3(possibleQueryParams));

// 반대로 쿼리를 코드에서 사용하기 쉽게 object로 바꾸는 함수를 작성해봅시다.
const split = curry((sep, str) => str.split(sep));
const queryToObject = pipe(
  split('&'),
  map(split('=')),
  map(([k, v]) => ({ [k]: v })),
  reduce(Object.assign)
);

console.log(queryToObject(query_3(possibleQueryParams)));
