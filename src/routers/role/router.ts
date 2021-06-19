import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { patchValidator, postAndPutValidator } from './validator'
import { operator } from '../../middleware/operator'
import Service from './service'
import AuthorityService from '../authority/service'
import { RoleDocument } from './typings'
import { ObjectId } from 'mongoose'

const router: Router = Router()
const service = new Service()

// 获取所有
router.get('/', (req: Request, res: Response, next: NextFunction) => {
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
  postAndPutValidator,
  operator,
  async (req: Request, res: Response, next: NextFunction) => {
    // 抽取出 中间件
    const body = req.body as RoleDocument
    const title = body.title
    const authority_ids = body.authority_ids

    // 判断添加角色时候 传入的 权限ID 是否存在
    const auth = new AuthorityService()
    const result = await auth.findNoExistIds({ id: authority_ids })
    const noExistIds: Array<ObjectId> = []
    authority_ids.forEach((id: ObjectId) => {
      const authority = result.find((auth) => auth._id === id)
      if (!authority) noExistIds.push(id)
    })
    if (noExistIds.length > 0) {
      return next({
        status: 400,
        message: `authority_ids字段中的 [ ${noExistIds.join(',')} ]权限不存在`,
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
  },
)

// update
router.patch(
  '/:id',
  [validObjectId, patchValidator],
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
