 @BlockingIO_vs_Non_BlockingIO
 * function이 return되는 시점의 차이
 * BlockingI/O: thread가 어떤 작업을 kernel에게 요청할때, blocking system call로 요청 -> kernel mode진입 -> thread blocked되어 어떠한 작업도 진행할 수 없게 됨
 *              작업이 완료되면 kernel mode -> user mode로 데이터 전달 -> thread block 해제 및 진행!
 *              -> 작업 return
 * 
 * non-blockingI/O: kernel에게 작업요청을 할때까진 같으나, 시스템 콜을 non-blocking으로 보낸다 -> kernel은 해당 작업을 initiate만 한 후, 즉시 리턴하는데 이때 linux기준 read()를 호출 했다면 -1이라는 값과 함께 에러코드(EAGAIN or EWOULDBLOCK)를 전송한다.
 *                  thread는 응답을 받자마자 다시 시작되며(즉, non-blocking이라고 해서 쓰레드가 극히 짧은 시간이라도 멈추긴 한다)
 *                  그런데, 왜 에러코드를 반환하는걸까? 사실 언급한 에러코드는 시스템이 반환할 값이 없다는 의미이다. 작업을 요청한 순간에는 당연하다. 작업을 이제 시작했는데 반환할 데이터는 없으니말이다.
 *                  그렇다면 자명한 non-blocking 시스템콜인데 데이터가 없다는 표시를 할 필요가 있을까? 사실 이 응답은 kernel이 작업을 언제 끝낼지 알 수 없다는 까다로움으로부터 기인한다.
 *                  자신이 요청했던 작업이 언제 끝날지 모르니, 작업이 끝났는지 알아보기 위해 다시 시스템콜을 보내면 kernel은 돌려줄 데이터가 준비되지 않았다면 계속해서 상술한 에러를 반환할 것이다.
 *                  반대로 작업 조회시 커널의 작업이 끝났다면 kernel은 kernel -> user로 데이터를 전송하고, 쓰레드는 다시 시작되게 된다.
 * ? 그럼 kernel이 작업을 완료 되었는지 매번 thread가 직접 확인해야한다는 것인가요?
 * 그건 아닙니다. 물론 그렇게 하기도 합니다. 가장 단순하고 구현도 쉽지요. 다만 치명적인 단점이 있는데, kernel이 작업을 완료한 시점과 thread가 완료를 확인한 시점 사이에 괴리가 생겨 처리가 느려질 가능성이 있다는 것입니다. 확인을 위해 자원을 지속적으로 투자해야하는 낭비는 말할 것도 없습니다.
 * 이를 극복하려면 어떻게 해야할까요? kernel이 작업이 완료되었다고 직접알려주면 되지 않을까요? 맞습니다. 실제로 이런 구현이 자주 사용되고, 이를 I/O multiplexing(다중 입출력)이라고 합니다.
 * I/O작업'들'을 모니터링하다가 완료되면 알려주는 방식입니다. 모니터링도 다중으로 수행해야 여러 작업을 오케스트레이션 할 수 있겠죠? 순서대로 살펴봅시다.
 * 
 * 1. thread가 I/O multiplexing system call을 kernel에게 보냅니다. 그 내용은, '내 비동기 작업을 monitor해줘'입니다.
 * 2. non-blocking이라고 가정했을때, thread는 작업을 지속중이고 kernel은 작업이 완료된 후 notify를 보냅니다.
 * 3. thread는 notify를 받고, 위에서 설명했던 non-blocking system call을 보냅니다. 이번엔 운영체제가 에러를 반환할리가 없겠죠? 이미 작업이 완료되었음을 통지받고 시스템 콜을 보낸 것이니까요.
 * 4. 마찬가지로, kernel -> user로 데이터가 전송되고 수행이 종료됩니다.
 * 
 * ? 커널모드? 그게 뭔가요?
 * 컴퓨터의 software계층은 user mode와 kernel mode로 나뉘어집니다. 우리가 사용하는 프로그램은 user mode에서 실행되나 interrupt나 system call이 발생하면
 * kernel mode로 전환됩니다. 전환시 프로그램의 현재 cpu상태가 저장되는데, 그 이유는 다시 user mode로 전환되었을때 이어서 실행하기 위함입니다. 
 * 이후 커널이 interrupt 혹은 system call을 직접 처리합니다. 즉, 실행되고 있던 user mode cpu 상태를 저장했으니 안전하게 cpu에서 kernel이 자신의 코드를 실행시킨다는 것입니다.
 * 처리가 완료되면 저장했던 cpu상태를 복원합니다. 즉, 프로그램에게 통제권을 반환합니다. 
 * 
 * 커널은 시스템을 보호하기 위해 존재하는데, 이름 그대로 핵심적이고 user가 접근할 수 없는 영역입니다. 커널에 대해서는 직접 찾아보시기 바랍니다.
 * * interrupt와 system call?
 * 1. interrupt
 *   시스템에서 발생한 다양한 종류의 이벤트 혹은 그런 이벤트를 알리는 메커니즘. 인터럽트는 CPU가 모든 IO를 직접 처리하는 것이 비효율적이라는 데에서 출발한다. 장치 드라이버는 cpu로부터 IO요청을 받으면 작업을 수행 후, 작업 완료
 * 신호를 보내게 되는데 이것이 인터럽트이다. 즉, cpu의 작업요청, 드라이버의 작업, 작업완료 신호 이렇게 세 단계로 구분된다.
 * 입출력 관리자는 자신이 할당받는 작업의 결과물을 메모리에 올려 cpu가 사용할 수 있게 해야하는데, 메모리 접근은 cpu의 고유권한으로 원래는 드라이버가 접근이 불가능하다. 그러나 cpu로부터 DMA(Direct Memory Access)권한을 받으면
 * 결과물을 메모리에 올려놓을 수 있으므로, DMA는 interrupt와 함께 자주 등장하는 개념이다.
 * 
 * 인터럽트가 발생하는 대표적인 상황들은 다음과 같다. 다음의 상황들 외에도 시스템은 엄청나게 다향한 인터럽트를 사용한다.
 *   
 *   a. 전원에 문제가 생겼을 때
 *   b. I/O작업이 완료되었을 때
 *   c. timer가 작동했을 때(시간이 다 되었을 때) -> js 타이머와 연관이있나요? 모르겠습니다...
 *   d. 0으로 나눴을 때
 *   e. 잘못된 메모리 공간에 접근을 시도할 때
 * 커널은 이런 각종 상황을 해결하기 위해 즉각적으로 통제권을 넘겨받습니다만, user mode에서 실행중이던 현재 코드까지는 마무리한 후 넘겨받습니다.
 * 
 * 2. system call
 * 프로그램이 OS커널이 제공하는 서비스를 이용하고 싶을 때 시스템 콜을 통해 실행됩니다.
 * 시스템 콜의 종류는 매우 다양하고 자주 쓰입니다. 프로세스, 스레드, 파일 I/O, 소켓, 장치, IPC관련 등등 항상 일어납니다.
 * 이러한 system call은 각각의 call에 대응하는 kernel code가 존재합니다. 커널은 콜의 종류에 맞춰 커널 코드를 실행합니다.
 * 
 * ? blockingI/O, non-blockingI/O 성능차이가 있나요? 
 * * 알 수 없음. blockingI/O이던 non-blockingI/O이던 kernel이 작업을 수행하는 것은 동일함. 지속적으로 요청을 받을 수 있다는 것과 그 처리가 실제로 언제 끝나냐는 다른 문제임. 요청을 계속 받을 수 있다고 해서 성능이 좋다고는 말할 수 없음.
 * ? nodejs의 Blocking과 Non-blocking은 어째서 일어나나요?
 * libuv가 handle하는 작업들은 정해져있습니다. fs, dns, zlib, crypto가 그것입니다.
 * kernel에 작업을 맡겨두고 return하는 것과 마찬가지로, libuv에게 작업을 맡겨놓고 return할 수도 있습니다.
 * 참고로 libuv는 이런 작업들을 처리하기 위해 thread pool을 생성하고 있으며 갯수는 4개입니다. (uv_threadpool 환경 설정을 통해 128개까지 설정가능)
 * 어떤 kernel에서도 지원하지 않는 작업을 네개 이상 비동기적으로 실행시키면 더이상 작업이 일어나지 않겠죠?
 * libuv는 우선 kernel이 처리할 수 있는 일은 kernel에게 맡겨버리니까요. kernel이 수행할 수 있는 작업의 한계는 시스템상, 컴퓨터의 스펙상 차이가 있을 것이므로
 * 정확히 어떤 작업을 몇 개나 비동기적으로 수행할 수 있는가? 에 대한 답변은 '상황에 따라 다름'이 됩니다.'
 * 
 * ? sync와 async는 blocking과 non-blocking과 동의어일까요?
 * 아닙니다. sync와 async는 thread가 kernel의 응답을 바라보는 관점이고, block과 non-block은 thread가 시스템콜 이후 진행을 할 수 있는지 없는지 여부에 따라 다른 것입니다.
 *  multi-threading, non-block call등이 모두 asynchronous를 실현하기 위한 방법들이 것입니다.
 * 그 중에서도 nodejs는 block I/O를 모두 libuv에 넘김(다른 threadpool에게 일을 맡김)으로써 자신은 non-block으로 동작하는 것이지요. 이 또한 asynchronous I/O를 구현하는 대표적인 방법입니다.
 * 
 * ? 그렇다면 모든 비동기 작업은 IO인가요?
 * 아닙니다. computational power가 많이 들어가는 작업도 비동기로 처리할 수 있습니다. 대표적으로 crypto의 pbkdf2와 같은 것이 그렇습니다.
 * 이런 작업의 동기버전인 pbkdf2Sync와 같은 함수를 사용할 경우 event-loop이 병목된 상태로 작업이 완료될 때까지 진행되지 못하니 이런 방식은 자제해야합니다.
 * 그런데 콜백 패턴을 사용하는 함수들의 경우, 사용하기 까다로운 면이 분명히 있습니다. 이런 경우 결과 값을 promisify하여 사용할 수 있습니다.
 * await는 언뜻 보기엔 코드 진행을 막는 것 처럼 보이지만, 사실 event-loop을 병목시키지 않는 문법적 설탕의 개념입니다.
 * 
 * ? nodejs에선 비동기 작업이 완료되었음을 어떻게 알 수 있나요?
 * noti? callback? file descriptor?
 * ? 그렇다면 nodejs는 항상 multiplexing과 reactor를 사용해 비동기 작업을 처리한다는 말이군요!
 * ! 아닙니다. nodejs는 network I/O에만 epoll, kqueue, IOCP 등을 사용합니다. File I/O는 오직 libuv의 thread pool을 이용해 처리됩니다.
 * ! 이는 libuv의 공식문서에 명시되어있는 내용으로, 여러 시스템을 통일해서 사용하기 어렵다는 문제에서 비롯됩니다.
 * 
 * ? libuv가 file descriptor를 참조한다는 말이 자주 나오는데, libuv는 여러가지 일을 수행하는데 file외(network I/O)는 어떻게 참조하나요?
 * nodejs 혹은 libuv공식문서에서도 계속 등장하는 file descriptor라는 말은,  file system에 속하지 않는 대상에도 구분되지 않고 쓰입니다.
 * 즉, socket은 fs에 포함되지 않음에도 불구하고, socket descriptor도 file descriptor라고 통으로 묶여서 불립니다.
 * 이는 https://www.youtube.com/watch?v=P9csgxBgaZ8 3:00에 확인하실 수 있습니다. "file descriptors are not really files"
 **/


/**@이해안가는것1 don't block the event-loop에 보면 libuv가 처리하는 목록이 나와있는데, network i/o가 빠져있다. dns.lookup이 network i/o는 아닌거같은데... */
/**@해결 정확히 읽어보면 'threadpool을 사용하는 작업'임. 즉, libuv가 os에 맡기는 작업은 포함되지 않는 것임. network I/O도 그 중하나. */
/**@해결 여기에서도 nodejs가 fs를 os에 맡기지 않는 다는 것이 드러남. 모든 fs작업을 threadpool이 직접 처리한다고 명시되어있음 */
/**@해결 꼭 명시된 것만 가능한 것은 또 아님. C++ add-on을 사용자가 작성해서 붙여도 worker pool이 처리함 */

/**@이해안가는것2 fs는 thread pool이 직접처리한다고 나와있는데 don't block the event-loop는 epoll등의 얘기를 하면서 이런 file descriptor들은 네트워크소켓, 파일 등에 관계없이 대응된다라고 명시해두었음. 어떻게 된 것인가*/
/**@이어서 don't block the event-loop에는 그런데 fs는 thread pool을 이용한다고 명시하고 있는데 그러면 문서의 오류? 아니면 이해의 부족? epoll, IOCP등은 kernel bound한 용어들인데?*/
/**@이어서 그리고 epoll과 같은 것들은 socket에만 사용할 수 있는거아닌가? 소켓프로그래밍 관련 자료밖에 안나오는데.. */
/**@해결 Node's Event Loop From the Inside Out by Sam Roberts, IBM 14:40초를 보면 file system은 not pollable이라고 함. 근데 대체 왜 문서에는 그렇게 적혀있는거? 돌겠네... */
/**
 * @비동기_처리란
 * * 동시 처리(IPC의 종류 및 메커니즘)
 * * 병렬 처리
 * 
 */

/**
 * @nodejs에서의_비동기_처리방식
 * ? 왜 싱글스레드에서 작업이 안 끝났는데 다른 작업 요청을 받을 수 있는가? 아니, 싱글스레드라는게 무엇인가?
 * 싱글스레드의 핵심은 콜스택이 하나라는 것이고, 콜스택이 하나라는 것은 스레드가 하나라는 것이며, 이는 한번에 하나의 작업만 수행이 가능하다는 뜻이다.
 * 콜 스택의 스택이 해제되는 조건은 return이 발생하는 것
 * 그렇다면 동기처리란 콜스택에 작업이 남아있는채로, return되지 않는 상태를 허용하는 것을 말한다고 할 수 있을 것이다.
 * 
 * OS커널(멀티스레드) 혹은 libuv의 thread pool(브라우저라면 WebAPIs)에게 blockingI/O 작업을 맡긴다. 
 * 즉, non-blocking이 가능한 것은 blockingI/O를 다른 프로그램에게 넘겼기 때문이다.
 * 즉, Node.js가 싱글스레드라는 것은 엄밀히 말하면 틀렸다.
 * 보통 싱글스레드라고 표현하는 이유는 이벤트루프가 싱글스레드기반으로 동작하기 때문이다.
 * 
 * 즉, js가 비동기를 지원한다기보다는 js의 런타임(브라우저 or Node)가 비동기를 지원한다고 보는 편이 타당하다.
 * libuv는 작업을 완료하면, js의 callstack에 작업을 넣는 것이 아니라 task-queue에 작업을 밀어 넣은 후, event-loop을 거쳐 js의 callstack에 삽입되는 순을 거친다.
 * 여기서 짚고 넘어가야할 부분은, callstack이 비었을 때만 eventloop가 태스크 큐의 작업을 콜스택으로 밀어넣으며, 이를 반복한다는 것이다.
 * 이는 생각해보면 당연한데, 콜스택이 비워지기 전에 새로운 태스크를 넣으면 콜스택의 작업이 실행이 되다가 갑자기 전혀 엉뚱한 연산이 이어서 실행되는 결과를 낳기 때문이다.
 * (what the heck is event loop는 event-loop가 태스크큐로부터 콜스택으로 밀어넣는 것만 설명하고 있지만, https://darrengwon.tistory.com/953 에서는 이벤트루프가 태스크 큐에 작업을 밀어넣고, 다시 이벤트루프가 태스크 큐의 작업을 콜스택으로 넘긴다고 설명하고있다. 무엇이 맞는것인가)
 * 
 * ? 그렇다면 nodejs는 싱글스레드가 아닌 것인가요?
 * 어떻게 보면, 그렇습니다. 다만, main thread에서 event loop와 js실행을 모두 담당하므로 싱글 스레드라는 표현도 맞습니다.
 * 단지 cpu intensive 혹은 I/O intensive한 작업을 libuv의 thread pool에서 처리하므로 nodejs의 스레드는 두 종류(nodejs: don't block the event-loop: types of thead)라고 생각하셔도 무방합니다.
 * 그러나 nodejs는 싱글스레드라는 사실의 근간을 흔들만한 기능도 포함되어있는데, worker thread입니다.
 * worker thread는 main thread에 종속적이긴 하지만 각 worker가 모두 각자의 V8, event-loop, event queue를 가지고 동작합니다.
 * 이전에는 threadpool이 nodejs를 도와준다고하더라도 결국 이벤트루프가 하나이기 때문에 nodejs는 관용적으로 싱글스레드라고 표현되지만, 이벤트루프가 각자의 쓰레드에서 실행된다면 조금 더 어려운 문제이긴 합니다.
 * 그러나 nodejs는 기본적으로 싱글스레드로 실행되고, 이러한 동작은 개발자가 직접 조작해야하는 문제이기 때문에 '싱글스레드에 국한되지 않는다' 정도로 이해하셔도 무방합니다. 여전히 nodejs는 싱글스레드라는 표현이 어울린다는 것이지요.
 * 그렇다면 nodejs도 cpu intensive한 처리에 적절한 것 아닌가에 대한 생각을 가지실 수도 있습니다. 그건 아닙니다.
 * 이런 기능들은 event-loop 병목을 '어느정도' 해결해주지만 여전히 JS이기에 cpu intensive한 연산을 수행하기에 적합하다는 의미는 아닙니다.
 * 사실 가장 node스럽게 CPU intensive task 해결하는 방법은 C++로 코드를 작성해 libuv의 threadpool이 처리하도록 하는 것입니다. 기존에 nodejs가 성능을 높이기위해 사용하고 있던 방식에, 개발자가 원하는 특정 기능도 포함시키는 것이지요.
 * worker thread사용법에 관한 자세한 설명은 생략하도록 하고, 관심이 있으신 분들은 공식문서를 참고하시길 바랍니다.
 *
 * 참고로, cluster에서 실행되는 worker들은 thread라기보다는 분리된 process가 실행되는 것으로, 하나의 process내에 여러개의 스레드가 실행되는 worker thread와는 다릅니다.
 * 
 * * event-loop
 * ! https://www.youtube.com/watch?v=8aGhZQkoFbQ
 * 
 * * libuv
 * 이 라이브러리는 C로 작성되었고 윈도우나 리눅스 커널을 추상화해서 Wrapping하고 있는 구조이다. 즉, libuv는 OS 커널에서 어떤 비동기 작업들을 지원해주는 지 알고 있기 때문에 커널을 사용하여 처리할 수 있는 비동기 작업을 발견하면 바로 커널로 작업을 넘겨버리고, OS가 지원하지 않는 비동기가 있다면 자체 thread pool을 이용하여 비동기를 처리합니다.
 */

/**
 * @왜_callback이_필요할까
 * * 어떤 작업이 완료된 후에 원하는 동작을 실행할 수 없을까?
 */

/**
 * @왜_JS는_callback_투성이일까
 * * 싱글스레드라서 거의 모든 동작을 비동기로 처리해야한다.
 * * don't block the event-loop
 */

/**
 * @callback의_진화_Promise
 * * microtask-queue(js9000으로 시연)
 * * microtask vs macrotask
 */

/**
 * @Promise의_진화_async_await
 */

/**
 * @유용한_비동기_처리_패턴
 * * reduce를 이용한 Promise 순차처리
 * ? 여러 비동기 작업을 동시에 실행시킬 순 없을까?
 * * callback을 이용한 병렬처리
 * * Promise.all을 이용한 병렬처리
 * * stream을 이용한 병렬처리
 * * worker_thread를 이용한 병렬처리
 */


// https://developer.ibm.com/articles/l-async/ IBM공식문서

// https://javascript.plainenglish.io/nodejs-thread-pool-performance-limitations-33e77811ff5b
// https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c
// https://blog.insiderattack.net/new-changes-to-timers-and-microtasks-from-node-v11-0-0-and-above-68d112743eb3
// https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=182s

// https://www.korecmblog.com/node-js-event-loop/
// https://medium.com/@mmoshikoo/event-loop-in-nodejs-visualized-235867255e81
// https://www.youtube.com/watch?v=mb-QHxVfmcs