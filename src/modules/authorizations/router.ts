import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { validatorLogin } from './validator'
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

// 登出

export { router as authorizationsRoter }
