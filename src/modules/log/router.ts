import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams } from './validator'
import service from './service'
import { LogDocument } from './typings'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query as IListQueryFields)
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
    .getById(id, fields)
    .then((log: LogDocument | null) => {
      req.setData(200, log)
      next()
    })
    .catch(next)
})

export { router as log }
