import { Router, Request, Response, NextFunction } from 'express'
import { validObjectId } from '../../middleware/validator'
import { validatorListParams, validatorAddOrRepacleBody, validatorUpdateBody } from './validator'
import userService from './service'
import { IUserQuery, UserDocument } from './typings'

const router: Router = Router()

// 获取所有
router.get('/', validatorListParams, (req: Request, res: Response, next: NextFunction) => {
  userService
    .query(req.query as IUserQuery)
    .then(([users, total]) => {
      res.json({ users, total })
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
    .then((user: UserDocument | null) => {
      res.status(200).json({ user })
    })
    .catch(next)
})

// 新增
router.post('/', validatorAddOrRepacleBody, (req: Request, res: Response, next: NextFunction) => {
  const user = req.body

  userService
    .create(user)
    .then((data) => {
      res.status(201).json(data)
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
    console.log(req)
    const id = req.params.id
    const body = req.body
    userService
      .update(id, body)
      .then((data) => {
        if (data) {
          res.status(200).json(data)
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
      res.status(204).json()
    } else {
      next(new Error('删除的用户不存在'))
    }
  })
})

export { router as userRoter }
