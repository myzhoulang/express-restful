import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import userService from './service'
import { IUser, UserDocument } from './typings'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  userService
    .query(req.query as IListQueryFields)
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
  const fields = query.fields as string
  userService
    .getById(id, fields)
    .then((user: IUser | null) => {
      req.setData(200, user)
      next()
    })
    .catch(next)
})

// 新增
router.post('/', validatorAddOrRepacleBody, (req: Request, res: Response, next: NextFunction) => {
  // TODO:抽取出 中间件
  const user = req.user as IJWTPlayLoad
  const body = req.body as UserDocument
  body.created_by_name = user.name
  body.created_by = user.id
  body.updated_by_name = user.name

  userService
    .create(body)
    .then((user) => {
      req.setData(201, user)
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
    const body = req.body as UserDocument
    body.updated_by_name = user.name
    body.updated_by = user.id

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
  userService.deleteById(id).then((result) => {
    if (result) {
      req.setData(204)
    } else {
      next(new Error('删除的用户不存在'))
    }
  })
})

export { router as user }
