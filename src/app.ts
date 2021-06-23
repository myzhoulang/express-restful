import express, { Application, Request, Response, NextFunction } from 'express'
import middleware from './middleware'
import * as Sentry from './util/sentry'
import * as DB from './util/db'
import * as router from './router'
import { redisInit } from './util/redis'
import { Error } from './util/types'
import LogService from './routers/log/service'

const logService = new LogService()
export const getApp = (): Application => {
  const app: Application = express()

  // 链接数据库
  DB.connect()

  // 中间件
  middleware(app)

  // redis
  redisInit()

  // sentry
  Sentry.request(app)

  // router
  router.initRouter(app)

  // 处理成功
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { status, data } = req.data || {}
    if (status >= 200 && status <= 299) {
      logService.save(req, { status })
      res.status(status).json(data)
    } else {
      next()
    }
  })

  // 处理404
  app.use(function (req: Request, res: Response) {
    const { data } = req.data || {}
    logService.save(req, { status: 404 })
    res.status(404).json({ message: data?.message || '请求接口不存在' })
  })

  // // 错误处理
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const { message, errors, status, header } = error
    if (status) {
      res.set(header).status(status).json({
        message,
        errors,
      })
    } else {
      res.status(500).json({
        message: 'Server Error',
      })
    }
    logService.save(req, {
      status: status || 500,
      error_message: message,
    })
  })

  return app
}
