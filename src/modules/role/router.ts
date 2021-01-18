import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import { operator } from '../../middleware/operator'
import Service from './service'
import { RoleDocument } from './typings'

const router: Router = Router()
const service = new Service()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query)
    .then(([roles, total]) => {
      req.setData(200, { roles, total })
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
    .then((role: RoleDocument | null) => {
      if (role) {
        req.setData(200, role)
      } else {
        req.setData(404, { message: `没有 ID 为${id}的角色` })
      }

      next()
    })
    .catch(next)
})

// 新增
router.post(
  '/',
  validatorAddOrRepacleBody,
  operator,
  (req: Request, res: Response, next: NextFunction) => {
    // 抽取出 中间件
    const body = req.body as RoleDocument
    const title = body.title
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
  },
)

// update
router.patch(
  '/:id',
  [validObjectId, validatorUpdateBody],
  operator,
  (req: Request, res: Response, next: NextFunction) => {
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
  },
)

// 删除指定 id 的角色
router.delete('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
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
