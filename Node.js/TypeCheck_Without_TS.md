# Type Check는 TS에서만 가능한가?
최근 완성한 hang프로젝트는 TS를 사용하지 않았다. 그로 인해 서버로 전달되는 값들을 검증할 수 없는 문제가 있었다.  
테스트 코드를 작성하면서 이를 보완해야할 필요성을 느꼈고 방법을 알아보게 되었다.  
타입 체크는 Object.prototype.toStirng 으로 가능했다.  
여기에 call을 붙여 thisArg를 전달하면 this의 type을 반환한다.  
이를 이용해 type을 검사할 수 있는데, 함수로 만드는 예시는 다음과 같다.  

```javascript
// String값만을 받아야 할 때 이 와 같이 체크 가능하다.
function typeChecker(val) {
    return Object.prototype.toString.call(val).slice(8, -1) === 'String'
  }
```
실제 express router 콜백에 적용한 모습은 다음과 같다.
```javascript
const POST_duplicate = (connection) => {
  function typeChecker(val) {
    return Object.prototype.toString.call(val).slice(8, -1) === 'String'
  }
  return (
    async(req, res, next) => {
      const { userId, nickname } = req.body;
      
      if (
          !(
            ((userId && !nickname) && typeChecker(userId)) || 
            ((nickname && !userId) && typeChecker(nickname))
           )
         ) return res.sendStatus(409)
      
      const sequel = 
        userId
        ? `SELECT userPk FROM users WHERE userId=?`
        : `SELECT userPk FROM users WHERE nickname=?`;
      const input = userId ?? nickname;
      try {
        await connection.beginTransaction();
        const isUserNicknameExists = await connection.query(sequel, [input]);
        isUserNicknameExists[0].length > 0 ? res.sendStatus(409) : res.sendStatus(200)
      } catch (err) {
        next(err);
      } finally {
        await connection.release();
      }
    }
  )
}
```
