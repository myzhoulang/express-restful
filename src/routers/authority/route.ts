import { Router, Request, Response, NextFunction } from 'express'
import { validator } from './validator'
import allMethods from '../../middleware/allMethods'
import Service from './service'
import { operator } from '../../middleware/operator'
import { AuthorityDocument, IAuthority } from './typings'

const service = new Service()
const router: Router = Router()

// 获取所有
router
  .route('/')
  .all(allMethods(['GET', 'POST']))
  .get((req: Request, res: Response, next: NextFunction) => {
    service
      .query(req.query)
      .then(([authories, total]) => {
        req.setData(200, { authories, total })
        next()
      })
      .catch(next)
  })
  .post(validator, operator, (req: Request, res: Response, next: NextFunction) => {
    // 抽取出 中间件
    const body = req.body as AuthorityDocument
    const { code } = body
    service
      .getByCode(code)
      .then<AuthorityDocument>((authority) => {
        if (!authority) {
          return service.create(body)
        } else {
          return Promise.reject({ status: 409, message: `权限标识符 ${body.code} 已被添加` })
        }
      })
      .then((authority) => {
        req.setData(201, authority.toJSON())
        next()
      })
      .catch(next)
  })

// 根据 _id 获取单个
router
  .route('/:id')
  .all(allMethods(['GET', 'PATCH', 'DELETE']))
  .get(validator, (req: Request, res: Response, next: NextFunction) => {
    const { params, query } = req
    const id = params.id
    const project = query.project as string
    service
      .getOneById(id, project)
      .then((authority) => {
        if (authority) {
          req.setData(200, authority)
        } else {
          req.setData(404, { message: `没有 ID 为 ${id} 的权限` })
        }

        next()
      })
      .catch(next)
  })
  .patch(validator, operator, (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const body = req.body as AuthorityDocument
    service
      .updateOneById(id, body)
      .then((authority) => {
        if (authority) {
          req.setData(200, authority)
        } else {
          req.setData(404, { message: `没有 ID 为 ${id} 的权限` })
        }
        next()
      })
      .catch(next)
  })
  .delete(validator, (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    service
      .deleteOneById(id)
      .then((result) => {
        if (result) {
          req.setData(204)
          next()
        } else {
          req.setData(404, { message: `没有 ID 为 ${id} 的权限` })
        }
        next()
      })
      .catch(next)
  })

export { router as authority }
