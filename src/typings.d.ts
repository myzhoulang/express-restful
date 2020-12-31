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

  export interface IListPage {
    page: number
    size: number
  }

  // TODO: 处理成泛型接口
  export interface IListQueryFields extends IListPage {
    fields?: string
    sort: string
    direction?: number
    page: number
    size: number
    [key: string]: any
  }
}
