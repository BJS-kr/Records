import { Transform, Readable } from 'stream';
import { createWriteStream, createReadStream, readdirSync, PathLike } from 'fs';

function concatFile(dest: PathLike, files: string[]) {
    return new Promise<void>((resolve, reject) => {
        // file를 write할 스트림 생성
        const destStream = createWriteStream(dest);
        // element를 하나씩 내보내는 스트림 생성(from(Array))
        Readable.from(files).pipe(
            // Transform은 Duplex의 파생임. Duplex는 Readable과 Writable의 파생임
            // Transform은 zlib이나 crypto등 input과 output이 달라야 하는 기능에 광범위하게 사용됨
            new Transform({
                // string 데이터를 받을 것이므로 objectMode는 true
                objectMode: true, 
                // transform 메서드를 구현. 인자는 받는 데이터, 인코딩, transform 내부 콜백으로 구성
                // 내부 콜백은 error, data순으로 인자를 받을 수 있음(optional). error는 반드시 Error객체여야하며 이외에는 항상 null이어야함
                // 내부 콜백에 인자가 주어진다면, 그리고 error가 null이라면 data인자는 자동적으로 transform.push()를 호출함
                // 즉, { this.push(data); callback(); }과 { callback(null, data)) }는 equivalent함
                // 내부 콜백은 chunk가 processed 되었음을 알리는 역할임.
                transform(fileName, encoding, done) {
                    // 받은 데이터(Readable.from으로부터 받은 파일명)로 read stream생성
                    const fileContent = createReadStream('./txt/'+fileName);
                    // readable.pipe의 end옵션은 reader가 end되었을 때 writer도 end할지를 정하는 옵션
                    // read stream을 write stream으로 연결. 여러 파일을 write할 것이므로 이번 파일의 stream이 끝났다고 해서 pipe가 end이벤트를 발생시켜선 안되므로 end는 false
                    fileContent.pipe(destStream, { end: false });
                    fileContent.on('error', done);
                    // end가 호출되기 전까지 readable.read()는 자동으로 연속 호출 됨
                    fileContent.on('end', done);
                }
            }))
            .on('error', reject)
            // end와 finish의 차이점
            // end: stream.Readable로부터 파생된 이벤트. 모든 데이터가 방출 된 후, transform._flush가 호출되면 발생
            // finish: stream.writable로부터 파생된 이벤트. end의 발생 이후, 모든 데이터가 stream._transform()에 의해 처리된 이후 발생. error 발생시 finish이벤트는 발생해선 안된다.
            .on('finish', () => {
                // 위 pipe처리에서 end:false로 지정했던 부분을 이곳에서 처리
                // 모든 파일의 read stream이 종료되었고, finish이벤트가 발생했다는 것은 write process도 완료되었다는 의미이기에 비로소 end()를 호출 가능
                destStream.end()
                resolve()
            });

    });
}

concatFile(process.argv[2], readdirSync('./txt')).catch(console.error)
