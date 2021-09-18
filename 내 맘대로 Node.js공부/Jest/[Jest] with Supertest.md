# supertest
supertest는 HTTP 통신을 테스트 할 수 있는 패키지이다.  
사용법은 그리 어렵지 않다. 다음과 같이 테스트 해볼 수 있고   
메소드, body, 헤더 등 HTTP 통신과 관련된 요소들을 상세히 설정하는 것도 가능하다.
```javascript
import supertest from 'supertest';
import app from './app';

it('test', async()=>{
  const res = await supertest(app).get('/api/users/b')
    expect(res.text).toBe('merong')
    expect(res.text).not.toBe('babo')
})
```

# 그런데 문제가?
곧장 supertest를 적용하려고 했으나, 두 가지 고민이 생겼다.

## supertest는 기본적으로 통합 테스트이다.
supertest는 서버를 실행시킨다. 즉, 실제로 서버가 실행되는데 필요한 모든 의존성이 필요하다는 것이다.  
예를 들어, 서버가 DB를 사용 한다면 실제로 DB도 실행되는 것이다.  

이로 인한 첫 번째 문제는,  
테스트가 종료된 이 후에도 유지된 의존성들에게서 오류가 발생한다는 점이다. 이는 jest의 CLI option인 --detectOpenHandles로 확인할 수 있다.

두 번째 문제는,  
테스트 환경이 배포 환경과 다를 경우 오류가 발생한다는 점이다.  
예를 들어 hang은, 배포 환경에는 ubuntu18.04에  contianer로 redis-cluster가 구성되어 있지만 내가 개발한 컴퓨터에는 redis-cluster가 구성되어 있지 않다.  
물론 이건 supertest의 문제라기보다 애초에 개발 환경을 배포 환경과 통일하지 않은 내 탓이다.  
Docker image 커밋해서 쓸 걸 하는 후회가 많이 남는다 ㅠ 개발 환경과 배포 환경을 통일해야 하는 이유를 깨닫게 되는 공부였다.

## 다시 unit test
내가 해결한 방식은 router의 콜백을 controller로 분리해서 테스트하는 것이다. 즉 통합 테스트와는 거리가 멀어졌다...ㅠㅠ  
뭐 물론 모든 단계에서 unit test가 이루어지는 것이 정석이므로 unit test를 다 작성하지 않은 나에겐 또 좋은 공부가 되었지만...  
그래도 통합 테스트를 하지 못한 것은 아쉽다. 다음 개발이나 프로젝트는 반드시 컨테이너를 활용해 모든 개발과 배포의 환경을 통일해야겠다

/api/users/sms_auth의 callback을 분리해서 테스트:  
```javascript
import { sms_auth } from '../routes/controllers/users.js'

// status 1 && query 반환 값이 없는 경우
it('router users/sms_auth case 1', async() => {
  const req = {body: { pNum: '01011112222', status: 1 }}
  const res = {sendStatus: jest.fn()}
  const next = () => {}
  const connection = {
    beginTransaction: () => {},
    query:jest.fn().mockReturnValue([[]]),
    rollback:()=>{},
    release:jest.fn()
  }
  const NC_SMS = jest.fn()
  const redis = {set: jest.fn()}
  
  await sms_auth(req, res, next, connection, NC_SMS, redis)

  expect(NC_SMS.mock.calls[0][2]).toBeGreaterThan(10000)
  expect(NC_SMS.mock.calls[0][2]).toBeLessThan(100000)
  expect(NC_SMS.mock.calls[0][2]).toBe(redis.set.mock.calls[0][1])
  expect(connection.query.mock.calls[0][1][0]).toBe(req.body.pNum)
  expect(connection.release).toHaveBeenCalledTimes(1)
  expect(res.sendStatus.mock.calls[0][0]).toBe(200)
})

// status 1 && query 반환 값이 존재 할 경우
it('router users/sms_auth case 2', async() => {
  const req = {body: { pNum: '01011112222', status: 1 }}
  const res = {sendStatus: jest.fn()}
  const next = () => {}
  const connection = {
    beginTransaction: () => {},
    query:jest.fn().mockReturnValue([['user']]),
    rollback:()=>{},
    release:jest.fn()
  }
  const NC_SMS = jest.fn()
  const redis = {set: jest.fn()}
  
  await sms_auth(req, res, next, connection, NC_SMS, redis)
  
  expect(connection.query.mock.calls[0][1][0]).toBe(req.body.pNum)
  expect(connection.release).toHaveBeenCalledTimes(1)
  expect(res.sendStatus.mock.calls[0][0]).toBe(409)
})

// 에러 발생 할 경우
it('router users/sms_auth case 3', async() => {
  const req = {body: { pNum: '01011112222', status: 1 }}
  const res = {sendStatus: jest.fn()}
  const next = () => {}
  const connection = {
    beginTransaction: () => {},
    query:jest.fn().mockReturnValue(new Error()),
    rollback:jest.fn(),
    release:jest.fn()
  }
  const NC_SMS = jest.fn()
  const redis = {set: jest.fn()}
  
  await sms_auth(req, res, next, connection, NC_SMS, redis)
  
  expect(connection.query.mock.calls[0][1][0]).toBe(req.body.pNum)
  expect(connection.release).toHaveBeenCalledTimes(1)
  expect(connection.rollback).toHaveBeenCalledTimes(1)
  expect(res.sendStatus).toHaveBeenCalledTimes(0)
})

// status가 0이라면 query를 거치지 않음
it('router users/sms_auth case 4', async() => {
  const req = {body: { pNum: '01011112222', status: 0 }}
  const res = {sendStatus: jest.fn()}
  const next = () => {}
  const connection = {
    beginTransaction: () => {},
    query:jest.fn().mockReturnValue(new Error()),
    rollback:jest.fn(),
    release:jest.fn()
  }
  const NC_SMS = jest.fn()
  const redis = {set: jest.fn()}
  
  await sms_auth(req, res, next, connection, NC_SMS, redis)
  
  expect(connection.query).toHaveBeenCalledTimes(0)
  expect(connection.release).toHaveBeenCalledTimes(1)
  expect(NC_SMS).toHaveBeenCalledTimes(1)
  expect(connection.rollback).toHaveBeenCalledTimes(0)
  expect(res.sendStatus).toHaveBeenCalledWith(200)
})
```
