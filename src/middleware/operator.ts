import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongoose'

interface IUpdater {
  updated_by_name: string
  updated_by: ObjectId
}

interface ICreater {
  created_by_name: string
  created_by: ObjectId
}

export function updater<T extends IUpdater>(req: Request, res: Response, next: NextFunction) {
  // 抽取出 中间件
  const user = req.user as IJWTPlayLoad
  const body: T = req.body
  body.updated_by_name = user.name
  body.updated_by = user.id
  next()
}

export function creater<T extends ICreater>(req: Request, res: Response, next: NextFunction) {
  // 抽取出 中间件
  const user = req.user as IJWTPlayLoad
  const body: T = req.body
  body.created_by_name = user.name
  body.created_by = user.id
  next()
}
