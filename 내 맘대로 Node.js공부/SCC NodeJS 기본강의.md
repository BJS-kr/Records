## 1.index.js

0. const express = require('express');  
   https://medium.com/@chullino/require-exports-module-exports-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1d024ec5aca3

1. app = express();  
   https://stackoverflow.com/questions/27599614/var-express-requireexpress-var-app-express-what-is-express-is-it
   express()는 함수를 뜻합니다. 이것은 method도 아니고 constructor도 아닙니다. method는 object에 붙어있는 것입니다. 자바스크립트에서 method는 대부분 object를 통해 참조하는 함수입니다.      (ES2015에서 method syntax를 사용한다면 'super'에 액세스 해야하기 때문에 조금 다를 것입니다.)

   constructor는 'new' operator를 통해 호출하는 것입니다. 함수들이 무언가를 만들어낼지라도 그것을 'constructor'라고 부르지는 않습니다. 혼란을 피하기 위해서이며 대신 'creator'혹은 'builder'함수라고 부릅니다.

   express의 default export는 함수이면서 동시에 properties를 가진다는 점에서 특이합니다. 자바스크립트에선 완벽히 유효하나, 다른 언어들의 관점에선 특이할 수 있습니다. 이것이 app을 express()를 통해 만들면서도 express.static(/_..._/)와 같은 식으로 정적 파일들을 제어할 수 있는 이유입니다.

2. connect = require('./schemas');  
   connect();  
   schema 디렉토리에 있는 index.js에서 export하고 있는 connect함수를 참조. connect();로 실행(mongodb와 연결)  

3.  

```javascript
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
```

3-a) app.use란  
http://expressjs.com/en/4x/api.html#app.use
https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use

3-b) express().Methods  

3-b-1)express.urlencoded({extended: false})  
https://expressjs.com/ko/api.html#express.urlencoded

3-b-2)express.json()  
https://expressjs.com/ko/4x/api.html#express.json
 
3-b-3)express.static('public')  
https://expressjs.com/ko/4x/api.html#express.static

참고로, 위 페이지들에 명시되어있는 body-parser 혹은 server-static등은 third-party middleware로서 built-in middleware와 반대되는 개념입니다. 추가로 설치해서 사용해야 한다는 말입니다.
가장 많이 사용되는 third-party middlewares  
https://expressjs.com/en/resources/middleware.html


4. const goodsRouter = require("./routers/goods");  
   app.use("/api", [goodsRouter]);


http://expressjs.com/en/4x/api.html#app.use 를 보면,  
callback자리에는 An array of middleware functions가 들어올 수 있다고 명시 되어있다([goodsRouter]).  

5.  

```javascript
app.use((req, res, next) => {
  console.log(req);
  next();
});
```

path option이 없는 application level middleware이므로 이 구문보다 하위에 위치해 있는 모든 요청에 대해서 실행됩니다.  
middleware는 req -> res 주기가 끝나면 종료되게 되며 다음에 위치한 구문은 실행되지 않게 됩니다. 위의 예에서는 res응답이 없으므로 자동적으로 res를 실행할때까지 다음 함수로 넘어가게 됩니다.
5-a) next()  
https://expressjs.com/ko/guide/writing-middleware.html  
에 따르면, '현재의 미들웨어 함수가 요청-응답 주기를 종료하지 않는 경우에는 next()를 호출하여 그 다음 미들웨어 함수에 제어를 전달해야 합니다. 그렇지 않으면 해당 요청은 정지된 채로 방치됩니다.'라고 명시되어있다.

위 페이지의 첫번째 사용 예 (myLogger function사용)를 보면, 'LOGGED'라는 메세지는 root routing보다 위에 위치해있으므로 터미널에서 출력된다. res로 응답주기가 종료되지 않았으므로 next()를 통해 res를 찾아 아래로 이동하게 된다.

오해하지 말아야할것은, 꼭 app.use로만 미들웨어를 사용할 필요가 없다는 것이다. 예를 들어 get메소드로 진입하는 '/'라우팅을 처리해보자

```javascript
app.get("/", (req, res, next) => {
  console.log("logged");
  next();
});
```

미들웨어는 말 그대로 '중간장치'이다. res가 없다면 끝없이 뒤로 넘겨줄 수 있다. 좀 더 현실적인 예를 살펴보자  

```javascript
app.use((req, res, next) => {
  // 토큰 있니? 없으면 받아줄 수 없어!
  if (req.headers.token) {
    req.isLoggedIn = true;
    next(); // 토큰이 있다면 다음 처리장치로
  } else {
    res.status(400).send("invalid user"); // 토큰이 없으면 res로 오류 표시하고 응답 종료
  }
});
```

6.  

```javascript
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
```

https://expressjs.com/ko/guide/using-template-engines.html  
Express가 템플리트를 렌더링하려면 다음과 같은 애플리케이션 설정이 필요합니다.  

1. views, 템플리트가 있는 디렉토리. 예: app.set('views', './views')  
2. view engine, 사용할 템플리트 엔진. 예: app.set('view engine', 'pug')  

즉, 템플릿 엔진을 사용하기 위한 환경설정 reference를 따른 것입니다.  

7. app.get  
   get 뿐 아니라 http methods 중 하나로부터 파생되며 라우트 경로는, 요청 메소드와의 조합을 통해, 요청이 이루어질 수 있는 엔드포인트를 정의합니다. 라우트 경로는 문자열, 문자열 패턴 또는 정규식일 수 있습니다.

  패턴에 대한 공식문서 설명  
  https://expressjs.com/en/guide/routing.html  
  한글페이지에선 중요한 내용(route parameters)이 잘려있습니다.  

8. app.listen  
   http://expressjs.com/en/5x/api.html#app.listen_path_callback  
   지정된 호스트와 포트로 연결시킨다. 이 메소드는 node의 http.Server.listen()와 일치합니다. port가 생략되거나 0이라면 배정되지 않은 임의의 포트에 배정됩니다.  
   The app returned by express() is in fact a JavaScript Function, designed to be passed to Node’s HTTP servers as a callback to handle requests. This makes it easy to provide both HTTP and HTTPS versions of your app with the same code base, as the app does not inherit from these (it is simply a callback)
   The app.listen() method returns an http.Server object and (for HTTP) is a convenience method for the following:

```javascript
app.listen = function () {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
```
