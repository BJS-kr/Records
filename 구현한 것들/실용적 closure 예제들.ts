// 코어 자바스크립트(정재남 저)에서 제시한 핵심 개념들을 차용해 작성 해보았다.

/**
* 부분 실행
* 함수 필요한 인자들이 한번에 모두 확정되지 않을 수 있다. 이런 경우, 클로저를 활용해 확정된 인자들만 클로저를 활용해 유지시킨 후 나머지 인자가 확정되었을 때 지연 실행시킬 수 있다.
* 이 컨셉을 고도화한 버전으로, 필요한 인자들이 순서대로 확정되지 않을 경우도 고려할 수 있다. 확정된 인자들만 필요한 자리에 넣어두고, 나머지 인자들은 확정되었을 때 빈자리를 채우는 식이다.
* 이는 ES6부터 도입된 Symbol을 통해 구현할 수 있다.
*/

// TS로 변경. 타입 안정성 확보 및 가독성을 향상시켜보았다.
const _ = Symbol.for('EMPTY_ARG');

function add() {
  let result = 0;
  for (const num of arguments) {
    result += num;
  }

  return `add result: ${result}`;
}

// 0번 인덱스에는 무조건 function을 받기 위해 tuple을 사용했습니다.
// 1~ 인덱스에는 미리 확정된 arg혹은 확정되지 않은 arg(_)가 위치할 수 있습니다.
// 모든 args가 확정되면 지연 실행 될 수 있도록하는 고차 함수입니다.
function partial(...partialArgs: [Function, ...(number | typeof _)[]]) {
  // index로 접근하지 않으면 지연 실행 되는 부분(return되는 함수의 return)의 타입 체크가 제대로 이루어지지 않고 not callable 에러가 납니다..
  // 예를 들어, shift 혹은 splice 등으로 closureFunc에 할당하면 function 타입 체크가 추가로 필요합니다.
  const closureFunc = partialArgs[0];
  partialArgs.shift();

  console.log('partial args: ', partialArgs);

  return function (...finalArgs:number[]) {

    console.log('final args: ', finalArgs);

    const completeArgs = partialArgs.map(partialArg => {
      if (partialArg === _) {
        return finalArgs.shift()
      }
      return partialArg
    });

    console.log('complete args: ', completeArgs);

    return closureFunc(...completeArgs);
  }
}

const addFinal = partial(add, 1, _, 3, 4, _);

console.log(addFinal(2, 5));

// 결과
// partial args:  [ 1, Symbol(EMPTY_ARG), 3, 4, Symbol(EMPTY_ARG) ]
// final args:  [ 2, 5 ]
// complete args:  [ 1, 2, 3, 4, 5 ]
// add result: 15


// 클로저를 사용할 땐 메모리 해제 조건을 필수로 생각할 것. 안일한 클로저는 메모리 누수로 이어진다.
// strictNullCheck 설정으로 진행했으므로 null은 명시적으로 타입에 포함되어야 함. 제네릭으로 작성하는게 훨씬 재사용성이 높으니 NullUnion<T> 작성 

const closureFunc = () => {
  let count = 0;
  return { get count() { return count; }, set count(num:number) { count += num; } };
};

const counterFunc = () => {
  let count = 0;
  return { get counter() { return count; }, set counter(num:number) { count += num; } };
};

type NullUnion<T> = T extends (...args:any[]) => infer R ? R|null : never;

let encapsulated:NullUnion<typeof closureFunc> = closureFunc();
let counter:NullUnion<typeof counterFunc> = counterFunc();

const result = { count: 0 };

const closureControl = setInterval(() => {
  if (counter && counter.counter > 10) {
    console.log(result.count);
    console.log(counter.counter - 1);
    console.log(encapsulated?.count);
    encapsulated = null;
    counter = null;
    clearInterval(closureControl);
  } else if (encapsulated && counter) {
    encapsulated.count = 3;
    result.count += encapsulated.count;
    counter.counter = 1;
  }
}, 1000 * 3);
