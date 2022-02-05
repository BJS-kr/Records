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
