#Docker Best Practice

1. 공식 베이스 이미지를 사용하라(예를 들어, 노드를 사용하기 위해 우분투 이미지를 pull받고 다시 노드를 설치하지 말아라. 대신 node 이미지를 사용하라).

2. latest 태그사용을 자제하라. 프로그램 구동환경에 변화가 생겨 예상치 못한 문제가 발생하게 된다.  

3. Full-blown 이미지사용을 자제하라 이유 1. 불필요한 요소들이 포함되어있어 용량이 커진다. 2. 모든 요소가 포함되어있으면 그 만큼 보안 취약점이 많다. Attack surface가 넒어진다.  그러므로 leaner 혹은 smaller한 이미지 (예를 들어, alpine)이미지를 사용하는 것이좋다. 
 
4. 캐싱을 하자.layer의 개념을 이해하고 활용해야 한다. 모든 도커이미지는 layer 가 있다. 빌드 단계라고 생각하면 된다. 도커파일의 명령한줄마다 layer 가 쌓이게 된다. base이미지들도 이미 layer들을 가지고있다.
docker history 명령어로 이미지의 layer들을 확인할 수 있다. Docker build -t 앱이름 . 했을때 CACHED라고 표시되는 부분이 도커가 캐쉬를 활용하는 부분이다. 문제는,

```dockerfile
FROM node:17.0.1-alpine

WORKDIR /app

COPY myapp /app

RUN npm install --production

CMD ["node", "src/index.js"]
```
와 같은 형태일 때, 내가 코드의 아주 작은 부분이라도 수정한 경우 COPY 레이어가 캐시를 활용하지 못하고 전부 COPY되도록 실행된다는 점이다. 더 큰 문제는 후행하는 모든 layer들도 캐쉬 없이 모두 재실행된다는 점이다.
레이어 중 하나라도 캐시활용이 불가능하면 그보다 뒤에 있는 모든 행은 캐쉬를 활용하지 못하도록 되어 있기 때문이다. 즉 위와 같은 경우, 오타하나를 고쳐도 전체 코드 COPY및 npm install 까지 전부 실행되야하는 것이다.
문제를 해결하기 위해, 위의 도커파일을 수정해보자.

```dockerfile
FROM node:17.0.1-alpine

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install --production

COPY myapp /app

CMD ["node", "src/index.js"]
```
package.json과 package-lock.json을 먼저 카피하고, npm install이 실행된 후 코드를 복사하도록 순서를 변경했다. 이제 package.json에 변화가 생기지 않는 이상 npm install은 재실행되지 않을 것이다.
결론은, 도커 파일 작성할땐 순서가 필요하다는 것이다. 가장 변화가 없는 파일부터, 가장 변화가 심한 파일 순서대로 명령어를 작성해야한다. 

5. .dockerignore를 활용하자. docker build할때 쓸데없는 파일들이 함께 올 필요는 없다. 예를 들어 매일 쌓이는 로그파일 혹은 client-secret.json같은 것들 말이다.
실제로 활용한 .dockerignore의 경우 
node_modules
dist
Dockerfile
docker-compose.yml
.dockerignore
등의 항목이 포함되었다.

6. multi-stage builds하라. build stage와 runtime stage를 구분하라는 말이다. 모든 것을 이미지에 담아버리면 용량도 커지고, attack surface도 늘어나게 된다. 예를 들어, Test dependencies, Development tools, Temporary files, build tools, package.json같은 것들이다. 의존성을 설치할때는 필요하지만
최종적으로 앱 구동시에 필요한 것이 아니라는 것이다. 즉 최종적으로 빌드된 이미지에는 들어가지 말아야한다. 예를 들어 보자.
```dockerfile
# Build stage
FROM node:17.0.1 AS build

WORKDIR /src/app

COPY package*.json.

RUN npm install

RUN npm run build

COPY myapp /src/app

# Runtime stage
FROM node:17.0.1-alpine

COPY --from=build /src/app ./

EXPOSE 3000

CMD ["node", "src/index.js"]
```
7. 권한을 지정해서 사용할 것. 모든 유저가 root로 접속하는 상황을 피할 것. 이또한 도커파일에서 지정이 가능하다. 어떤 이미지들은 베이스에 제네릭 유져를 가지고 있다. 새로 만들 필요가 없이 그냥 사용하면 된다. 예를 들어 node이미지에는 USER node가 존재한다. RUN chown -R node:node /app 후 USER node 하면 끗
```dockerfile
# create group and user
RUN groupadd -r tom && useradd -g tom tom

# set ownership and permissions
# -R flag는 recursive. 하위에도 적용 한다는 뜻
RUN chown -R tom:tom /app

# switch to user
USER tom

CMD ["node", "index.js"]
```

8. docker scan [이미지이름]으로 취약점을 검사하자. 도커는 snyk이라는 서비스로 취약점을 검사한다. 이보다 더 strict한 방법은, Docker Hub 리파지토리에 푸쉬할 때 scan을 강제하는 것이다. 도커허브에서 쉽게 설정할 수 있다. scan summary를 docker desktop에서 간편하게 받아볼 수 있다. CI/CD에도 통합시킬 수 있다.

