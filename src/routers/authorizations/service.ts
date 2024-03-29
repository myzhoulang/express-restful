import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../user/schema'
import UserService from '../user/service'
import { UserDocument } from '../user/typings'

const userService = new UserService()

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await userService.getAuthUser({ email })

    // 如果当前用户找不到 也返回账号或密码出错，防止用户泄露
    if (!user) {
      next({ message: '账号或密码错误', status: 401 })
      return
    }

    // compareSync
    // 第一个参数为 客户端传入的参数 明文的密码
    // 第二参数为 数据库存贮的加密后的密码
    const result: boolean = bcrypt.compareSync(password, user?.password)

    if (!result) {
      next({ message: '账号或密码错误', status: 401 })
      return
    }

    const { JWT_SECRET } = process.env
    const token = jwt.sign(
      {
        id: String((user as UserDocument)._id),
        name: (user as UserDocument).name,
      },
      JWT_SECRET as string,
      {
        expiresIn: '100h',
      },
    )
    // 更新最后登录时间以及对登录次数 +1
    User.setLoginCountAndAt(user._id)
    req.setData(200, { token })
    next()
  } catch (error) {
    next({ status: 500 })
  }
}
