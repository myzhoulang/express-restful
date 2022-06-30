export {}

declare global {
  export namespace upyun {}
  namespace NodeJS {
    interface Global {
      __rootdir__: string
    }

    interface ProcessEnv {
      JWT_SECRET: string
      DB_URL: string
      DB_PORT: string
      DB_DATABASE: string
      DB_USER: string
      DB_PASSWORD: string
      DB_AUTHSOURCE: string
      PORT: string
      REDIS_HOST: string
      REDIS_PORT: string
      REDIS_DB: string
      REDIS_PASSWORD: string
      OSS_BUCKET: string
      OSS_USER: string
      OSS_PASSWORD: string
      EMAIL_USER: string
      EMAIL_PASS: string
      COMMIT_SHA: string
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

      data: Record<string, any>
      log: Record<string, any>
      setData(status: number, data?: Record<string, any> | null): void
    }

    interface Response {
      body: Record<string, any>
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
