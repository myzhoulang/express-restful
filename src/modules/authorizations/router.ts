import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { validatorLogin } from './validator'
import { auth } from './service'
import log from '../../middleware/log'
import userService from '../user/service'
import roleService from '../role/service'

const router: Router = Router()

// 登录
router.post(
  '/login',
  log,
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

// 获取登录用户信息
router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user || !user.id) {
    return next({
      status: 401,
    })
  }
  const current = await userService.getById(user?.id)
  if (current && Array.isArray(current.roles)) {
    const [auths] = await roleService.getAuthoriesForRoles(current.roles)
    console.log(auths)
    const data = {
      ...current,
      auths,
    }
    req.setData(200, data)
  }

  next()
})
// 登出
export { router as authorizations }
