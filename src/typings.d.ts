import { Schema } from 'mongoose'

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

declare global {
  export interface IJWTPlayLoad {
    name: string
    id: Schema.Types.ObjectId
    exp: number
    iat: number
  }
  namespace Express {
    interface Request {
      user?: IJWTPlayLoad
      data: any
      log?: any
      setData(status: number, data?: any): void
    }
  }
}
