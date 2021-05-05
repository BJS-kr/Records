
module.exports = {
  HTML:function(title, list, body, control){
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
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i += 1;
    }
    list +='</ul>';
    return list;
  },authorSelect:function(authors, author_id){
    var tag = '';
    var i = 0;
    while(i < authors.length){
      var selected = '';
      if(authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  }
}
// authorSelect에서, option 태그에 ' selected'가 들어가면 html문법상 select태그에서 그 option태그를 자동으로 기본으로 설정하기때문에 넣는 것.
// main.js에 연결되어있으므로 이 파일만 변경해도 자동으로 pm2가 웹 재시작해줌.
