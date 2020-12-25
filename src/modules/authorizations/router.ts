import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validatorLogin } from './validator'
import response from '../../util/response'
import User from '../user/schema'
import { auth } from './service'

const router: Router = Router()

// 登录
router.post(
  '/login',
  validatorLogin(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next({ status: 400, errors: errors.array() })
    }
    next()
  },
  auth,
)

export { router as authorizationsRoter }
