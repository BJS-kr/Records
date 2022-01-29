/**
 * Generator와 Closure에서 아이디어를 얻었습니다.
 * 
 * 1. 효율적이고, 가독성 좋은 Closure Function Factory를 구현 할 수 없을까 고민했습니다.
 * 2. 연결된 모든 closure function의 결과를 최종 반환할 수 있도록 했습니다.
 * 3. callback을 자유롭게 작성하고, callback 인자도 마음껏 할당할 수 없을까 고민했습니다.
 * 4. 이미 진행된 chain이 반환했던 값들을 참조하여 다음 chain의 callback을 작성할 수 있도록 했습니다.
 */

// a. next()를 호출하면 다음 체인이 생성됩니다.
// b. done()을 호출하면 태그와 함께 모든 chain들이 반환한 결과 배열이 함께 반환됩니다.
// c. tag는 개발자가 chain의 결과를 어떤 context에서 사용했는지 명확히 하기 위함입니다.
// d. chain이 undefined를 return하면 null을 대신 results에 push합니다. undefined는 ambiguous하기 때문에, 모든 개발자들의 결과물의 통일성을 위해서입니다.
// e. results 배열에 null이 포함되어있다면, null이 할당된 indexes와 함께 경고 문구를 출력합니다. null return을 개발자가 의도한 것인지 함수에 의한 것인지 확인하라는 경고입니다.
// f. callback의 첫 번째 인자는 stacked results로 고정됩니다. 이 전 chain의 cb가 반환했던 값을 참조할 수 있게 하기 위해서 입니다.

function chainedFunctionFactory(tag: string) {
  const results = [];
  const nullIndexes = [];
  let functionIndex = 0;

  function chainedFunction(
    callback: (stackedResult: any[], ...args: any[]) => any,
    ...callbackArgs: any[]
  ) {
    const result = callback(results, ...callbackArgs);

    if (result === undefined) {
      nullIndexes.push(functionIndex);
      results.push(null);
    } else {
      results.push(result === undefined ? null : result);
    }
    
    return {
      next: () => {
        functionIndex++;
        return chainedFunction;
      },
      done: () => {
        // done이 호출 될 때, results 배열에 null이 할당된 indexes와 함께 경고 문구를 출력합니다.
        if (nullIndexes.length > 0) {
          console.warn(`null value included in the results at index ${nullIndexes}.\nPlease be sure that you were intentionally assigned null.\nif not, check if one of your chained function returning undefined.\n`)
        }
        return { tag, results };
      },
    };
  }

  return chainedFunction;
}

/**
 * ###### EXAMPLE ######
 */

// 태그('test')와 함께 첫 번째 체인이 생성됩니다.
const firstChain = chainedFunctionFactory('test');

// next()가 호출 되었으므로 다음 클로저 함수가 생성됩니다.
const secondChain = firstChain(
  function (stackedResults, arg1, arg2) {
    console.log(arg1); // testArgs_1
    console.log(arg2); // testArgs_2
    return true;
  },
  'testArgs_1', 'testArgs_2',
).next();

// next()
const thirdChain = secondChain((stackedResults) => { 
  console.log(stackedResults); // [ true ]
  
  // will return undefined
  if (stackedResults[0] === true) { return; }
  return true;
}).next();

// next()
const fourthChain = thirdChain((stackedResults) => {
  console.log(stackedResults); // [ true, null ]

  // will return false
  if (stackedResults[stackedResults.length - 1] === null) {
    return false;
  }
  return true;
}).next();

// next()
const fifthChain = fourthChain(
  (stackedResults, arg) => {
    console.log(stackedResults) // [ true, null, false ]

      // will return 'fourth chain'
    if (stackedResults[0] === true) {
      return arg;
    }
    return null;
  },
  'fourth chain',
).next();

// done()을 호출 했으므로 태그와 결과 배열이 할당됩니다.
// results closure에 null이 포함되어있으므로 null이 할당된 index와 함께 경고문구가 출력될 것입니다.
const result = fifthChain(() => { 
  return; 
}).done();

console.log(result);
/**
 * null value included in the results at index 1,4.
 * Please be sure that you were intentionally assigned null.
 * if not, check if one of your chained function returning undefined.
 *
 * { tag: 'test', results: [ true, null, false, 'fourth chain', null ] }
 * 
 */
