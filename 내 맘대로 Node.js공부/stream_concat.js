import { Transform, Readable } from 'stream';
import { createWriteStream, createReadStream, readdirSync } from 'fs';

function concatFile(dest, files) {
    return new Promise((resolve, reject) => {
        const destStream = createWriteStream(dest);
        Readable.from(files).pipe(
            new Transform({
                objectMode: true, 
                transform(fileName, encoding, done) {
                    const fileContent = createReadStream('./txt/'+fileName);
                    fileContent.pipe(destStream, { end: false });
                    fileContent.on('error', done);
                    fileContent.on('end', done);
                }
            }))
            .on('error', reject)
            .on('finish', () => {
                destStreams
            });

    });
}

await concatFile(process.argv[2], readdirSync('./txt'));
