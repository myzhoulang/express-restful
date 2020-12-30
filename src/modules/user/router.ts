import { Router, Request, Response, NextFunction } from 'express'
import User from './schema'
import { validObjectId } from '../../middleware/validator'
import { listRules } from './validator'
import userService from './service'
import { IUser, IUserQuery, QueryFields, UserModel } from './typings'

const router: Router = Router()

// 获取所有
router.get('/', listRules, (req: Request, res: Response, next: NextFunction) => {
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
  const fields = query.fields as QueryFields
  userService
    .getUserById(id, fields)
    .then((user: UserModel | null) => {
      res.status(200).json({ user })
    })
    .catch(next)
})

// 新增
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const user = {
    name: 'zhoulang',
    phone: '15088747046',
    email: '604389771@qq.com',
    password: '123456',
    gender: 1,
    status: 1,
  }
  const model: UserModel = new User(user)
  model
    .save()
    .then((data) => {
      res.status(201).json(data)
    })
    .catch((e) => {
      console.log(e)
    })
})

// update
router.patch('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const body = req.body
  console.log(body)
  User.findByIdAndUpdate(id, body)
    .then((data) => {
      if (data) {
        res.status(200).json(data)
      } else {
        next(new Error('删除的用户不存在'))
      }
    })
    .catch((err) => {
      next(err)
    })
})

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
