import { Request, Response, NextFunction } from 'express'
import service from '../modules/authority/service'
import { Methods } from '../modules/authority/typings'

export default function permissions(req: Request, res: Response, next: NextFunction) {
  const path = req.path
  const method: Methods = req.method as Methods

  // MOCK codes 从 redis 中读取
  const codes = ['system:role']
  return service
    .getOneByPathAndMethod({ path, method })
    .then((authority) => {
      // 判断是否需要权限控制
      // 如果有 authority 就判断这个资源需要权限控制
      // 没有这个资源就直接过 不需要做权限控制
      if (authority) {
        if (codes.includes(authority.code)) {
          next()
        } else {
          next({ status: 403 })
        }
      } else {
        next()
      }
    })
    .catch(next)
}
