declare module 'busboy' {
  import { Readable } from 'stream';

  interface BusboyConfig {
    headers?: object;
  }

  interface Busboy extends NodeJS.EventEmitter {
    on(
      event: 'file',
      listener: (fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string) => void,
    ): this;
    on(event: 'finish', listener: () => void): this;
  }

  function busboy(config: BusboyConfig): Busboy;

  export = busboy;
}
