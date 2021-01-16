import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import Service from './service'
import { operator } from '../../middleware/operator'
import { AuthorityDocument, IAuthority } from './typings'

const service = new Service()
const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query)
    .then(([authories, total]) => {
      req.setData(200, { authories, total })
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
    .then((authority: IAuthority | null) => {
      req.setData(200, authority)
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
    const body = req.body as AuthorityDocument
    const { code } = body
    service
      .getByCode(code)
      .then((authority) => {
        if (!authority) {
          return service.create(body)
        } else {
          return Promise.reject({ status: 409, message: `权限标识符 ${body.code} 已被添加` })
        }
      })
      .then((authority) => {
        req.setData(201, authority)
        next()
      })
      .catch(next)
  },
)

// update
router.patch(
  '/:id',
  validObjectId,
  validatorUpdateBody,
  operator,
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const body = req.body as AuthorityDocument
    service
      .updateOneById(id, body)
      .then((authority) => {
        if (authority) {
          req.setData(200, authority)
          next()
        } else {
          next(new Error('更新的用户不存在'))
        }
      })
      .catch(next)
  },
)

// 删除指定 id 的角色
router.delete('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  service
    .deleteOneById(id)
    .then((result: AuthorityDocument | null) => {
      if (result) {
        req.setData(204)
        next()
      } else {
        next(new Error('删除的用户不存在'))
      }
    })
    .catch(next)
})

export { router as authority }
