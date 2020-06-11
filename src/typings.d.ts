declare interface Error {
  status?: number;
}

declare namespace NodeJS {
  interface Global {
    __rootdir__: string;
  }
}
