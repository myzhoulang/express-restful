import { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import auth from './middleware/auth'
import setSuccessData from './middleware/setData'
import config from './config'
import log from './middleware/log'

const middleware = (app: Application) => {
  const { JWT_SECRET } = process.env
  app.use(cors(config.cors))
  app.use(helmet())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(setSuccessData)
  app.use(auth({ secret: JWT_SECRET as string, path: config.white?.path || [] }))
  app.use(log)
}

export default middleware
