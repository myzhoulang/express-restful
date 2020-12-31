import { Application } from 'express'
import { userRouter } from './modules/user/router'
import { roleRouter } from './modules/role/router'
import { authorizationsRoter } from './modules/authorizations/router'
export function initRouter(app: Application) {
  app.use(authorizationsRoter)
  app.use('/users', userRouter)
  app.use('/roles', roleRouter)
}
