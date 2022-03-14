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

// mergeMap으로 동시성을 가진 요청을 해봅시다
// 아래와 같이 request를 promisify하여 응답에 2초가 걸리는 GET요청이 있다고 가정해보겠습니다.
const URLs = ['google.com', 'naver.com', 'daum.net'];
const PR = (url) =>
  new Promise((res) => {
    const options = {
      host: url,
      path: '/',
    };

    setTimeout(
      () =>
        request(options, (response) => {
          res(response.statusCode);
        }).end(),
      2000
    );
  });

// mergeMap에서 concurrent는 기본적으로 infinity입니다. 즉 명시하지 않으면 Observable들을 동시에 처리한다는 뜻이지요.
// concurrent의 값을 다르게 설정해서 이를 확인해보겠습니다.
// 먼저 1로 값을 줘보겠습니다. 2초마다 응답 코드가 돌아옵니다.
from(URLs)
  .pipe(mergeMap(PR, 1))
  .subscribe(console.log);

// 여기선 모든 Observable을 풀었으므로 한꺼번에 결과가 돌아옵니다. 
from(URLs)
  .pipe(mergeMap(PR /**concurrent = infinity */))
  .subscribe(console.log);

// subscribe내부에서 잡힌 값을 리턴하고 싶으면 어떻게 해야할까요?
// 예를 들어 엔드포인트에서 값을 Observable이 아니라 값을 반환받고 싶은 상황이겠지요. 함수로 표현해보겠습니다.
// 값을 하나 받는 것은 어렵지 않지만 연속적인 Observable의
async function getRes(URLs) {
  return new Promise((resolve) => {
    from(URLs)
      .pipe(mergeMap(PR /**concurrent = infinity */), bufferCount(Infinity)/**혹은 reduce로 값을 만들어도 결과는 같습니다. */)
      .subscribe((x) => resolve(x));
  });
}

console.time('');
getRes(URLs).then((x) => {
  console.log(x); // URLs의 길이만큼 응답이 들어옵니다.
  console.timeEnd(''); // 동시처리로 인해 세가지 값이 2초뒤에 들어옵니다.
});

