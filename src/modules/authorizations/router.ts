import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { validatorLogin } from './validator'
import { auth } from './service'
import log from '../../middleware/log'
import service from '../../util/crud'
import User from '../user/schema'
import RoleService from '../role/service'
import client from '../../util/redis'

const router: Router = Router()
const roleService = new RoleService()

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
  try {
    const user = req.user
    if (!user || !user.id) {
      return next({
        status: 401,
      })
    }
    const current = await service.getOneById(User, user.id).then((data) => data?.toJSON())
    if (current && Array.isArray(current.roles)) {
      const [auth] = await roleService.getAuthoriesForRoles(current.roles)
      const user = {
        ...current,
        auth,
      }
      client.set(String(user._id), JSON.stringify(user)).then((status) => console.log(status))
      req.setData(200, user)
    }

    next()
  } catch (e) {
    next({ status: 500, message: 'Server Error' })
  }
})
// 登出
export { router as authorizations }
