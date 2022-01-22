/** Artillery
* npm에 올라와있는 스트레스 테스트 패키지다. 헤더, 값, 시나리오 등 꽤 디테일하게 테스트가 가능하니 자세한 내용은 https://www.artillery.io/을 참고하자
* 기본적으로 cli로 실행해야하지만, 꽤나 불편하게 느껴진다. std 아웃풋, 에러 등을 추적할거면 누구나 사용하기 쉽게 코드로 만드는게 어떤가 싶었다. 그리고 결과를 만들고 브라우저에 띄워주는 기능도 존재하는데,
* 한번에 모두 실행하고 싶었다. 마지막으로 YAML기반으로 동작한다는게 불편했다 :(... 함수의 인자에 따라 YAML파일이 자동으로 생성되도록 제작했다 :)!
*/

// 아래는 단순 방문만 하는 기능이지만, YAML을 수정함으로써 다채로운 테스트 스크립트로 변형 시킬 수 있다.
const { exec } = require('child_process');
const YAML = require('js-yaml');
const fs = require('fs');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function artillery(
  targetURL,
  flowPath,
  duration,
  arrivalRate
) {
  const objectToBeYAML = {
    config: { target: targetURL, phases: [ { duration, arrivalRate } ] },
    scenarios: [ { flow: [ { get: { url: flowPath } } ] } ],
  };

  fs.writeFile('attacker.yml', YAML.dump(objectToBeYAML), (e) => {
    if (e) console.error(e);
    else {
      exec(
        'npx artillery run -o attack_result.json ./attacker.yml',
        (e, so, se) => {
          if (e) console.error('while run:', e);
          else {
            if (se) console.warn('while run:', se)
            if (so) console.log('while run:', so);
            exec('npx artillery report attack_result.json', (e, so, se) => {
              if (e) console.error('while report:', e);
              else { 
                if (se) console.warn('while report:', se);
                if (so) console.log(so) 
                exec(
                  'open -a "google chrome" attack_result.json.html',
                  (e, so, se) => {
                    if (e) console.error('while open:', e);
                    else {
                      if (se) console.warn('while open:', se);
                      if (so) console.log('while open:' , so);
                    } 
                  }
                );
              }
            });
          }
        }
      );
    }
  });
}

artillery('http://localhost:8080', '/', 10, 10);

// 디펜던시는 artillery와 js-yaml 두 개 뿐이다. 스트레스 테스트 자동화 끝~
