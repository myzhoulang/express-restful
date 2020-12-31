import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import service from './service'
import { IRoleQuery, RoleDocument } from './typings'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query as IRoleQuery)
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
  const fields = query.fields as string
  service
    .getById(id, fields)
    .then((role: RoleDocument | null) => {
      req.setData(200, { role })
      next()
    })
    .catch(next)
})

// 新增
router.post('/', validatorAddOrRepacleBody, (req: Request, res: Response, next: NextFunction) => {
  // 抽取出 中间件
  const user = req.user as IJWTPlayLoad
  const body = req.body as RoleDocument
  body.created_by_name = user.name
  body.updated_by_name = user.name
  body.created_by = user.id

  service
    .create(body)
    .then((role) => {
      req.setData(201, { role })
      next()
    })
    .catch((err) => {
      next(err)
    })
})

// update
router.patch(
  '/:id',
  validObjectId,
  validatorUpdateBody,
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    // 抽取出 中间件
    const user = req.user as IJWTPlayLoad
    const body = req.body as RoleDocument
    body.updated_by_name = user.name
    body.updated_by = user.id

    service
      .update(id, body)
      .then((role) => {
        if (role) {
          req.setData(200, { role })
        } else {
          next(new Error('更新的用户不存在'))
        }
      })
      .catch((err) => {
        next(err)
      })
  },
)

// 删除指定 id 的角色
router.delete('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  // 参数 result:
  // 成功删除返回删除的 docs
  // 删除失败返回 null
  service.deleteById(id).then((result) => {
    if (result) {
      req.setData(204)
      next()
    } else {
      next(new Error('删除的用户不存在'))
    }
  })
})

export { router as roleRouter }
