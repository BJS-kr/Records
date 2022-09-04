import { IncomingMessage, ServerResponse, createServer  } from 'http'
import { createReadStream, createWriteStream, stat } from 'fs'
import { promisify} from 'util'
import busboy from 'busboy'

const filePath = './data2.mp4'
const fileInfo = promisify(stat)

const originalVideo = async (req: IncomingMessage, res: ServerResponse) => {
    // stat의 콜백을 사용하지 않도록 promisify
    const { size } = await fileInfo(filePath)
    // 브라우저에게 얼만큼 진행됐는지 알려 줄 수 있는 정보
    const { range } = req.headers

    // 비디오 재생 중 하단의 재생 바를 누르는 것 하나 하나가 req입니다.
    // 즉, range에 대한 정보가 req에 담겨서 도착하게 되는 것입니다.

    if (range) {    
    let [start, end]:(number|string)[] = range.replace(/bytes=/, "").split("-")
    // 10진수로 변환
    start = parseInt(start, 10)
    // end가 특정되지 않을 경우 데이터의 끝까지
    end = end ? parseInt(end, 10) : size - 1

    // 진행바를 클릭한 부분(start)부터 end지점까지의 사이즈
    const chunkLength = (end-start) + 1

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkLength,
      'Content-Type': 'video/mp4',
    });

    createReadStream(filePath, {start, end}).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': size,
        'Content-Type': 'video/mp4',
      })
      
      createReadStream(filePath).pipe(res)
    }
}

const uploadVideoForm = (res: ServerResponse) => {
   res.writeHead(200, {
     'Content-Type': 'text/html'
   })

   res.end(`
    <form enctype="multipart/form-data" method="POST" action="/">
      <input type="file" name="upload-file">
      <button>Upload File</button>
    </form>
   `)
}

const uploadVideo = (req: IncomingMessage, res: ServerResponse)=> {
  const bb = busboy({ headers: req.headers })

  bb.on('file', (name, file, info) => {
    const { filename } = info;
    file.pipe(createWriteStream(`./${filename}`))
  })

  bb.on('close', () => {
    res.writeHead(200, { 'Connection': 'close' })
    res.end('That\'s all :)')
  })

  req.pipe(bb)
}

createServer(async (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.url)
  
 if (req.method === 'POST') {
    uploadVideo(req, res)
 } else if (req.url === '/original') {
    originalVideo(req, res)
 } else if (req.url === '/') {
    uploadVideoForm(res)
 } else {
  res.writeHead(404);
  res.end();
 }

}).listen(8080, () => {
    console.log('server is running on 8080')
})
