import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { validatorLogin } from './validator'
import { auth } from './service'
import log from '../../middleware/log'
import RoleService from '../role/service'
import UserService from '../user/service'
import client from '../../util/redis'
import EMail from '../../modules/email'

const router: Router = Router()
const roleService = new RoleService()
const userService = new UserService()

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
    const current = await userService.getOneById(user.id).then((data) => data?.toJSON())
    if (current && Array.isArray(current.roles)) {
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

// 发送邮件给用户验证
router.get(
  '/user/email/request_verification',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IJWTPlayLoad
      const email = new EMail()
      const current = await userService.getOneById(user.id).then((data) => data?.toJSON())

      // 可以使用 UUID
      const emailCode = (Math.random() * 1000000) | 0
      //
      client.set(String(current?._id) + '_email_code', String(emailCode)).catch(next)
      email
        .send({
          from: '"Test" <604389771@qq.com>',
          to: current?.email,
          subject: '[后台管理] 请验证您的邮箱地址.',
          html: `<p>系统已将该验证码发送到您的电子邮箱: ${emailCode}</p>`,
        })
        .then(() => {
          req.setData(200, { message: '邮件发送成功' })
          next()
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (e) {
      next(e)
    }
  },
)

// 在此做校验
router.get('/user/verifiy_email', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query)
})

// 登出
export { router as authorizations }
