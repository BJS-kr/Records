# Jest 1일차
난 너무 부족하다. 부족하디 부족하다. 자칭 백엔드 개발자가 테스트 코드를 못 짠다니 심히 부끄러운 일이다.
생각해보니 열 받아서 바로 시작하기로 했다.

그리고 느낀 점은,

1. 추상화의 끝은 테스트 코드가 아닐까...  
2. 테스트 코드를 안 짜는게 왜 미친짓인지 알 것 같다. 테스트 코드를 안 짜고 배포한다는건 테스트를 배포환경에서 돌리는 것과 같은거다.

그렇게 난해해보이던 개념들도 막상 몇 번 끄적여보니 다행히 눈에 보이긴 한다.

아무튼 오늘의 성과
```javascript
import xssFilter from '../middleware/xssFilter.js';
import verification from '../middleware/verification.js';
import jwt from 'jsonwebtoken'

it('middleware/xssFilter', async() => {
  const xss = jest.fn().mockImplementation(xssFilter)
  expect(xss({body:{1:'<script>merong</script>'}}, ()=>{}, ()=>{})).toBeTruthy()
})

it('middleware/verification case 1', () => {
  // 토큰이 정상적으로 들어올 경우
  const req = { cookies: {jwt:'user'}, headers: {token:'user'} }
  let res = { locals: {} }
  const next = jest.fn()
  
  jwt.verify = jest.fn(x=>x)
  verification(req, res, next)
  // res.locals.user should be assigned as user info
  expect(res.locals.user).toBe('user')
  // next should always be called only 1 time
  expect(next).toHaveBeenCalledTimes(1)
  // jwt, private key, algorithm
  expect(jwt.verify.mock.calls[0].length).toBe(3)
  // jwt.verify's first argument should be 'user'
  expect(jwt.verify.mock.calls[0][0]).toBe('user')
})

it('middleware/verification case 2', () => {
  // 토큰이 정상적으로 들어오지 않은 경우
  const req = { cookies: {jwt:'user1'}, headers: {token:'user2'} }
  let res = {}
  res.sendStatus = jest.fn(x=>x)
  const next = jest.fn()
  verification(req, res, next)
  expect(next).toHaveBeenCalledTimes(0)
  expect(res.sendStatus.mock.results[0].value).toBe(401)
})

it('middleware/verification case 3', () => {
  const req = { cookies: {jwt:'user'}, headers: {token:'user'} }
  let res = { locals: {} }
  const next = jest.fn(x=>x)
  jwt.verify = jest.fn(x=>{throw new Error()})
  verification(req, res, next)
  expect(next).toHaveBeenCalledTimes(1)
  expect(next.mock.results[0].value.status).toBe(401)
})

it('middleware/verification case 4', () => {
  const connection = {
    beginTransaction:()=>jest.fn(),
    query:()=>jest.fn((x, y) => [[{refreshToken:'refresh'}]]),
    release:()=>jest.fn()
  }

  const req = { 
    cookies: {jwt:'user', refresh: 'refresh'}, 
    headers: {token:'user'}}
  const res = {}
  // const res = {
  //   status:(code) => {
  //     return function cookie(tokenType, cookie, options) {
  //       return function json(data) {}
  //       }
  //   }
  // }

  const next = jest.fn(x=>x)
  jwt.verify = jest.fn().mockReturnValueOnce(new Error()).mockReturnValue(true)
  jwt.sign = jest.fn()
  // res.status().cookie().json = jest.fn()
  verification(req, res, next, connection)
  expect(next).toHaveBeenCalledTimes(0)
  // expect(res.status.mock.calls[0]).toBe(307)
})
```

~~사실 verification에는 한 가지 케이스가 더 있다. jwt.verify가 한 번은 실패하고 한 번은 성공하는 시나리오. 그런데 jest.fn()을 어떻게 한번만 적용 시키는지를 모르겠다.
아니면 다른 식으로 짜야하는 건가? 이틀차에는 해결 되겠지.~~

* 추가

의외로 특정 call마다 다른 값을 반납하게 하는 것은 쉬웠다.
난관은 다른 곳에 있었는데, res.status(arg).cookie(args).json(arg)이런 식으로 체인된 애들을 검증하기가 어려웠다.

verification 검증에 문제는 없다. jwt가 만료되고 refresh는 유효한 경우 next가 호출되지 않기 때문에 next의 호출 횟수가 0 인지검증하면 되기 때문이다.
체이닝 된 메서드들을 검증하는 법도 궁금하지만 새벽 5시니 일단 자고 일어난 후에 방법을 생각해봐야겠다. 
