/**
* docker-compose의 profile을 사용해 구현했습니다.
* ENV에 맞춰 인자를 할당합니다.
* app bootstrapping 시 혹은 test시 매우 유용하게 사용 중 입니다.
*
* 특히 test에 맞춰 container의 life-cycle을 동기화 시켜 테스트가 매우 간편해졌습니다.
* database혹은 cache memory등을 mocking 할 필요 없이 컨테이너 데이터의 persitency를 유지하지 않음으로써, production 환경과 동일한 환경에서 테스트를 진행할 수 있습니다.
*
* 이는 microsoft 공식 문서에서도 권장하는 방식입니다.
* https://docs.microsoft.com/ko-kr/dotnet/architecture/microservices/multi-container-microservice-net-applications/multi-container-applications-docker-compose
*/

// 만약 도커가 실행 중이지 않다면, 도커부터 실행합니다.
// 프로필에 맞춰 컨테이너를 구동하는 함수와 종료하는 함수로 이루어져 있습니다.
// 도커의 구동 상태를 체크 및 구동하는 스크립트는 아래와 같습니다.

/**
* #!/bin/bash
* 
* if (! docker stats --no-stream ); then
*  open /Applications/Docker.app
*
* while (! docker stats --no-stream ); do
*  echo "Waiting for Docker to launch..."
*  sleep 5
*
* done
* fi
*/

import { exec } from 'child_process'

type NodeEnv = 'production'|'develop'|'test'

// 도커 구동 및 프로필에 맞추어 컨테이너 구동
async function prepareDockerEnvironment(
  runtimeEnv: 'e2e_test' | NodeEnv,
  ) {
    await new Promise((resolve, reject) => {
      exec(`/bin/bash ./docker_starter.sh`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        if (stdout) {
          resolve(stdout);
        }
        if (stderr) {
          resolve(stderr);
        }
      });
    })
      .catch(error => {
        throw error;
      })
      .then(async result => {
        console.log('Open Docker, only if is not running...\n', result);
        await new Promise((resolve, reject) => {
          exec(
            `docker compose --profile ${runtimeEnv} up -d`,
            (error, stdout, stderr) => {
              if (error) {
                return reject(error);
              }
              if (stdout) {
                return resolve(stdout);
              }
              if (stderr) {
                // 정확한 이유는 알 수 없으나 stderr로 결과가 출력됩니다.
                return resolve(stderr);
              }
            },
          );
        })
          .catch(error => {
            throw error;
          })
          .then(result => console.log('up containers result:\n', result));
      });
  }

// 프로필에 맞추어 컨테이너 구동 종료
async function clearDockerEnvironment(
  runtimeEnv: 'e2e_test' | 'middleware_test' | NodeEnv,
 ) {
  await new Promise((resolve, reject) =>
    exec(
      `docker compose --profile ${runtimeEnv} down`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        if (stdout) {
          resolve(stdout);
        }
        if (stderr) {
          resolve(stderr);
        }
      },
    ),
  )
    .catch(error => {
      throw error;
    })
    .then(result => console.log('down containers result: ', result));
}
