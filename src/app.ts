import express, { Application, Request, Response, NextFunction } from 'express'
import middleware from './middleware'
import * as Sentry from './util/sentry'
import * as DB from './util/db'
import * as router from './router'

export const getApp = (): Application => {
  const app: Application = express()

  // 链接数据库
  DB.connect()

  // 中间件
  middleware(app)

  // sentry
  Sentry.request(app)

  // router
  router.initRouter(app)

  // 错误处理
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error)
    res.status(error.status || 500).json({
      message: error.message,
    })

    next()
  })

  return app
}
