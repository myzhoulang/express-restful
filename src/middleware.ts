import { Application } from 'express'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import auth from './middleware/auth'
import setSuccessData from './middleware/setData'
import config from './config'
import log from './middleware/log'
import permissions from './middleware/permissions'

const middleware = (app: Application) => {
  const { JWT_SECRET } = process.env
  app.use(cors(config.cors))
  app.use(helmet())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(setSuccessData)
  app.use(log)
  app.use(auth({ secret: JWT_SECRET as string, path: config.white?.path || [] }))
  app.use(permissions)
}

export default middleware
