// 유명한 라이브러리들도 함수형 프로그래밍의 해법을 제시합니다. 대표적으로 rxjs가 있겠지요.
// 간단하게 데이터를 Lisp하게 다뤄보겠습니다.

import {
  from,
  map,
  takeLast,
  merge,
  scan,
  reduce,
  mergeMap,
  bufferCount,
  of,
} from 'rxjs';
import { filter } from 'rxjs/operators';

const objectToQuery = {
  a: 'AA',
  b: 'BB',
  c: undefined,
  d: 'DD',
};

function* user() {
  let age = 20;
  const name = ['a', 'b', 'c', 'd', 'e', 'f'];
  for (const v of name) {
    yield { name: v, age: age++ };
  }
}

function* user2() {
  let age = 30;
  const name = ['ㄱ', 'ㄴ', 'ㄷ', 'ㅅ', 'ㄹ', 'ㅁ'];
  for (const v of name) {
    yield { name: v, age: age++ };
  }
}
const enUsers = from(user());
const krUsers = from(user2());
const obsUsers = merge(from(user()), from(user2()));

obsUsers
  .pipe(
    filter(({ _, age }) => age < 33),
    map((x) => x.age),
    takeLast(3),
    scan((acc, curr) => acc + curr, 0),
    reduce((acc, curr) => acc + curr)
  )
  .subscribe((x) => console.log(x));

enUsers
  .pipe(
    mergeMap(({ name: en, _ }) =>
      krUsers.pipe(map(({ name: kr, _ }) => en + kr))
    ),
    bufferCount(3, 6)
  )
  .subscribe((x) => console.log(x));

// object를 쿼리로 변형하는 Observable을 작성해봅시다.
const query = (obj) => {
  return from(Object.entries(obj)).pipe(
    filter(([_, v]) => v !== undefined),
    map(([k, v]) => `${k}=${v}`),
    reduce((acc, cur) => {
      return acc === '' ? `${acc}${cur}` : `${acc}&${cur}`;
    }, '')
  );
};

query(objectToQuery).subscribe(console.log);

