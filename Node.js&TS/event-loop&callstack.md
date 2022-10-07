철저히 node스러운 관점에서 작성한다. 그러므로 web api라는 용어는 사용하지 않는다.

# call stack과 event loop의 관계
콜스택과 힙은 V8에서 제공한다. 가비지 컬렉션도 맡는다. 이벤트 루프는 단지 blocking I/O를 만나면 커널로 작업을 넘기는 역할만 한다. 즉 코드를 실행하지 않는다. 다만 큐에 적재된 콜백 함수로 꺼내 V8에게 보낸다. V8은 이를 실행하며 콜스택과 힙을 가지고 변수를 할당하고 GC한다. 또한 node의 event loop은 browser의 event loop과는 다르다. 서버에 필요한 IO작업에 최적화된 형태라고 한다. event loop은 libuv에 포함되어 있다.

참고로 File I/O, Network I/O 외에도 libuv에게 맡기는 작업들이 있는데, 대표적으로 pbkdf2등이 그렇다. 또 재밌는 점은 Network I/O는 kernel에게 작업을 맡기는 반면 File I/O는 OS의 FS에 맡기지 않고 libuv가 직접 처리한다는 점이다. 이미 여러 문서에서 명시하고 있는 내용이지만 이에 대한 근거도 찾아볼 수 있는데, Node's Event Loop From the Inside Out by Sam Roberts, IBM 14:40초를 보면 file system은 not pollable이라고 언급하는 것을 볼 수 있다. kernel bound한 작업이 아니기 때문이다.

그리고 libuv는 queue에 콜백을 넣기 전에 작업을 수행한다. 즉, libuv를 통한 IO가 완료 된 후에 queue에 콜백을 넣고, V8의 콜스택이 비워지면 queue의 콜백함수를 꺼내 callstack에 넣는다. 콜 스택이 무조건 비워질 때까지 기다려야하는 것은 말 그대로 stack이기 때문에 비워지기 전에 다른 연산을 넣으면 전혀 엉뚱한 실행을 하기 때문이다.
## 둘 간의 우선순위?
call stack이 우선권을 가진다. 예를 들어, 아래와 같은 코드를 실행하면 어떻게 될까
```js
const arr = [1,2,3,4];

setTimeout(()=> console.log('I\'m not primary'), 0);
arr.forEach(x=>console.log(x));
```
대기 시간을 0으로 잡아 놓았음에도 불구하고 callback queue는 항상 call stack보다 후순위이기 때문에 forEach까지 완료된 후 실행된다. 추가로 promise가 실행되는 task queue도 보다도 우선순위가 낮다.

# nodejs에서 callback queue에 들어가는 함수들
I/O 콜백들과 타이머들만 callback queue에 적재된다. 각 phase에 적재되는 자세한 내용은 https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/을 참고하자. 
# promise가 차지하는 곳
event loop에는 micro task queue라는 공간도 있는데, 각 phase들이 넘어갈 때마다 체크하고 실행된다. 이와 반대되는 표현인 macro task queue는 일반적으로 생각하는 각 phase의 callback queue를 일컫는 말인데, 사실 정확한 용어는 아니고 micro task queue와 구분하기 위하여 사용된다. macro task queue가 소비되기전 무조건 micro task queue를 비워야하는 법칙이 존재하므로 micro task queue가 지나치게 길거나 무한루프에 빠질경우 다음 macro task는 실행되지 않는다. then, catch, finally가 실행되며 await도 마찬가지로 micro task queue에서 처리된다. await는 실제로 코드 진행을 멈추는 것은 아니며, 단지 await 이후의 코드를 then에 넣은 것과 마찬가지로 실행할 뿐인 일종의 문법 설탕이다.
queueMicrotask라는 함수도 존재하는데, 어떤 callback의 실행을 micro task queue내에서 처리할 것을 지시하는 함수이다. process.nextTick은 micro task queue보다 우선권을 가지며, next tick queue라는 별도의 공간에서 실행되며 event loop의 일부가 아니다.

아래의 예시로 코드 실행의 우선권을 생각해볼 수 있다.
```js
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('next tick'));
setImmediate(() => console.log('set immediate'));
console.log('sync');
queueMicrotask(() => console.log('queue micro task'));
setTimeout(() => console.log('set time out'), 0);
```
실행 결과는:
sync
next tick
promise
queue micro task
set time out
set immediate
이다.
