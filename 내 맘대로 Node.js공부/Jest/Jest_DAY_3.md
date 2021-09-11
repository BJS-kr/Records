# SPY
난 지금까지 unit test를 위해 모든 의존성을 잘라내왔지만 꼭 어떤 외부 함수의 반환값이 필요하다면?
예를 들어 jwt라면 테스트 코드를 작성하는 페이지에 jwt를 임포트하고
```javascript
import jwt from 'jsonwebtoken'

jest.spyOn('jwt', verify)
```
요런 식이다. 그러니까 jest.fn()과의 차이점은 mock을 시켜서 함수를 대체하는 것이 아니고 단지 스파잉만 한다는 것이다.
요렇게 써서 꼭 결과를 받아봐야하는 상황이 필요할 수도 있다는 것이다.
내가 아직 테스트 코드를 많이 작성해보지 않아서 그런지 그게 왜 필요한 건지는 아직도 잘 모르겠다.
의존성이 필요하다면, 그러니까 unit test가 아니라면 그냥 그 모듈을 쓰면 되는 것 아닌가?
그게 아니라면, mock시키는게 테스트의 논리상 맞는 것 아닌가? 왜 검사해야하는 로직 말고 다른 것도 검사해야 하는 것인가?

어쨌든 구현해보았다.
```javascript
import searchAndPaginate from '../functions/search_paginate.js'

// 아무런 검색 조건도 없을 때
it('functions/searchAndPaginate case 1', async() => {
  const req = {
    body:
    {
      keyword: '', 
      region: '', 
      city: '', 
      traveler: 0, 
      guide: 0, 
      pageNum: undefined
    }
  }
  const next = () => {}
  const userPk = 1
  const connection = {
    beginTransaction: () => {},
    query:() => {},
    release:() => {}
  }
  const redis = {smembers: () => []}
  const querySpy = jest.spyOn(connection, 'query')
  querySpy.mockReturnValue(['some data'])
  
  const result = await searchAndPaginate(req, userPk, next, connection, redis)
  
  expect(querySpy).toBeCalledTimes(1)
  expect(querySpy.mock.calls[0][1].length).toBe(3)
  expect(result).toBe('some data')

  querySpy.mockRestore()
})

// 모든 조건이 다 채워져 있을 때
it('functions/searchAndPaginate case 2', async() => {
  const req = {
    body:
    {
      keyword: '레미', 
      region: '노원', 
      city: '서울', 
      traveler: 1, 
      guide: 1, 
      pageNum: 3
    }
  }
  const next = () => {}
  const userPk = 1
  const connection = {
    beginTransaction: () => {},
    query:() => {},
    release:() => {}
  }
  const redis = {smembers: () => []}
  const querySpy = jest.spyOn(connection, 'query')
  querySpy.mockReturnValue(['some data'])
  
  const result = await searchAndPaginate(req, userPk, next, connection, redis)
  
  expect(querySpy).toBeCalledTimes(1)
  expect(querySpy.mock.calls[0][1]).toEqual([1, 1, '레미*', '노원', '서울', (req.body.pageNum-1)*10])
  expect(result).toBe('some data')

  querySpy.mockRestore()
})
```
