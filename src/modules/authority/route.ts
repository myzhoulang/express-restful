import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import authorityService from './service'
import { operator } from '../../middleware/operator'
import { AuthorityDocument, IAuthority } from './typings'
import service from '../../util/crud'
import Authority from './schema'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query)
  service
    .query(Authority, req.query)
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
  const fields = query.fields as string
  service
    .getOneById(Authority, id, fields)
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
    authorityService
      .getByCode(code)
      .then((authority) => {
        if (!authority) {
          return service.create(Authority, body)
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
      .updateOneById(Authority, id, body)
      .then((authority) => {
        if (authority) {
          req.setData(200, authority)
          next()
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
  service
    .deleteOneById(Authority, id)
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
