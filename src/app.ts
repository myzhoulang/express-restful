import express, { Application, Request, Response, NextFunction } from 'express'
import middleware from './middleware'
import * as Sentry from './util/sentry'
import * as DB from './util/db'
import * as router from './router'
import { redisInit } from './util/redis'
import { Error } from './util/types'
import service from './util/crud'
import Log from './modules/log/schema'
import filter from './util/filter'
import { LogDocument } from './modules/log/typings'
import { upload } from './modules/upload/upload'

export const getApp = (): Application => {
  const app: Application = express()

  // 链接数据库
  DB.connect()

  // 中间件
  middleware(app)

  // redis
  redisInit()

  upload()

  // sentry
  Sentry.request(app)

  // router
  router.initRouter(app)

  // 处理成功
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { status = 200, data } = req.data
    res.status(status).json(data)
    next()
  })

  // 错误处理
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const { message, errors, status, name } = error
    req.log.error_message = message
    if (status) {
      if (name === 'UnauthorizedError' || status === 401) {
        req.setData(401)
        res.status(401).json({
          message: '账号未登录或已失效',
        })
      } else {
        res.status(status).json({
          message,
          errors,
        })
      }
    } else {
      res.status(500).json({
        message: 'Server Error',
      })
    }
    next()
  })

  app.use((req: Request) => {
    try {
      req.log.request_times = Date.now() - req.log.request_start_at
      req.log.request_status = req?.data?.status
      // 过滤掉敏感信息
      // 敏感字段在 config 文件夹下的配置文件中配置
      req.log.request_body = filter.body(req.body)
      service.create(Log, req.log as LogDocument)
    } catch (e) {
      console.log('服务器出错')
    }
  })

  return app
}
