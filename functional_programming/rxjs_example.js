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
// 값을 하나 받는 것은 어렵지 않지만 연속적인 Observable의 값을 하나씩 받는 다는 것은 지리한 일입니다. 다행히도 받아야할 만큼의 결과를 pipe내에서 계산하는 것이 가능합니다.
// 아래의 경우에선 모든 결과를 받아야하기 때문에 따로 take하지 않았지만 Observable의 지연평가를 제대로 활용하려면, 먼저 받아야할 만큼 take하는 것이 좋습니다.
async function getRes(URLs) {
  return new Promise((resolve) => {
    from(URLs)
      .pipe(mergeMap(PR /**concurrent = infinity */), bufferCount(Infinity)/**혹은 reduce로 값을 만들어도 결과는 같습니다. */)
      .subscribe((x) => resolve(x));
  });
}

// mergeMap을 사용하지 않고 map으로 연산한 후, 모든 결과를 한번에 전달하는 zipAll을 사용해도 결과는 같습니다 :)
function getRes(URLs) {
  return new Promise((resolve) => {
    from(URLs)
      .pipe(map(PR), zipAll())
      .subscribe((x) => resolve(x));
  });
}

// 마지막 버전입니다. 이터러블 프로그래밍이 잘 설계되지 않은 경우(혹은 기존 코드에서 즉시 마이그레이션이 불가능할 경우)에 아래와 같은 상황에 맞닥뜨리게 됩니다.
// 이미 코드가 for loop에 너무 깊게 연관되어 있어 아예 코드를 다시 짜야하는 경우(제가 회사에서 겪고 있는 경우입니다 ㅠㅠ), 일단 첫 단계로 시도해볼만한 방법입니다.
// Observable을 for loop에서 반환중이었다고 가정합니다. 각 Observable마다 따로 처리를 해야한다는 뜻이지요. Observable을 사용하는 의미도 없을 뿐더러 코드가 매우 지저분 할 것입니다.
// 이런 경우 순차적으로 반환되는 Observable들을 합친 후, 한번에 처리해봅시다.
// 이런 시도를 하는 이유는, 코드 재사용이 가능해지기 때문입니다.
// concat된 Observable을 다루는 코드는 for loop이 제거되고 이터러블 프로그래밍 코드로 완전히 마이그레이션 된 이후(즉, 애초에 이터러블 프로토콜로 인해 연속적인 subscribe가 가능한 Observable로 출발한다는 의미)에도 정확히 같게 사용할 수 있겠지요.
function getRes(URLs) {
  // 이 코드에서 URLs 배열은 이미 즉시 평가되어있으므로 shift를 사용하고 있지만, 이터러블 인자가 지연평가된다면 next로 처리하면 되겠지요
  let target = of(URLs.shift()).pipe(map(PR));
  for (const url of URLs) {
    target = concat(target, of(url).pipe(map(PR)));
  }
  target.pipe(zipAll()).subscribe(console.log);
}

console.time('');
getRes(URLs).then((x) => {
  console.log(x); // URLs의 길이만큼 응답이 들어옵니다.
  console.timeEnd(''); // 동시처리로 인해 세가지 값이 2초뒤에 들어옵니다.
});

