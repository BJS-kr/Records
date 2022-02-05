// 1. Back-pressure의 원 뜻은 반대로 미는 힘. 즉, stream에선 data가 흐르지 못하도록 막게 되는 것.
// 2. 카드 데이터 수집 CSV를 클라우드로 매일 옮긴다고 상상하면 쉽다. 몇 기가씩 되는 데이터를 Buffer에 때려넣을 순 없다. 메모리에 과도한 부담을 줄게 뻔하다.
// 3. Buffer threshold(highWaterMark)를 넘어서면 그에 맞는 조치를 취해야한다.
// 4. highWaterMark는 threshold지 limit이 아니다. Buffer에 data를 넣는 push가 false를 반환할 뿐

/**
* 주의:
* node.js로 개발을 하면서 back-pressure를 마주칠 일은 극히 드물다. pipe, pipeline등 nodejs native로도 back-pressure를 알아서 컨트롤 해주기도 하고
* 우리가 개발 중 사용하는 대부분의 패키지 혹은 라이브러리는 stream을 graceful하게 컨트롤한다.
* 다만 nodejs 개발자로서, nodejs가 어떻게 동작하는지는 이해해야한다고 생각한다. 우리가 컴퓨터를 개발할 것은 아니지만 컴퓨터의 작동원리를 공부하는 것 처럼.
*/

// 구현 주안점
// 1. drain 이벤트가 없는 Readable의 threshold를 어떻게 컨트롤 할 것인가? (Writable은 drain이벤트에 맞춰 pause-resume 사이클을 조정하면 되지만 Readable은 추가 구현 필요)
// 2. Readable과 Writable이 서로의 상태를 파악하고 유기적으로 동작할 수 있는가?

import internal, { Readable } from 'stream'
import { createWriteStream } from 'fs'

class MyReadable extends Readable {
  // 데이터 생성해주는 제너레이터
  private* numGenerator(threshold: number) {
    let i = 0;
    while (i<=threshold) {
      yield i++;
    }
  }

  private retries = 0
  private async keepItDown() {
    this.retries++
    if (this.retries > 10) { return; }
  
    // readableLength는 현재 readable의 buffer length를 반환하므로 highWaterMark보다 낮다면 resume
    if (this.readableLength <= this.readableHighWaterMark) {
      if (this.isPaused) {
        this.resume();
      }
    }

    let chunk;
    
    // 1. done이 false인동안 실행
    // 2. push는 highWaterMark임계를 넘어섰다면 false를 반환하므로 !검증으로 pause 및 while문 break
    while (!(chunk = this.numGenerator(this.threshold).next()).done) {
      if (!this.push(JSON.stringify(chunk)+'\n')) {
        this.pause();
        break
      }
    }
  
    // 제동(throttling) 
    // Buffer length를 검증하는 방식으로 교체가능
    if (this.readable) {
      await new Promise((res)=>{
        setTimeout(()=> res(console.log('throttle 0.1s, \'cause readable has no drain event')), 100)})
      return this.keepItDown();
    }
  }

  constructor(opts:internal.ReadableOptions, private threshold: number) {
    super(opts);
  }
  // _read는 명시적으로 호출 될 수 없다.
  // _read는 오직 read에 의해 호출되어야 한다.
  _read() {
    this.keepItDown()
  }
}
// Writable에서 drain이벤트 발생 시(Writable Buffer가 소진 되었다는 뜻) resume.
const myWritable = createWriteStream('./test.txt', { encoding:'utf8', highWaterMark: 100 }).on('drain',() => myReadable.resume())
const myReadable = new MyReadable({ highWaterMark: 500 }, 100)

myReadable.on('data', (chunk) => {
  console.log('data emitted')
  // highWarterMark 임계 도달시 false
  const canWrite = myWritable.write(chunk)
  // 임계 도달 검증으로 pause
  if (!canWrite) { myReadable.pause(); }
  // 이해가 안되는 유일한 부분
  // 공식문서에 따르면, readable은 pause혹은 flowing의 상태를 지니며, 모든 readable은 paused로 출발한다.
  // paused는 read로 인해 flowing으로 바뀐다.
  // 다만, data이벤트를 부착하거나, pipe메소드를 실행하거나, resume을 call한다면(기본이 pause이므로) read호출 없이 flowing으로 바뀐다.
  // 위 코드는 보다시피 data 이벤트를 부착한다. 그러면 즉시 flowing상태로 바뀌어야한다고 생각되지만 실제로는 그렇지 않다. data이벤트는 호출되지 않으며 retry attempts가 한계에 도달해 그대로 종료되고 만다.
  // read를 명시적으로 호출하면 data 이벤트가 분명히 emit됨을 결과물로 확인할 수 있다.
}).read();
