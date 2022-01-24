const { createReadStream, createWriteStream} = require('fs');
const { PassThrough, Duplex, Transform } = require('stream')


const readStream = createReadStream('/Users/james/Desktop'+'/ha.png');
const writeStream = createWriteStream(__dirname+'/migrated.txt');

const writeStream2 = createWriteStream(__dirname+'/stdin.txt', {encoding:'utf-8'})

const report = new PassThrough();

class Transformer extends Transform {
  constructor(char) {
    super();
    this.replaceChar =char
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = chunk.toString().replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar)
    this.push(transformChunk)
    callback()
  }

  _flush(callback) {
    this.push('more stuff us being passed through...')
    callback()
  }
}

class Throttle extends Duplex {
  constructor(ms) {
    super()
    this.delay = ms
  }
  _read() {}

  _write(chunk, encoding, callback) {
    this.push(chunk);
    setTimeout(callback, this.delay)
  }

  _final() {
    this.push(null)
  }
}

const throttle = new Throttle(10);
const xStream = new Transformer('x');

let total = 0;

report.on('data', (chunk) => {
  total += chunk.length;
  console.log('bytes: ', total)
})

// readStream.pipe(throttle).pipe(report).pipe(writeStream).on('error', console.error)

// echo "I'm BJS" | node src/testing/test.js
// cat src/testing/test.js | node src/testing/test.js
process.stdin.pipe(xStream).pipe(writeStream2)


const {createServer} = require('http')
const {createReadStream, createWriteStream, stat} = require('fs')
const {promisify} = require('util')
const filename = './data.txt'
const fileInfo = promisify(stat)

createServer(async (req, res) => {
    // 브라우저에게 얼만큼 진행됐는지 알려 줄 수 있는 정보
    const {size} = await fileInfo(filename)
    const {range} = req.headers

    // 비디오 재생 중 하단의 재생 바를 누르는 것 하나 하나가 req입니다.
    // 즉, range에 대한 정보가 req에 담겨서 도착하게 되는 것입니다.
    console.log('range: ', range)

    if (range) {
        let [start, end] = range.replace(/bytes=/, '').split('-')
        start = parseInt(start, 10)
        // start는 항상 존재하지만 end가 없을 수도 있기 때문에. 위의 console.log 찍어보면 이해감
        end = end ? parseInt(end, 10) : size - 1
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (start - end) + 1,
            'Content-Type': 'videos/mp4'
        })
        createReadStream(filename).pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': size,
            'Content-Type': 'videos/mp4'
        })
        // res is actually writable stream
        createReadStream(filename).pipe(res);
    }

    
}).listen(8080, () => {
    console.log('server is running on 8080')
})
