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
```

사실 verification에는 한 가지 케이스가 더 있다. jwt.verify가 한 번은 실패하고 한 번은 성공하는 시나리오. 그런데 jest.fn()을 어떻게 한번만 적용 시키는지를 모르겠다.
아니면 다른 식으로 짜야하는 건가? 이틀차에는 해결 되겠지.
