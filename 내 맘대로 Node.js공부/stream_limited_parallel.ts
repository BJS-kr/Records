import { Transform, TransformCallback, TransformOptions } from 'stream';

export class limitedParallelStream extends Transform {
  private running = 0;
  private delayedCallback:TransformCallback | null = null;
  private terminateCallback: TransformCallback | null = null;
  constructor(
    private readonly concurrencyLimit:number, 
    private readonly transformFunc:(chunk:any, encoding:BufferEncoding, push:(chunk:any, encoding?:BufferEncoding) => boolean, done:(err?)=>boolean) => any, 
    options?:TransformOptions) {
    super(options)
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
      this.running++
      this.transformFunc(chunk, encoding, this.push.bind(this), this._done.bind(this));
      if (this.running >= this.concurrencyLimit) {
        this.delayedCallback = callback
      } else callback()
  }

  _flush(callback: TransformCallback): void {
      this.running > 0 ? this.terminateCallback = callback : callback()
  }

  _done(err:Error) {
    this.running--;

    if (err) return this.emit('error', err);

    this.delayedCallback && this.delayedCallback();
    this.delayedCallback = null;

    !this.running && this.terminateCallback && this.terminateCallback()
  }
}