import { Router, Request, Response, NextFunction } from 'express'
import User, { UserModel } from './schema'
import { validObjectId } from '../../middleware/validator'
import { listRules } from './validator'
import userService from './service'
import { IUserQuery } from './typings'

const router: Router = Router()
// 获取所有
router.get('/', listRules, (req: Request, res: Response, next: NextFunction) => {
  console.log('req', req.query)
  userService.query(req.query as IUserQuery).then((data) => {
    res.json(data)
  })
})

// 根据 _id 获取单个
router.get('/:id', validObjectId, (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id

  User.findById(id).then((data) => {
    console.log(data)
    res.status(200).json(data)
  })
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
  User.findByIdAndDelete(id).then((result) => {
    if (result) {
      res.status(204).json()
    } else {
      next(new Error('删除的用户不存在'))
    }
  })
})

export { router as userRoter }
