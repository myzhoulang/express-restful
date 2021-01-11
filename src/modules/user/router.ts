import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import { operator } from '../../middleware/operator'
import userService from './service'
import { IUser, UserDocument } from './typings'
import service from '../../util/crud'
import User from './schema'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  console.log(123)
  service
    .query<UserDocument>(User, req.query)
    .then(([users, total]) => {
      req.setData(200, { users, total })
      next()
    })
    .catch(next)
  // userService
  //   .query(req.query as IListQueryFields)
  //   .then(([users, total]) => {
  //     req.setData(200, { users, total })
  //     next()
  //   })
  //   .catch(next)
})

// 根据 _id 获取单个
router.get('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const { params, query } = req
  const id = params.id
  const fields = query.fields as string
  service
    .getOneById(User, id, fields)
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
    userService
      .create(body)
      .then((user) => {
        req.setData(201, user)
        next()
      })
      .catch((err) => {
        next(err)
      })
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
    userService
      .update(id, body)
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
  // 参数 result:
  // 成功删除返回删除的 docs
  // 删除失败返回 null
  service
    .deleteOneById(User, id)
    .then((result: UserDocument | null) => {
      if (result) {
        req.setData(204)
        next
      } else {
        next(new Error('删除的用户不存在'))
      }
    })
    .catch((err) => {
      next(err)
    })
})

export { router as user }
