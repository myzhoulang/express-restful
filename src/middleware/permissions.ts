import { Request, Response, NextFunction } from 'express'
import AuthorityService from '../modules/authority/service'
import { Methods } from '../modules/authority/typings'
import client from '../util/redis'
import UserService from '../modules/user/service'

const userService = new UserService()
const authorityService = new AuthorityService()

function getUserAuthCodes(userId: string) {
  return client.get(userId).then((data) => {
    if (data === null) {
      return userService.getUserAuthCodes(userId)
    } else {
      const user = JSON.parse(data)
      return user.auth.codes
    }
  })
}

export default async function permissions(req: Request, res: Response, next: NextFunction) {
  const path = req.path
  const method: Methods = req.method as Methods
  const user = req.user
  // 首先权限表中查找，当前的 path 是否需要权限
  const auth = await authorityService.getOneByPathAndMethod({ path, method, type: 3 })
  console.log(auth)
  if (auth) {
    const codes = await getUserAuthCodes(user?.id as string)
    // 有权限进入
    if (codes.includes(auth.code)) {
      next()
    } else {
      next({ status: 403 })
    }
  } else {
    // 不需要控制直接进入
    next()
  }
}
