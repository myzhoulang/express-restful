import { Request, Response, NextFunction } from 'express'
import service from '../modules/authority/service'
import { Methods } from '../modules/authority/typings'
import client from '../util/redis'

export default function permissions(req: Request, res: Response, next: NextFunction) {
  const path = req.path
  const method: Methods = req.method as Methods
  const user = req.user
  return Promise.all([
    client.get(user?.id as string).then((data) => {
      if (data === null) {
        return []
      } else {
        return JSON.parse(data)
      }
    }),
    service.getOneByPathAndMethod({ path, method }),
  ])
    .then(([user = {}, authority]) => {
      if (authority) {
        if (user.codes.includes(authority.code)) {
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
