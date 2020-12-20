import { Router, Request, Response, NextFunction } from 'express'
import User from './schema'

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
  const user = new User()
  user.save().then((data) => {
    res.json(data)
  })
})

export { router as userRoter }
