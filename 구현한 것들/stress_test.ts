/** 
* Artillery
* npm에 올라와있는 스트레스 테스트 패키지다. 헤더, 값, 시나리오 등 꽤 디테일하게 테스트가 가능하니 자세한 내용은 https://www.artillery.io/을 참고하자
* 기본적으로 cli로 실행해야하지만, 꽤나 불편하게 느껴진다. std 아웃풋, 에러 등을 추적할거면 누구나 사용하기 쉽게 코드로 만드는게 어떤가 싶었다. 그리고 결과를 만들고 브라우저에 띄워주는 기능도 존재하는데,
* 한번에 모두 실행하고 싶었다. 마지막으로 YAML기반으로 동작한다는게 불편했다 :(... 함수의 인자에 따라 YAML파일이 자동으로 생성되도록 제작했다 :)!
*/

import { exec as 실행 } from 'child_process';
import 야믈 from 'js-yaml';

const fs = require('fs');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

type Strategy = {
  [Method in 'post' | 'get' | 'delete' | 'put' | 'patch']?: {
    url: string;
    json?: { [key: string]: number | string | any[] };
  };
};

type Flows = { flow: Strategy[] }[];

type ObjectToBeYAML = {
  config: {
    target: string;
    phases: { duration: number; arrivalRate: number }[];
  };
  scenarios: Flows;
};

function artillery(
  targetURL: string,
  duration: number,
  arrivalRate: number,
  strategies: Strategy[],
  report: boolean
) {
  const objectToBeYAML: ObjectToBeYAML = {
    config: { target: targetURL, phases: [{ duration, arrivalRate }] },
    scenarios: [{ flow: strategies }],
  };

  fs.writeFile('attacker.yml', 야믈.dump(objectToBeYAML), (e: any) => {
    if (e) console.error(e);
    else {
      실행(
        'npx artillery run -o attack_result.json ./attacker.yml',
        (e, so, se) => {
          if (e) console.error('while run:', e);
          else {
            if (se) console.warn('while run:', se);
            if (so) console.log('while run:', so);
            실행('npx artillery report attack_result.json', (e, so, se) => {
              if (e) console.error('while report:', e);
              else {
                if (se) console.warn('while report:', se);
                if (so) console.log(so);
                if (report) {
                  실행(
                    'open -a "google chrome" attack_result.json.html',
                    (e, so, se) => {
                      if (e) console.error('while open:', e);
                      else {
                        if (se) console.warn('while open:', se);
                        if (so) console.log('while open:', so);
                      }
                    }
                  );
                }
              }
            });
          }
        }
      );
    }
  });
}

const strategy_1 = {
  post: {
    url: '/ttv/api/kafka',
    json: {
      email: '즐즐',
      date: 'gkgk',
      index: 1,
    },
  },
};

const strategy_2: Strategy = {
  post: { url: '/ttv/api/kafka', json: { random: 'haha' } },
};

const strategies: Strategy[] = [strategy_1, strategy_2];

artillery('http://localhost:3000', 10, 10, strategies, false);
// Dependency는 타입스크립트를 사용중이라는 전제하에 js-yaml과 artillery뿐이다.
