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
      return
    } else {
      next()
    }
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

      const current = await userService.getUserPopulateRole(user.id)
      if (current && Array.isArray(current.role_ids)) {
        // 获取当前用户的的权限
        const auth = await roleService.getAuthorityByRoleIds(current.role_ids)
        const user = {
          ...current.toJSON({
            transform: function (doc, ret) {
              delete ret.id
            },
          }),
          auth: auth?.flat(1),
        }
        client.set(String(user._id), JSON.stringify(user))
        req.setData(200, user)
      }
      next()
    } catch (e) {
      next({ status: 500, message: e.message })
    }
  })

// 登出
export { router as authorizations }
