import fs from 'fs'
import path from 'path'
import morgan from 'morgan'
import FileStreamRotator from 'file-stream-rotator'

import type { Request, Response } from 'express'

const logDirectory = path.join(__dirname, '../log')

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const successLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'success-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
})

const failLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'fail-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
})

// 自定义记录字段
morgan.token('body', (req: Request) => {
  return `body => ${JSON.stringify(req.body)} -`
})
morgan.token('params', (req: Request) => {
  return `params => ${JSON.stringify(req.params)} -`
})
morgan.token('user', (req: Request) => {
  return `操作人 => ${req?.user && req?.user?.name} -`
})
morgan.token('date', () => {
  return new Date().toLocaleString()
})
morgan.token('localdate', () => {
  const day = new Date()
  return `${day.toLocaleDateString()} ${day.toTimeString()}`
})

// 需要日志记录字段
const successLog = '[:localdate] :method :url :status :params :body :user :response-time ms'
const failLog = '[:localdate] :method :url :status :params :body :user :response-time ms'

// 成功
export const successLogger = morgan(successLog, {
  stream: successLogStream,
  skip: function (req: Request, res: Response) {
    return res.statusCode > 400
  },
})

// 失败
export const failLogger = morgan(failLog, {
  stream: failLogStream,
  skip: function (req: Request, res: Response) {
    return res.statusCode < 400
  },
})

export default {
  successLogger,
  failLogger,
}
