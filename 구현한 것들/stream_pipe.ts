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
