const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){// request는 브라우저가 서버에게, response는 반대.
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
               <a href="/update?id=${title}">update</a>
               <form action="delete_process" method="post">
                 <input type="hidden" name="id" value="${title}">
                 <input type="submit" value="delete">
               </form>
               `);
              // 홈화면에는 update 버튼이 없고, 목록중 하나를 선택했을때만 업데이트 버튼이 뜨도록
              // delete는 절대로 get방식(querystring이 있으면 다 get방식)으로 구현해선 안된다. 그거 따서 다 조지기 가능.
              // 그래서 form으로 구현한것.
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,'');
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
      });
      request.on('end', function(){
        var post = qs.parse(body);
        // qs라는 nodejs의 모듈의 parse함수. console.log(post)해보면 딕셔너리 형태로 title과 description이 추출된 것을 볼수 있음.
        var title = post.title;
        var desc = post.description;
            // use post['blah'], etc.
        fs.writeFile(`data/${title}`, desc,'utf-8', function (err) {
          if (err) return console.log(err);
           response.writeHead(302, {Location: `/?id=${title}`}); //페이지를 다른곳으로 리다이렉션하라는 서버의 신 302
           response.end(); // 괄호에 아무 문자 넣으면 모든 작업끝나고 그 문자 출력되는거임.
        });
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" value="${title}"></p>
                <p>
                  <textarea name="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
            `<a href="/create">create</a> <a href="update?id=${title}">update</a>`);
            // 홈화면에는 update 버튼이 없고, 목록중 하나를 선택했을때만 업데이트 버튼이 뜨도록
            // <input type="hidden" name="id" value="${title}">가 없으면 제목을 수정하는 경우
            // 수정된 제목을 서버에서 찾게되어 오류가 난다. 원래 제목값을 id:${title}로 검색할수 잇도록 넣어주는것.
            // 태그 내 value는 기본값 설정 기능.
          response.writeHead(200);
          response.end(template);
        });
      });

    } else if (pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
        if (body.length > 1e6)
            request.connection.destroy();
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id; // update에서 hidden태그를 통해 name = 'id' 값을 추가했으니 여기선 id값을 새로운 변수로 받는다.
        var title = post.title;
        var desc = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err){
          fs.writeFile(`data/${title}`, desc,'utf-8', function (err) {
            if (err) return console.log(err);
             response.writeHead(302, {Location: `/?id=${title}`});
             response.end();
          })
        });
      });
    } else if (pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
        if (body.length > 1e6)
            request.connection.destroy();
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id; // update에서 hidden태그를 통해 name = 'id' 값을 추가했으니 여기선 id값을 새로운 변수로 받는다.
        fs.unlink(`data/${id}`, function(err){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }



});
app.listen(3000);
