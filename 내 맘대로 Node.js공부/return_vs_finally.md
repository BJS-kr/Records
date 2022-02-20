# return vs finally, 누가 우선권을 가지는가?  
hang project를 진행할 때, 위 질문에 대한 대답을 정확히 알지 못해 코드가 상당히 아름답지 못했다. 예를 들어,  
```javascript
try {
    await connection.beginTransaction();
    const data = await connection.query(sequel, inputs);
    await connection.release(); // return이 있어서 finally가 실행 안될까봐 넣어 둠
    return JSON.parse(JSON.stringify(data[0]));
  } catch (err) {
    await connection.rollback();
    await connection.release();
    next(err);
  }
```

지금 보면 상당히 웃긴 코드다.  
왜냐하면 return이 finally를 실행시키지 않을까봐 try-catch에 release를 욱여넣은 형태이기 때문이다.  

이런 걱정은 할 필요가 없다.   
finally block이 존재할 경우, finally 이전의 return은 잠시 '억류(suspended)'되고 finally가 실행된 후 값을 반환하게 된다.   

즉 위와 같은 코드는 다음과 같이 수정되어야 한다.  
```javascript
try {
    await connection.beginTransaction();
    const data = await connection.query(sequel, inputs);
    return JSON.parse(JSON.stringify(data[0]));
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    await connection.release();
  }
```

이에 관한 자세한 내용은 공식문서에서 자세히 확인 할 수 있다.

https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
