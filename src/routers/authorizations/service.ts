import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../user/schema'
import { UserDocument } from '../user/typings'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, password } = req.body
    const user: UserDocument | null = await User.findOne({ name }, '_id password')

    if (!user) {
      return next({ message: '账号或密码错误', status: 401 })
    }
    console.log(user)
    // compareSync
    // 第一个参数为 客户端传入的参数 明文的密码
    // 第二参数为 数据库存贮的加密后的密码
    const result: boolean = bcrypt.compareSync(password, (user as UserDocument).password)

    if (!result) {
      return next({ message: '账号或密码错误', status: 401 })
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
