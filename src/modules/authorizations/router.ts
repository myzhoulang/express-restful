import { Router, Request, Response, NextFunction } from 'express'
// import User from './schema'

const router: Router = Router()

// 登录
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  res.json(req.body)
})

export { router as authorizationsRoter }
