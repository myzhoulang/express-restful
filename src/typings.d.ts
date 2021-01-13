export {}

export interface IObjectAny {
  [key: string]: any
}
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
      REDIS_HOST: string
      REDIS_PORT: number
      REDIS_DB: number
      REDIS_PASSWORD: string
    }
  }
  export interface IJWTPlayLoad {
    name: string
    id: string
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
      data: IObjectAny
      log: IObjectAny
      setData(status: number, data?: IObjectAny | null): void
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
