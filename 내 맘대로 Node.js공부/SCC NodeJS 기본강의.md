# index.js

## 0. const express = require('express');  
   https://medium.com/@chullino/require-exports-module-exports-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1d024ec5aca3

## 1. app = express();  
   https://stackoverflow.com/questions/27599614/var-express-requireexpress-var-app-express-what-is-express-is-it  
   express()는 함수를 뜻합니다. 이것은 method도 아니고 constructor도 아닙니다. method는 object에 붙어있는 것입니다. 자바스크립트에서 method는 대부분 object를 통해 참조하는 함수입니다.      (ES2015에서 method syntax를 사용한다면 'super'에 액세스 해야하기 때문에 조금 다를 것입니다.)

   constructor는 'new' operator를 통해 호출하는 것입니다. 함수들이 무언가를 만들어낼지라도 그것을 'constructor'라고 부르지는 않습니다. 혼란을 피하기 위해서이며 대신 'creator'혹은 'builder'함수라고 부릅니다.

   express의 default export는 함수이면서 동시에 properties를 가진다는 점에서 특이합니다. 자바스크립트에선 완벽히 유효하나, 다른 언어들의 관점에선 특이할 수 있습니다. 이것이 app을 express()를 통해 만들면서도 express.static(/_..._/)와 같은 식으로 정적 파일들을 제어할 수 있는 이유입니다.

## 2. connect = require('./schemas');  
   connect();  
   schema 디렉토리에 있는 index.js에서 export하고 있는 connect함수를 참조. connect();로 실행(mongodb와 연결)  

## 3. 하단 코드 참조

```javascript
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
```

### 3-a) app.use란  
http://expressjs.com/en/4x/api.html#app.use
https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use

### 3-b) express().Methods  

### 3-b-1)express.urlencoded({extended: false})  
https://expressjs.com/ko/api.html#express.urlencoded

### 3-b-2)express.json()  
https://expressjs.com/ko/4x/api.html#express.json
 
### 3-b-3)express.static('public')  
https://expressjs.com/ko/4x/api.html#express.static

참고로, 위 페이지들에 명시되어있는 body-parser 혹은 server-static등은 third-party middleware로서 built-in middleware와 반대되는 개념입니다. 추가로 설치해서 사용해야 한다는 말입니다.
가장 많이 사용되는 third-party middlewares  
https://expressjs.com/en/resources/middleware.html


## 4. const goodsRouter = require("./routers/goods");  
   app.use("/api", [goodsRouter]);


http://expressjs.com/en/4x/api.html#app.use 를 보면,  
callback자리에는 An array of middleware functions가 들어올 수 있다고 명시 되어있다([goodsRouter]).  

## 5. 하단 코드 참조

```javascript
app.use((req, res, next) => {
  console.log(req);
  next();
});
```

path option이 없는 application level middleware이므로 이 구문보다 하위에 위치해 있는 모든 요청에 대해서 실행됩니다.  
middleware는 req -> res 주기가 끝나면 종료되게 되며 다음에 위치한 구문은 실행되지 않게 됩니다. 위의 예에서는 res응답이 없으므로 자동적으로 res를 실행할때까지 다음 함수로 넘어가게 됩니다.  


### 5-a) next()  
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

## 6. 하단 코드 참조

```javascript
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
```

https://expressjs.com/ko/guide/using-template-engines.html  
Express가 템플리트를 렌더링하려면 다음과 같은 애플리케이션 설정이 필요합니다.  

1. views, 템플리트가 있는 디렉토리. 예: app.set('views', './views')  
2. view engine, 사용할 템플리트 엔진. 예: app.set('view engine', 'pug')  

즉, 템플릿 엔진을 사용하기 위한 환경설정 reference를 따른 것입니다.  

## 7. app.get  
   get 뿐 아니라 http methods 중 하나로부터 파생되며 라우트 경로는, 요청 메소드와의 조합을 통해, 요청이 이루어질 수 있는 엔드포인트를 정의합니다. 라우트 경로는 문자열, 문자열 패턴 또는 정규식일 수 있습니다.  

  패턴에 대한 공식문서 설명  
  https://expressjs.com/en/guide/routing.html  
  한글페이지에선 중요한 내용(route parameters)이 잘려있습니다.  

## 8. app.listen  
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

## ※mongoose의 Schema를 살펴보기 전에  
### 1. 데이터 모델링이 왜 필요한가?  
데이터 모델링에 관한 이론들은 너무 방대해서, 여기에 정리하기엔 목적성을 잃게된다.

(SQL vs NoSQL 데이터모델링 비교)
https://cyberx.tistory.com/166
가장 핵심적으로, NoSQL은 RDBMS와 달리 유연한 스키마(Schema-less)구조를 취함으로서
다양한 형태의 데이터를 저장할 수 있음. 데이터간 관계를 정의하지 않음. 
그러나, 다양한 형태로 RDBMS의 장점을 취할 수도 있음. 특히 몽고db의 형태인
Document Key/Value Store 방식은 구조화된 데이터타입(JSON,XML,YAML 등) 을 사용함으로서 복잡한 계층구조 표현을 가능케하고, Sorting, Join, Grouping과 같은 RDBMS의 기능들을 사용할 수 있게 한다. 

지금 살펴보는 코드에 적용할 수 있는 예는, subdocument방식으로 join의 장점을 일부 취하는 것이다. mongoose에서 subdocument는 Schema안에 Schema를 정의해둠으로서 구현 할 수 있다. 

우리가 보아야할 핵심은 mongoose에서 다양한 형태의 스키마를 자유롭게 정의하고 있는 것이다. NoSQL의 Schema-less적인 특징을 정확히 보여주고 있다.  

### 2. mongoose가 필요한 이유?  
NoSQL은 데이터 정형화를 보장할 수 없는 대신 RDBMS에 비해 확장이 용이하고, 대용량 데이터를 빠르게 처리할 수 있다.   

오해하지 말아야할 것은, NoSQL이라고 해서 Schema가 필요없다는 것이 아니라는 것이다. SQL의 Schema는 유연성이 매우 떨어진다. NoSQL은 Schema를 사용하지 말아야하는 경우(정형화 되지 않은 데이터들을 수집)나, NoSQL을 주로 사용하더라도 일부 정형화가 필요한 부분 , 혹은 Schema를 사용하더라도 형식을 변경하는등 유연한 대처가 필요한 상황에서 사용하는 것이다.  

즉, RDBMS의 장점은 취하고 제한은 버린다는 취지로 이해하면 좋다.  
물론 관계형 데이터베이스가 제공하는 강력한 기능들은 상당부분 제한 된다.  

# Schemas  
1. const { Schema } = mongoose;  
https://stackoverflow.com/questions/41058569/what-is-the-difference-between-const-and-const-in-javascript/41058622  

2. goodsSchema = new Schema({})  
mongoose의 스키마 정의하는 모습입니다. mongoose는 ODM(Object Data Mapping)기능을 제공하는 Node.JS모듈입니다. Object와 Document를 1:1로 매칭한다는 뜻인데, Object는 표현식에서 알 수 있듯이 new를 통해 새로운 객체를 생성하고 있습니다. Document는 mongodb에 저장된 문서를 뜻합니다. 이는 mongodb가 JSON,XML,YAML등의 형태를 취한 다는 배경을 통해 이해할 수 있습니다.  

코드에서 보이는 goodsId, name, price등은 객체의 각 프로퍼티가 되어 mongodb에 저장됩니다. type을 통해 데이터 형식을 지정할 수 있고 required, unique등을 통해 필수여부, 중복금지여부 등을 지정할 수 있습니다.  
세부적인 사용법은 mongoose reference를 참조해야합니다.  

## subdocument
강의에선 사용하지 않았지만 mongooose가 제공하는 강력한 기능. NoSQL임에도 불구하고 join의 특징을 일부 활용하듯 사용가능.  
https://dalkomit.tistory.com/120?category=542197

# routers/goods.js  
## 1. 하단 코드 참조
```javascript
const Goods = require("../schemas/Goods");
const Cart = require("../schemas/Cart");
```

require는 exports를 반환한다는것을 앞서 살펴보았다.  
schemas의 goods.js와 cart.js의 하단에 mongoose.model 메소드를 통해 "Goods","Cart"로 각 스키마를 exports한 것을 살펴볼수 있다.   

## 2. const router = express.Router();  

https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get  
app 과 router를 왜 분리하는가? 코드 정리를 넘어서 서버 설계가 굉장히 용이 해지기 때문이다. var app = express()이 있는 페이지는 'main app'으로 생각하고, var router = express.Router()가 있는 페이지는 'mini app'으로 생각해보자. main과 mini는 굉장히 유사한 구조를 가지고 있다. 

일단 파일을 분리해두면 main app 파일을 어지럽히지 않아도 된다. 두번째로 각 routing에 적합한 로직을 각 파일에서 따로 구현할 수 있다. 여러 미들웨어를 활용하여 배치 순서에 따라 로직을 구현하는 express에서 이점은 매우 중요한 것이다. 분리된 파일들은 서로 영향을 주지 않을 것이므로 설계가 용이해지는 것이다.

분리된 router들에 모두 영향을 미치는 미들웨어가 존재한다면(예를 들어, 로그인 상태 검사) 'main app'페이지에서 app.use로 router들을 끌어오는 위치보다 위에 그 미들웨어를 배치하는 식으로 구성하는 것이다.   

## 3. get('/goods')의 try, catch  
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/try...catch  
try, catch,finally는 예외처리 구문이다. 파이썬의 try,else,finally와 동일한 기능이다. 예외처리의 다양한 기법은 링크 참조. 

## 4. get('/goods')의 next(err)  
사실 nodejs기초반에서의 코드에선 불필요한 부분이다. 왜냐면 errorhandler가 코드상에 존재하지 않기 때문이다. 다른 함수들은 req,res,next 세개를 인수를 가지는 반면에 errorhandler함수는 err,req,res,next 네개를 인수로 가진다. 에러핸들러 middleware가 존재할경우 모든 에러는 에러핸들러로 직행하게 된다. next(err)은 바로 그 지시이다.

## 5. post('/goods')  
수업중 insomnia를 사용해 물건 목록을 추가할때, insomnia의 요청주소를 apis/goods로 지정하고 method를 post로 지정했다. 그때 json 형식을 사용해서 물건의 정보를 입력한 것이 바로 앞서살펴본 mongodb의 특징때문이다. "Goods"라는 명칭으로 exports된 goodsSchema의 항목들에 내용을 넣고 insomnia로 요청하면 isExist.length를 통해 goodsId를 검사해 중복되는 개체를 검증하고 없다면 req.body 객체에서 받아온 각 항목들을 Goods스키마에 적용시켜 그대로 create하게 된다. 

## 6. /goods/:goodsId/cart  
:용법은 req.params의 프로퍼티 항목을 지정하는 것이다.:goodsId에 넣어진 값이 곧 프로퍼티의 데이터가 되어 post된다.  예를 들어 /goods/:goodsId/cart의 경우 req.params = {goodsId : 3} 과 같은 형식으로 구성되어 서버에 도착하게 된다. 함수를 살펴보면, goodsId는 살펴본대로 const { goodsId } = req.params;과 같은 모습으로 식별자를 정의하고 있고, const { quantity } = req.body;로  정의되고 있는 모습을 볼 수 있다.

## 7. /cart  
원래는 사용자의 정보를 가져와서 장바구니를 가져와야하므로 req 객체도 작동해야겠지만, 기초반에서 만든 페이지는 로그인 정보가 없으므로 장바구니 정보 전체를 불러오게 된다. 즉 req는 필요없고 res만 필요하게 된다. /cart에서 쓰인 map함수는 각 객체에 대해 주어진 함수를 실행하여 새로운 배열을 만들어 반환하는 함수이다. 즉 goodsId는 cart의 각 요소의 goodsId를 반환받은 것이다. goodsInCart는 voyage db의 Goods 테이블의 "goodsId"항목이 위에서 정의한 goodsId배열에 포함된다면 find(조건에 맞는 모든 요소 반환)하여 배열을 반환받는 것이다. concatCart는 cart의 모든 요소(Cart 테이블의 모든 항목)에 대하여 goodsInCart의 길이(==cart길이==goodsId길이)만큼 순환하며goodsInCart[i].goodsId가 cart.goodsId와 같다면(map 때문에 cart는 각 항목이 순환 중) cart의 quantity와 goods의 goodsInCart[i]를 객체형태로 반환. 다시 res에서 json형태로 반환.이후 프론트페이지에서 json의 정보를 가지고 장바구니 물품을 표시합니다.
