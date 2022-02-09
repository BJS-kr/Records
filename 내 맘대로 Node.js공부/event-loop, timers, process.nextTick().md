## https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/ 를 번역한 것입니다.
## 이미 인터넷에 좋은 설명들이 많지만 공식문서를 통해 이해해보겠습니다.

# 이벤트 루프란 무엇인가?
이벤트 루프는 시스템 커널에게 작업이 가능할때 offloading(computaion offloading의 개념을 이해하길 바람) 해줌으로써, Node.js가 non-blocking I/O한 동작을 가능하게 해주는(JS는 single threaded임에도 불구하고) 것 입니다.
근래 커널들은 대부분 multi-threaded이기 때문에, 백그라운드에서 multiple operations를 수행할 수 있습니다. 각 operation이 완수되었을 때, 커널은 Node.js에게 결국 수행될 적절한 콜백이 **poll** queue에 추가 될 수 있도록 tell합니다.
이 부분에 관해선 이 토픽의 나중에서 다루겠습니다.

# 이벤트 루프 설명
Node.js는 동작을 시작할 때 async API 호출, schedule timers, process.nextTick()등이 포함된 script (혹은 REPL에 입력된 명령)을 처리하는 이벤트 루프를 initialize합니다.
아래의 다이어그램은 간단화된 이벤트 루프의 오버뷰입니다.
![overview](https://user-images.githubusercontent.com/78771384/152640964-f89541bf-09cb-4a3b-b262-03a0faea613c.PNG)

각 박스는 이벤트 루프 내에서 Phase로 표현됩니다.

각 phase는 실행될 콜백의 FIFO queue입니다. 각 phase는 모두 special한 역할이 있습니다만, 크게 보면 이벤트 루프가 각 phase에 진입했을 때 각 phase에 맞는 작업을 수행하고, 
phase의 queue가 exhausted되거나(실행가능한 조건에 따라 가능한 콜백은 모두 실행되었음을 뜻함. empty와는 다른 표현) 실행될 수 있는 한계치(maximum number)까지의 콜백을 실행합니다.
queue가 exhausted 되거나 limit에 도달하면, 이벤트 루프는 다음 phase로 이동하며 위와 같은 동작이 반복됩니다.

이러한 동작들은 poll phase에서 처리되는 더 많은 동작이나 이벤트들을 커널이 추가할 수 있게 하기 때문에, poll events는 polling events가 처리되는 동안 queue에 추가될 수 있습니다.
결과적으로, 처리에 긴 시간이 필요한 콜백들은 poll phase에서 timer의 threshold보다 훨씬 긴 시간동안 처리 될 수 있습니다. 자세한 내용은 timers와 poll 항목에서 후술합니다.

이벤트 루프의 구현에는 Windows와 Unix/Linux간 작은 차이가 있지만, 주목할만한 차이는 아닙니다. 사실 이벤트루프는 총 7-8단계로 이루어집니다만, 우리가 주목할 부분은 위의 다이어그램에 국한 됩니다.

# Phases Overview
1. timers: 이 페이즈는 setTimeout()과 setInterval()로 스케쥴링된 callback들을 실행합니다.
2. pending callbacks: 다음 loop으로 지연된 I/O callbacks를 실행합니다.
3. idle, prepare: 내부적으로만 사용됩니다.
4. poll: 새로운 I/O events를 가져옵니다. I/O에 관계된 콜백을 실행합니다(close callback이거나, timer에 의해 스케쥴 되거나, setImmediate()에 의한 것을 제외한 거의 모든 callback). Node는 적절한 경우 이곳에서 block될 수 있습니다.
5. setImmediate()콜백은 이곳에서 실행됩니다.
6. close callbacks: e.g. socket.on('close', ...) 

각 페이즈의 사이에, Node.js는 페이즈가 async I/O 혹은 timers를 기다리는 중인지 체크하고, 아무것도 존재하지 않는다면 shut down합니다.

# Phases in Detail
## 1. timers
타이머는 threshold를 기준으로 콜백을 실행합니다만, 중요한 것은 threshold가 경과하는 시점에 정확히 실행한다는 것이 아니라 threshold가 경과한 '후'에 실행된다는 것만 보장합니다. 타이머의 콜백은 threshold가 경과한 후 실행할 수 있는 가장 빠른 시점에 실행될 것입니다. OS의 스케줄링이나 다른 콜백의 실행 때문에 타이머의 콜백 실행은 지연될 수 있습니다.

기술적으로, poll phase가 타이머가 실행되는 시점을 컨트롤합니다.

예를 들어, 당신이 timeout을 100ms로 스케줄했다고 가정합시다. 그리고, 당신의 스크립트는 비동기적으로 95ms의 시간이 필요한 파일 읽기 작업을 수행한다고 합시다.
```javascript
const fs = require('fs');

function someAsyncOperation(callback) {
  // Assume this takes 95ms to complete
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();

  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```
이벤트 루프가 poll phase에 진입할 때, poll은 빈 queue를 가지고 있고, 그러므로 poll은 가장 빨리 도래하는 timer의 threshold를 기다릴 것입니다. poll이 기다린지 95ms가 되었을 때, fs.readFile()이 완수될 것입니다. 그리고 완수되는데 10ms가 필요한 readFile의 콜백은 poll queue에 추가되고 실행될 것입니다(타이머 종료 5ms전에 새로운 작업이 추가 되었다는 뜻). 즉, readFile하고 콜백까지 실행되는데 총 105ms의 시간이 필요해졌습니다. 이미 threshold의 100ms를 넘긴 시간입니다. 이제 queue에 남은 콜백이 없으니 이벤트 루프는 가장 빨리 도래하는 타이머를 찾아볼 것입니다. 도래한 타이머가 있다면, timers phase로 돌아가(wrap back) 타이머의 콜백을 실행합니다. 이 예제에서, 100ms의 타이머가 105ms후에 실행되는 것을 볼 수 있습니다.

poll phase가 이벤트 루프를 굶기는 것(starving)을 방지하기 위해, libuv(Node.js의 이벤트 루프와 비동기 동작을 구현하는 C 라이브러리) 또한 events를 더 polling(장치 또는 프로그램이 충돌 방지 혹은 동기화를 위해 다른 장치 또는 프로그램을 주기적으로 감시하며 자료를 처리하는 방식)하는 것을 멈추기 전에 hard maximum(hard limit을 말하는 듯 합니다. hard maximum은 시스템 의존적입니다)을 가집니다.

## 2. pending callbacks
이 페이즈는 system operation을 위한 콜백 즉, TCP 에러 등을 실행합니다. 예를 들어, TCP socket이 연결 시도 중 ECONNREFUSED를 반환받았다면, ~nix(suffix nix라는 뜻) system은 에러를 보고하기 위해 대기하길 원할 것입니다. 이는 pending callbacks phase에 queued 될 것입니다.

## 3. poll
poll phase는 두 가지 중요한 기능을 합니다.

첫 번째, I/O를 위해 얼마나 길게 block하고 poll해야할지, 그 후
두 번째, poll queue에 있는 이벤트들을 처리합니다.

이벤트 루프가 poll phase에 진입했을 때, 스케줄된 타이머가 없다면, 다음 두 가지 중 하나의 일이 일어날 것입니다.

- **poll queue가 비어있지 않다면,** 이벤트 루프는 poll queue를 순회(iterate)하며 exhausted되거나 시스템 의존적 hard limit에 도달할 때까지 동기적으로 콜백을 실행할 것입니다.
- **poll queue가 비어있다면,** 또 다시 다음 두 가지 중 하나의 일이 일어날 것입니다.
  * **스크립트가 setImmediate()에 의해 스케줄 되어 있다면,** 이벤트 루프는 poll phase를 종료하고 그 스케줄된 script를 실행하기 위해 check phase로 넘어갈 것 입니다.
  * **스크립트가 setImmediate()에 의해 스케줄 되어 있지 않다면,** 이벤트 루프는 poll queue에 콜백이 추가되길 기다릴 것이고, 즉시 실행할 것입니다.

poll queue가 비워졌을 때, 이벤트 루프는 threshold가 도래한 타이머가 존재하는지 체크할 것입니다. 하나 이상의 timer가 도래했다면, 이벤트루프는 timers phase로 돌아가(wrap back)하여 타이머의 콜백을 실행할 것입니다.

## 4. check
이 페이즈는 poll phase가 완료된 후 콜백을 즉시 실행하게 합니다. poll phase가 idle 상태가 되고 스크립트가 setImmediate()를 통해 queued 되었다면, 이벤트 루프는 기다리지 않고(setImmediate가 없을때 poll에서 기다리는 것) check phase로 넘어가게 됩니다.

setImmediate()는 사실 별도의 phase에서 실행되게 하는 특별한 타이머입니다. 이는 poll phase가 종료된 직후 실행하도록 스케줄하는 libuv API를 사용합니다.

일반적으로, 코드가 실행됨에 따라, 이벤트 루프는 결국 incoming connection, request 등을 기다리는 poll phase에 도달하게 됩니다. 그러나, 만약 callback이 setImmediate()에 의해 스케줄 되어있고 poll phase가 idle된다면, 기다리지 않고 poll phase를 종료 후 check phase로 진입하게 됩니다.

## 5. close callbacks
만약 소켓 혹은 handle이 예상치 못하게(abruptly) closed 되었다면(예를 들어, socket.destroy()), 'close' 이벤트가 이 phase에서 발생(emitted)될 것입니다. 이 경우가 아니라면, process.nextTick()을 통해 발생(emitted)됩니다.

# setImmediate() vs setTimeout()
# 번역하다 보니 한국어 문서가 존재한다는 걸 뒤늦게 발견해서 중단합니다.... 어쨌든 많은 공부가 되었습니다.
