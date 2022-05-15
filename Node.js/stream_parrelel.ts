import { createReadStream, createWriteStream } from 'fs';
import { Transform, TransformCallback, TransformOptions, pipeline } from 'stream';
// chunk를 지정 문자열을 기준(String.prototype.split과 다르게 기본값 \n)으로 분리하여 stream 시켜주는 패키지
// 즉 line별로 스트림 시켜준다는 것과 같다.
import split from 'split'
import axios from 'axios'

class ParallelTransform extends Transform {
  constructor(
    private readonly transformFunc:(chunk:any, encoding:BufferEncoding, push:(chunk:any, encoding?:BufferEncoding) => boolean, done:(err?)=>boolean) => any,
    options: TransformOptions
  ) {
    super(options);
    
  }
  private running = 0;
  private terminateCb: TransformCallback | null = null;


  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    this.running++;
    // push는 readable의 read queue에 데이터를 push하는 역할을 합니다.
    // oject mode에서는 push(chunk)의 chunk는 any입니다만, 아니라면 string, Buffer, Uint8Array로 데이터 타입이 제한됩니다.
    // chunk를 null로 push함으로써 스트림이 종료되었음을 알릴 수 있습니다.
    // pause 상태일 때는 push로 인해 read queue에 추가된 데이터를 'readable'이벤트가 발생할때, read()메서드를 호출함으로써 읽게 됩니다.
    // flowing 상태일 때는 'data'이벤트로 인해 push()호출되게 됩니다.
    // push는 continue할 데이터가 남아있을땐 true, 아니면 false이기 때문에 반환 값을 통해 분기를 주는 것도 가능합니다.
    // push가 동작하게 되는 컨텍스트는 transformFunc가 되므로 parallelTransform에 바인딩. _done도 마찬가지.
    this.transformFunc(chunk, encoding, this.push.bind(this), this._done.bind(this))
    // callback은 chunk가 processed되었음을 알리기 위해 존재한다.
    callback()
  }

  // 커스텀 Transform구현에서, _flush는 더 이상 consume될 데이터가 없을 때, 
  // 그러나 end 이벤트(Readable)를 발생시키기 전에, 호출된다(애초에 _flush는 readable의 내부구현 메소드이다).
  // callback은 flush 과정이 모두 끝난 후 호출 되어야한다.
  // push()는 _flush의 구현 내에서 0 ~ n번 호출 될 수 있다.
  // 아래 구현에서, callback을 분기해 호출하는 이유는 readable이 end될 것이라고 해서, callback을 호출해 Transform stream을 마무리지으면 안되기 때문이다.
  // 모든 readable이 end되었을때(running이 0일 때. 정확히는 마지막 readable이 end되려고 할때)에 callback을 호출하게 된다.
  _flush(callback: TransformCallback): void {
    this.running > 0 ? this.terminateCb = callback : callback()
  }

  // 커스텀 종료 메서드
  _done(err:Error) {
    this.running--;
    if (err) return this.emit('error', err)
    // running 갯수가 0이면 
    // -> terminateCb가 할당되었으면(flush가 호출된 시점에 running이 1 이상이었던 적이 있다면) 
    // -> flush에서 보류해두었던 callback을 호출
    !this.running && this.terminateCb && this.terminateCb()
  }
}

// 보통 스트림은 순서가 중요하기 때문에 위 처럼 chunk마다 병렬로 실행되어 원하는 결과를 얻을 수 있는 경우는 상대적으로 적다.
// 그러나 특정한 경우에는 오히려 병렬 실행이 도움이 될때도 있다. 예를 들어, 여러 주소를 확인해야하는 health checker의 경우에 그렇다.

pipeline(
  // 체크하고자 하는 url의 집합
  // 참고로 pipeline의 source는 stream뿐 아니라 iterable, AsyncIterable, Function 모두 가능하다.
  // AsyncIterable은 Symbol.iterator와 Symbol.AsyncIterator의 차이로 이해하면 쉽다. 
  // for await 구문으로 iterable을 iterate하기 위해선 반드시 AsyncIterator가 구현되어있어야 한다.
  // 참고로 AsyncIterator()를 통해 반환된 AsyncIterable은 전개문법을 사용하지 못한다.
  // 어쨌든 pipeline에서 AsyncIterable까지 지원하는 것은 Node.js가 얼마나 유연한지 보여주는 사례라고 생각한다.
  // 즉, ['https://naver.com\nhttps://google.com'] 과 같이 source를 넣어도 똑같이 작동한다는 것
  // 뿐 아니라 ...transform과 destination(이곳에선 writeStream)도 Stream 혹은 Function이 위치할 수 있다.
  // 또한 pipeline자체도 Stream을 반환한다.
  createReadStream('./urls.txt'),
  // \n 기준으로 chunk를 분리해 stream
  split(),
  new ParallelTransform(
    async (url, enc, push, done) => {
      if (!url) {
        return done()
      }
      try {
        // await이지만 병렬실행 하게 되는 이유:
        // 위 ParallelTransform의 구현 내부를 보면, Promise인 transformFunc를 await하지 않음을 살펴볼 수 있음
        // transform.callback을 비동기 함수 호출 후 즉시 이어서 호출 하고 있으므로 stream은 다음 chunk를 내보내게 되고, 작업이 병렬로 실행되게 만드는 것
        await axios.get(url, { timeout: 5000 })
        push(`${url} is up\n`)
      } catch {
        push(`${url} is down\n`)
      }
      done()
    }, 
    { objectMode: true }
  ),
  createWriteStream('./health_check_result.txt'),
  // pipeline은 error callback을 마지막 인자로 받는다.
  // pipeline이 fully done 된 이후에 호출된다.
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('all urls have been checked')
  }
)