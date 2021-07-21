import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { validatorLogin } from './validator'
import { auth } from './service'
import log from '../../middleware/log'
import allMethods from '../../middleware/allMethods'
import RoleService from '../role/service'
import UserService from '../user/service'
import client from '../../util/redis'

const router: Router = Router()
const roleService = new RoleService()
const userService = new UserService()

// 登录
// 测试账号：604389771@qq.com
// 密码： 123456
router.post(
  '/login',
  allMethods(['POST']),
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
router
  .route('/user')
  .all(allMethods(['GET']))
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user || !user.id) {
        return next({
          status: 401,
        })
      }
      const current = await userService.getOneById(user.id).then((data) => data?.toJSON())
      if (current && Array.isArray(current.roles)) {
        // 获取当前用户的的权限
        const [auth] = await roleService.getAuthorityByRoleIds(current.roles)
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
