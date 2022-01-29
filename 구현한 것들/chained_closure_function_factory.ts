/**
 * Generator와 Closure에서 아이디어를 얻었습니다.
 * 
 * 1. 효율적이고, 가독성 좋은 Closure Function Factory를 구현 할 수 없을까 고민했습니다.
 * 2. 연결된 모든 closure function의 결과를 최종 반환할 수 있도록 했습니다.
 * 3. callback을 자유롭게 작성하고, callback 인자도 마음껏 할당할 수 없을까 고민했습니다.
 */

// a. next()를 호출하면 다음 체인이 생성됩니다
// b. done()을 호출하면 태그와 함께 모든 체인 함수들이 반환한 결과의 배열이 함께 반환됩니다.
// c. tag는 개발자가 chain의 결과를 어떤 context에서 사용했는지 명확히 하기 위함입니다.
// d. chain이 undefined를 return하면 null을 대신 results에 push합니다.
// e. results 배열에 null이 포함되어있다면, null이 할당된 indexes와 함께 경고 문구를 출력합니다.

function chainedFunctionFactory(tag: string) {
  const results = [];
  const nullIndexes = [];
  let functionIndex = 0;
  
  // 콜백과 콜백에 필요한 인자 배열을 chainedFunction 인자로 할당하도록 합니다.
  function chainedFunction(
    callback: (...args: any[]) => any,
    callbackArgs?: any[],
  ) {
    let result;
    
    if (callbackArgs) { 
      result = callback(...callbackArgs) 
    } else { 
      result = callback() 
    }

    // undefined는 자바스크립트 엔진이 반환한 것인지, 개발자가 의도적으로 반환한 것인지 ambiguous합니다.
    // 개발자들의 결과물의 통일성을 위해, callback의 결과가 undefined라면 null을 push하도록 강제합니다.
    if (result === undefined) {
      nullIndexes.push(functionIndex)
      results.push(null)
    } else {
      results.push(result === undefined ? null : result);
    }
    

    return {
      next: () => {
        functionIndex++;
        return chainedFunction;
      },
      done: () => {
        // done이 호출 될 때, results 배열 내 null이 포함되어 있다면 null이 할당된 indexes와 함께 경고 문구를 출력합니다.
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

// next()가 호출 되었으므로 다음 체인 생성됩니다.
// results에 true가 push됩니다.
const secondChain = firstChain(
  function (arg1, arg2) {
    console.log(arg1); // testArgs_1
    console.log(arg2); // testArgs_2
    return true;
  },
  ['testArgs_1', 'testArgs_2'],
).next();

// next()가 호출 되었으므로 다음 체인이 생성됩니다.
// chain이 undefined를 반환하므로 null이 results에 push될 것이고, 경고 문구에 값의 index가 표시될 것입니다.
const thirdChain = secondChain(() => { return }).next()

// next()를 호출했으므로 다음 체인이 할당됩니다.
// results에 false가 push됩니다.
const fourthChain = thirdChain(() => {
  return false;
}).next();

// next()를 호출했으므로 다음 체인이 할당됩니다.
// results에 'fourth chain'이 push됩니다.
const fifthChain = fourthChain(
  (arg) => {
    return arg;
  },
  ['fourth chain'],
).next();

// done()을 호출 했으므로 태그와 결과 배열이 할당됩니다.
// chain이 undefined를 반환하므로 null이 results에 push될 것이고, 경고 문구에 값의 index가 표시될 것입니다.
const result = fifthChain(() => { return }).done()

console.log(result);
/**
 * result:
 * null value included in the results at index 1,4.
 * Please be sure that you were intentionally assigned null.
 * if not, check if one of your chained function returning undefined.
 *
 * { tag: 'test', results: [ true, null, false, 'fourth chain', null ] }
 * 
 */
