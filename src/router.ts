import { Application } from 'express'
import { user } from './routers/user/router'
import { role } from './routers/role/router'
import { log } from './routers/log/router'
import { authority } from './routers/authority/route'
import { authorizations } from './routers/authorizations/router'
export function initRouter(app: Application) {
  app.use(authorizations)
  app.use('/authorities', authority)
  app.use('/users', user)
  app.use('/roles', role)
  app.use('/logs', log)
}
