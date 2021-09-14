# Dependency Injection

오늘은 테스트에서 아주 중요한 개념을 확실히 이해하게 됐다.
의존성 주입. 대충은 알고 있었지만 테스트 코드를 짜다보니 의존성 주입이 왜 필요한건지가 머릿속에 때려박듯이 이해된다.
수정하는 과정을 살펴보자

* 수정 전
```javascript
import { connection } from '../models/db.js'
import jwt from 'jswonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verification = (req, res, next) => {
  ...
}
```

* 수정 후
```javascript
import dotenv from 'dotenv'

dotenv.config()

const verification = (req, res, next, connection, jwt) => {
  ...
}
```
~~힘의 차이가 느껴지십니까?~~

별 차이 없어보일 수도 있으나 그러면 안된다. 위의 수정은 큰 의미를 지닌다.  
함수의 의존성을 직접 주입했으므로, 이제부터 함수는 connection과 jwt에 종속 되지 않는다. 즉, 분리와 재사용의 가능성이 현격히 높아졌다.
진정한 의미의 'unit'이 된 것이다.

빌드 업은 이만하면 됐고, unit을 완성했으니 unit test를 해볼 차례다.
수정한 전체 코드는 너무 길어서 하나의 테스트만 예로 들겠다.
```javascript
it('middleware/verification case 4', async() => {
  const connection = {
    beginTransaction: () => {},
    query:jest.fn().mockReturnValue([[{refreshToken:'refresh'}]]),
    release: () => {}
  }
  const req = { 
    cookies: {jwt:'user', refresh: 'refresh'}, 
    headers: {token:'user'}}
  const res = {
    status: code => ({
      cookie: (tokenType, option, algorithm) => ({
        json: data => ({code, tokenType, option, algorithm, data})
      })
    }),
  };
  const next = jest.fn()
  const jwt = {
    verify: jest.fn().mockReturnValueOnce(new Error()).mockReturnValue(1),
    sign: () => {}
  }
  
  const result = await verification(req, res, next, connection, jwt)
  
  expect(next).toHaveBeenCalledTimes(0)
  expect(result.code).toBe(307)
})
```
보이는가? 함수가 동작하는데 필요한 모든 것을 직접 정의하여 주입하였다.  
(사실 거창하게 말했지만 jest가 지원하는 jest.fn()을 사용하면 의존성 주입안해도 주입한 것처럼 테스트 할 수 있다..)  

우리는 우리보다 뛰어난 개발자들이 이미 모든 테스트를 마친 AAA급 모듈들을 테스트할 필요가 없다.  
우리가 테스트하려는 것은 우리가 짠 로직이지 MySQL이 아니라는 말이다. 그러기 위해선 모든 의존성을 잘라내야 한다. 

~~그래야 unit test다
* 21/09/14 수정

굳이 모든 의존성을 자르진 않아도 unit테스트에 포함되긴 한다고 한다.
그래도 내 생각엔 테스트하면서 DB 부하 줄 바에야 stub하는게 낫다고 생각한다.









