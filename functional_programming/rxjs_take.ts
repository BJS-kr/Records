import { range, map, takeUntil, tap, Subject } from 'rxjs';

// take의 용법을 파고들어 봅시다.
// 가상의 api를 이용한다고 가정합시다. 자원은 3개씩 조회되며, 자원이 존재하는 이상의 page를 입력하게 되면 빈 배열이 반환된다고 가정합니다.
// 예를 들어, 존재하는 모든 자원이 8개라면 2페이지까지는 3개씩 반환될 것이며, 3페이지에는 2개, 4페이지는 빈 배열이 반환될 것입니다.

const responses: { [x: number]: any } = {
  1: [
    { id: 0, amount: 8000 },
    { id: 1, amount: 18000 },
    { id: 2, amount: 3000 },
  ],
  2: [
    { id: 3, amount: 22000 },
    { id: 4, amount: 1000 },
    { id: 5, amount: 90000 },
  ],
  3: [
    { id: 6, amount: 67000 },
    { id: 7, amount: 330000 },
  ],
  4: [],
  5: [],
};

// 두 가지가 떠오르네요. 먼저 takeWhile을 사용하는 경우를 생각해보겠습니다.
// 이 경우는 적절치 못한 것 같습니다. 조건을 주기가 까다롭기 때문입니다.
// 예를 들어, 배열의 길이가 0보다 클 때(x.length > 0)으로 takeWhile 조건을 준다고 생각해보면
// 3페이지 이후에는 값이 없음에도 불구하고 무조건 4페이지까지 확인해야 3페이지가 마지막임을 알 수 있습니다. 불필요한 요청을 하게 되는 것이지요

// 이번엔 takeUntil을 생각해봅시다.
// 일단 rxjs의 takeUntil의 성질을 알아야합니다.
// rxjs의 takeUntil은 notifier가 값을 emit한 시점에
// base Observable이 값을 이미 emit했더라도, 그 값을 제외시킵니다.
// 합리적이지만, 위에서 가정한 상황의 경우에는 참 불편합니다.
// 위의 가정에서, 4페이지 이후는 빈 값이므로 요청을 보내는 것 자체가 손해입니다.
// 그렇다면 3페이지에서 배열의 길이가 3 미만이므로 그 즉시 Observable의 값 emit을 멈춰야하는데
// 이 경우 takeUntil을 쓰면 3페이지를 이미 조회했음에도 불구하고 그 값을 누락시키는 상황이 발생하게 됩니다(1,2,3페이지 조회 but 결과는 1,2페이지만 반환).
// 아래 구현에서 tap에서 result에 결과를 push하는 이유가 바로 이 때문입니다.

function getAllPayments(perPage: number) {
  const notifier = new Subject();
  const result: any[] = [];

  new Promise<any>((res) => {
    range(1, Infinity)
      .pipe(
        map((page) => responses[page]),
        tap((x) => {
          result.push(x);
          console.log('expected length: ', x.length);
          if (x.length < perPage) {
            notifier.next(null);
          }
        }),
        takeUntil(notifier)
      )
      .subscribe({
        complete: () => {
          // 1,2,3 페이지의 결과를 모두 합친 result
          res(result.flatMap((x) => x));
        },
      });
  }).then(console.log);
}

getAllPayments(3);
