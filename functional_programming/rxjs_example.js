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
  firstValueFrom,
  filter
} from 'rxjs';

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

firstValueFrom(
  enUsers.pipe(
    mergeMap(({ name: en, _ }) =>
      krUsers.pipe(map(({ name: kr, _ }) => en + kr))
    )
  )
).then((x) => console.log(x));
