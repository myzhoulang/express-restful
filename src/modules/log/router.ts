import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams } from './validator'
import logService from './service'
import service from '../../util/crud'
import { LogDocument } from './typings'
import Log from './schema'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(Log, req.query)
    .then(([logs, total]) => {
      req.setData(200, { logs, total })
      next()
    })
    .catch(next)
})

// 根据 _id 获取单个
router.get('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const { params, query } = req
  const id = params.id
  const fields = query.fields as string
  service
    .getOneById(Log, id, fields)
    .then((log: LogDocument | null) => {
      req.setData(200, log)
      next()
    })
    .catch(next)
})

export { router as log }
