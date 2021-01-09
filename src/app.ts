import express, { Application, Request, Response, NextFunction } from 'express'
import middleware from './middleware'
import * as Sentry from './util/sentry'
import * as DB from './util/db'
import * as router from './router'
import { Error } from './util/types'
import service from './modules/log/service'
import filter from './util/filter'

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

  // 处理成功
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.data)
    const { status = 200, data } = req.data
    res.status(status).json(data)
    next()
  })

  // 错误处理
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const { message, errors, status = 500, name } = error
    if (name === 'UnauthorizedError' || status === 401) {
      req.setData(401)
      res.status(401).json({
        message: '账号未登录或已失效',
      })
    } else {
      res.status(status).json({
        message: message,
        errors: errors,
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
      service.create(req.log)
    } catch (e) {
      console.log('服务器出错')
    }
  })

  return app
}
