import { Schema } from 'mongoose'
declare global {
  namespace NodeJS {
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
  export interface IJWTPlayLoad {
    name: string
    id: Schema.Types.ObjectId
    exp: number
    iat: number
    auth: {
      codes: Array<string>
      titles: Array<string>
    }
  }
  namespace Express {
    interface Request {
      user?: IJWTPlayLoad
      data: any
      log?: any
      setData(status: number, data?: any): void
    }
  }

  export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

  export type HttpStatusCode =
    | 200
    | 201
    | 204
    | 400
    | 401
    | 403
    | 404
    | 405
    | 409
    | 410
    | 422
    | 500
    | 503
}
