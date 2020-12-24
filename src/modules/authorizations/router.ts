import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
// import User from './schema'
import { validatorLogin } from './validator'
import response from '../../util/response'
import { IUser } from '../user/schema'

const router: Router = Router()

// 登录
router.post('/login', validatorLogin(), (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    response[400](res, { errors: errors.array() })
  }
})

export { router as authorizationsRoter }
