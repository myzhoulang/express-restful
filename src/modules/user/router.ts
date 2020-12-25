import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User, { IUser, UserModel } from './schema'

const router: Router = Router()

// 获取所有
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  User.find().then((data) => {
    // next(data)
    res.json(data)
  })
})

// 新增
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const user: IUser = {
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

export { router as userRoter }
