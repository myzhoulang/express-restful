import { Router, Request, Response, NextFunction } from 'express'
import { validator } from './validator'
import { operator } from '../../middleware/operator'
import allMethods from '../../middleware/allMethods'
import Service from './service'
import AuthorityService from '../authority/service'
import { RoleDocument } from './typings'

const router: Router = Router()
const service = new Service()

// 获取所有
router
  .route('/')
  .all(allMethods(['GET', 'POST']))
  .get((req: Request, res: Response, next: NextFunction) => {
    service
      .query(req.query)
      .then(([roles, total]) => {
        req.setData(200, { roles, total })
        next()
      })
      .catch(next)
  })
  .post(validator, operator, async (req: Request, res: Response, next: NextFunction) => {
    // 抽取出 中间件
    const body = req.body as RoleDocument
    const title = body.title
    const authority_ids = body.authority_ids

    // 判断添加角色时候 传入的 权限ID 是否存在
    const auth = new AuthorityService()
    const result = await auth.findNoExistIds({ id: { $in: authority_ids } })
    if (result.length > 0) {
      return next({
        status: 400,
        message: `authority_ids字段中的 [ ${result.join(',')} ]权限不存在`,
      })
    }

    service
      .getOneByTitle(title)
      .then((role) => {
        if (!role) {
          return service.create(body)
        } else {
          return Promise.reject({ status: 409, message: `角色名称 ${body.title} 已存在` })
        }
      })
      .then((role) => {
        req.setData(201, role)
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
      .then((role) => {
        if (role) {
          req.setData(200, role)
        } else {
          req.setData(404, { message: `没有 ID 为${id}的角色` })
        }

        next()
      })
      .catch(next)
  })
  .patch(validator, operator, (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    // 抽取出 中间件
    const body = req.body as RoleDocument
    service
      .updateOneById(id, body)
      .then((role) => {
        if (role) {
          req.setData(200, role)
        } else {
          req.setData(404, { message: `没有 ID 为${id}的角色` })
        }
        next()
      })
      .catch(next)
  })
  .delete(validator, (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    // 参数 result:
    // 成功删除返回删除的 docs
    // 删除失败返回 null
    service
      .deleteOneById(id)
      .then((result: RoleDocument | null) => {
        if (result) {
          req.setData(204)
        } else {
          req.setData(404, { message: `没有 ID 为${id}的角色` })
        }
        next()
      })
      .catch(next)
  })

export { router as role }
