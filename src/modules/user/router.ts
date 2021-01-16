import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import { operator } from '../../middleware/operator'
import { UserDocument } from './typings'
import Service from './service'

const router: Router = Router()
const service = new Service()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  service
    .query(req.query)
    .then(([users, total]) => {
      req.setData(200, { users, total })
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
    .then((user: UserDocument | null) => {
      req.setData(200, user)
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
    const body = req.body as UserDocument
    service
      .getByPhone(body.phone)
      .then((user) => {
        if (!user) {
          return service.create(body)
        } else {
          return Promise.reject({ status: 409, message: `手机号 ${body.phone} 已存在` })
        }
      })
      .then((user) => {
        req.setData(201, user)
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
    const body = req.body as UserDocument
    service
      .updateOneById(id, body)
      .then((user) => {
        if (user) {
          req.setData(200, user)
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

// 删除指定 id 的用户
router.delete('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  service
    .deleteOneById(id)
    .then((result: UserDocument | null) => {
      if (result) {
        req.setData(204)
        next
      } else {
        next(new Error('删除的用户不存在'))
      }
    })
    .catch(next)
})

export { router as user }
