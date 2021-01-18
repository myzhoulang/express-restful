import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams } from './validator'
import Service from './service'
import { LogDocument } from './typings'

const router: Router = Router()
const service = new Service()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query)
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
  const project = query.project as string
  service
    .getOneById(id, project)
    .then((log: LogDocument | null) => {
      if (log) {
        req.setData(200, log)
      } else {
        req.setData(404, { message: '没有该日志' })
      }

      next()
    })
    .catch(next)
})

export { router as log }
