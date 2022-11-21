nodejs는 CJS와 ESM를 모두 사용할 수 있다. 이 두 형태는 왜 존재하는 것일까
**아래의 글은 순환종속 해결에 대하여 다루지 않습니다**
# 모듈은 왜 필요한가
1. 코드 베이스를 분리할 수 있다. 이를 통해 코드를 구조적으로 관리할 수 있다.
2. 코드를 재사용할 수 있게 해준다. 즉, 모듈화 된다.
3. 간단한 인터페이스만 노출할 수 있다. 즉, 은닉된다.
4. 종속성을 관리할 수 있게 해준다.
# CJS
브라우저가 아닌 환경에서 구동할 수 있도록 고안된 명세
## 노출식 모듈 패턴(revealing module pattern)
JS는 네임스페이스가 없다. 예를 들어, 여러개를 임포트 할 경우 같은 이름의 코드를 덮어 쓸 수 있다. 이런 식으로 스코프 오염 가능성이 내재 되어있다. 이를 해결하기 위해 네임스페스를 모방하는 동작을 많이 사용했는데, 이는 CJS의 바탕이 되었다.
노출식 모듈 패턴의 예는 다음과 같다.
```js
// RM_test를 네임스페이스처럼 활용
const RM_test_1 = (()=>({ a:() => 1, b:() => 'a', c:'hello!' }))();
const RM_test_2 = (()=>({ a:() => 9, b:() => 'z', c:'bye!' }))();

// RMP를 사용하여 네임스페이스를 분리한 것처럼 사용가능
RM_test_1.a()
RM_test_2.a()
```
## CJS의 탄생
CJS의 핵심
1. require는 로컬 파일 시스템으로부터 모듈을 임포트하게 해준다.
2. exports와 module.exports는 특별 변수로서, 현재 모듈에서 공개될 기능들을 내보내기 위해 사용된다. 즉, module.exports에 할당되지 않은 이상 모듈의 모든 내용은 private이다.

개략적 순서는 다음과 같다.
1. 모듈의 이름을 입력받는다. 이는 require.resolve에게 전달된다.
2. 모듈이 최초 로딩이라면, module객체(module = {exports:any})를 생성한다. 경로정보에 캐시된다. 이미 로딩되었다면 단지 cache hit이다.
3. 모듈의 public API라고 할 수 있는 module.exports가 호출자(require)에게 반환된다.

require함수는 동기적이다. 그러므로 비동기적으로 초기화되는 module.exports를 참조하지 못한다(예를 들어, 비동기 콜백 내에서 초기화). 초기에는 비동기 require도 지원했었다. 그러나 과도한 복잡성 때문에 곧 삭제되었다. 물론 개발을 하다보면 비동기적으로 초기화가 필요한 경우들도 생긴다. 이 때도 손쉽게 해결 가능하지만 require는 여전히 동기적이므로 추가적인 패턴이 필요하다.

## require.resolve
CJS는 file system을 통해서 모듈을 로드한다고 언급했다. 그렇다면 어떤 식으로 resolve하는 것일까. require는 모듈의 이름을 통해서 경로를 반환할 수 있는데, 다음 세 가지 알고리즘을 따른다.
1. 파일모듈: 이름이 /로 시작할 경우 절대 경로로 간주하고 탐색한다. ./로 시작하는 경우 상대경로로 간주하며 탐색 시작 위치는 요청한 모듈이다.
2. 코어모듈: 1의 경우가 아니라면 코어모듈부터 탐색한다.
3. 패키지모듈: 2에서 탐색을 실패하면 탐색 시작 위치는 요청 모듈이 된다. 시작 위치로부터 node_modules를 찾는다. node_modules를 찾으면 그 내부를 탐색한다.

코어 모듈을 제외하고, 파일 모듈과 패키지 모듈은 파일 혹은 디렉터리가 모두 moduleName과 일치할 수 있으므로, 탐색 알고리즘은 다음의 일치를 검사한다.
* <moduleName>.js
* <moduleName>/index.js
* <moduleName>/package.json의 main 속성에 지정된 디렉터리 혹은 파일
즉, 각종 설치 패키지에 index.js 혹은 package.json이 꼭 필요한 이유가 탐색 알고리즘 때문인 것이다.

위 내용이 시사하는 중요한 점은, 종속성 지옥을 매우 쉽게 해결할 수 있다는 것이다. 예를 들어, 디렉토리 위치가 다른 상태에서 node_modules를 분리한다면 같은 이름으로 require한다고 하더라도 다른 버전 혹은 다른 파일을 참조시키게 할 수 있다.
같은 이름의 패키지의 다른 버전이 필요한 경우는 자주 발생하므로 특히 유용하다고 할 수 있다.

## 몇 가지 모듈 정의 패턴들
### 1. named exports
이름 그대로다. exports객체에 명시적인 이름할당을 하는 방식이다.
```js
// info.js
exports.name = 'bjs';
exports.weight = 90;
// requiring module
const info = require('./info.js');
info.name;
info.weight;
```
### 2. 함수 내보내기(substack pattern)
module.exports 자체를 함수로 재할당하는 것. 어떤 모듈에 대한 명확한 단일 진입점을 제공하는 것에 의미가 있다. 이는 SRP에도 크게 의미가 있는데, 모든 모듈은 단일 기능에 대한 책임만을 가지며, 책임은 모듈에 의해 완전히 캡슐화 된다는 것이다.
```js
// logger.js
module.exports = (msg) => console.log(`info: ${msg}`)
module.exports.verbose = (msg) => console.log(`verbose: ${msg}`)
// requiring module
const logger = require('./logger.js');

logger('hi!');
logger.verbose('hello!');
```

### 3. 클래스 내보내기
프로토타입을 확장할 수 있는 가능성을 제공한다. require하는 모듈에서 인스턴스화 시킬 수 있다. 
### 4. 인스턴스 내보내기
인스턴스를 내보내는 가장 큰 의미는 singleton을 지키는 하나의 방안이 될 수 있다는 것인데, 사실 완전하지는 않다. 일단 인스턴스의 constructor에 접근해 새로운 인스턴스를 생성할 수 있다는 것이 첫 번째 문제이고, 두 번째 문제는 require의 resolve에 의해 여러 인스턴스가 실행될 수도 있다는 것이다.

### 5. Monkey patching 활용하기
일반적으로 monkey patching은 code smell로 평가되지만, 분명히 종종 사용되는 패턴이고 테스트를 하거나 프로덕션에까지 사용되는 경우가 더러 있으니 이해가 필요하다. 먼저, 위에서 예시로 살펴본 logger 모듈이 존재한다고 가정하고 다음의 예를 살펴보자. patcher.js는 module exports에 딱히 아무것도 할당하지 않다는 점에 주목하자.
```js
// patcher.js
require('./logger.js').error = (msg) => console.log(`error: ${msg}`)
// requiring module
require('./patcher.js');
const logger = require('./logger.js');
logger.error('olleh');
```
단순히 require만 하여 기존의 logger를 패치했다. 이후 logger를 가져와 사용하였다. 조금 더 현실적인 사용 시나리오를 예로 들면, 환경 변수에 따라 특정 모듈에 패치를 진행하는 것 따위일 것이다.
# ESM
향후 크게 지배적으로 성장하겠지만 현재는 CJS 코드의 양이 우세하다. ESM은 순환 종속성 해결과 비동기적 모듈 로드를 지원한다. CJS와 ESM의 가장 큰 차이는 바로 ES module은 static하다는 것이다. 이 때문에 dynamic하던 require와 달리 import문은 모듈 최상단에만 위치할 수 있으며, import할 모듈을 지정하는 문자열 또한 연산이 불가능한 상수문자열 뿐이다. 이는 tree shaking을 위한 종속성 트리 정적 분석을 가능하게 하는 요소이다.

## export
모듈 사용자에게 접근을 허용하는 개체를 지정하는 접두어
```js
// test.js
export const hello = 'hello';
export function func() {}
```
import시에는 하나 하나 임포트할 수도 있고, 모두 임포트할 수도 있다. 참고로 * 임포트는 namespace import라고 불린다.
```js
import * as test from './test'
// 이름 충돌 해결을 위한 as 사용
import { hello, func as testFunc } from './test'
```
## export default
export와 다르게 default 키워드가 추가되면 임포트하는 이름 자체를 지정할 수 있다.
export와 export default는 한 모듈에서 혼용가능하므로 때에 따라 사용하면 된다.
```js
// test.js
const obj = {a:()=>1, b:'hi'}
export default obj;
```
```js
import test from './test'
test.a();
test.b; 
```
## import 경로
import의 resolve 경로는 매우 직관적이므로 따로 설명이 필요하지는 않지만, 하나만 짚고 넘어가겠다. 먼저 네가지 경우를 살펴보자.
1. 상대경로
2. 절대경로
3. 노출 식별자('http', 'express'등 코어모듈 혹은 node_modules에서 import) 
4. 심층 임포트 식별자

1~3은 직관적이지만 4번이 의미하는 것은 무엇일까? 3번의 응용이라고 보면 된다.
예를 들어, import ... from 'express/lib/logger'와 같은 식으로, 3번의 노출 식별자로부터 출발해 원하는 경로를 지정하는 방식이다. 브라우저 JS의 URL 명시는 Node에서는 동작하지 않는다.
## ESM의 비동기 import
import는 분명 정적이라고 언급했는데 어째서 비동기 로딩을 할 수 있다는 것일까?
바로 import()를 지원하기 때문이다. 모듈 객체를 Promise로 반환한다. 예를 들어, 다음과 같이 비동기가 지원된다.
```js
const logger = await import('./logger');
```

# CJS와 ESM의 차이점과 상호 이용
1. ESM은 기본적으로 CJS의 'use strict'와 같은 환경으로 실행되며, 이를 변경할 수 없다. 이 점으로 인해 각종 CJS기능 및 __filename등의 참조를 사용할 수 없다. 대신 import.meta라는 특별 객체를 이용해 이 참조를 대신할 수 있다.

2. ESM에서 전역 this는 undefined이다. 그러나 CJS에서 전역 this는 exports와 같다.

상호 운용에 관한 힌트는 몇 가지로 압축된다.
1. ESM에서는 CJS를 import문을 이용해 사용가능하다. 그러나 이는 오직 default export동작으로 한정된다.
2. CJS에서 ESM을 require하는 것은 불가능하다.
3. ESM에서는 JSON을 직접 가져오는 것이 불가능하다. CJS에서는 가능하다.
4. 3을 극복하기 위하여 module.createRequire를 이용할 수 있다. 예를 들어 다음과 같다. 물론 json에만 한정되는 것은 아니고 require의 기능을 이용할 수 있다는 것이다.
```js
import { createRequire } from 'module'

const require = createRequire(import.meta.url);
const data = require('./data.json');
```
