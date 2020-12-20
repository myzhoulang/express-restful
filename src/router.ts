import { Application } from 'express'
import { userRoter } from './modules/user/router'
import { authorizationsRoter } from './modules/authorizations/router'
export function initRouter(app: Application) {
  app.use(authorizationsRoter)
  app.use('/users', userRoter)
}
