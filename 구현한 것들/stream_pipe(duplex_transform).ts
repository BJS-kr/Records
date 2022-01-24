import { createWriteStream, createReadStream } from 'fs';
import { PassThrough, Duplex, Transform } from 'stream';

// Transform stream. pipe에 _transform을 사용하기 위함입니다.
class Transformer extends Transform {
  replaceChar: string;

  constructor(char:string) {
    super();
    this.replaceChar = char;
  }

  _transform(chunk: any, encoding: BufferEncoding | undefined, callback: Function) {
    const transformChunk = chunk.toString().replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar)
    this.push(transformChunk)
    callback()
  }

  _flush(callback: Function) {
    this.push('more stuff passed through...')
    callback()
  }
}

// chunk의 stream 속도를 조절하기 위함입니다. 
class Throttle extends Duplex {
  delay:number;

  constructor(ms:number) {
    super()
    this.delay = ms
  }

  _write(chunk:any, encoding: BufferEncoding | undefined, callback: Function) {
    this.push(chunk);
    // Throttle의 역할을 수행하기 위해 delay ms 만큼 setTimeout으로 chunk를 받을 때마다 잠시 멈춥니다.
    setTimeout(callback, this.delay)
  }

  _final() {
    this.push(null)
  }
}

// stream된 bytes의 누산용 closure func
function bytes() {
  let total = 0;

  return { 
    get total() { return total }, 
    set total(bytes: number) { total += bytes}
  } 
}

const readStream = createReadStream('./data.txt');
const writeStream = createWriteStream('./migrated.txt', { encoding:'utf-8' });

const report = new PassThrough();
const throttle = new Throttle(10);
const xStream = new Transformer('x');

const dataBytes = bytes();

// PassThrough의 event로 chunk의 양을 확인합니다.
// 실제로 chunk들이 stream되는 것을 확인하려면 data의 사이즈가 충분히 커야합니다.
report.on('data', (chunk: number) => {
  dataBytes.total = chunk
  console.log('bytes: ', dataBytes.total)
})

// throttle의 생성자로 넘긴 ms만큼 chunk stream 사이에 delay를 걸고, report를 통해 누산된 bytes를 표시하고, writeStream을 통해 파일을 작성합니다.
readStream.pipe(throttle).pipe(report).pipe(writeStream).on('error', console.error);

// echo 혹은 cat, tail 등은 stdin으로 평가됩니다.
// 즉, cmd에 pipe를 사용해서 구동 시킬 수 있습니다.
// 예를 들어, echo "hello world" | node stream.js
// 혹은 cat stream.js | node stream.js 등으로 사용 가능합니다.
process.stdin.pipe(writeStream);

// 위와 다른 점은 a-zA-Z0-9를 x로 치환한다는 것 입니다.
// 실제로 작동시킬 땐 위 아래 둘 중에 하나는 주석처리 해야합니다.
process.stdin.pipe(xStream).pipe(writeStream);
