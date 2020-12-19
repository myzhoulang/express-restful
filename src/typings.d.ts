declare interface Error {
  status?: number
}

declare namespace NodeJS {
  interface Global {
    __rootdir__: string
  }

  interface ProcessEnv {
    JWT_SECRET: string
    DB_URL: string
    DB_DATABASE: string
    PORT: string
  }
}
