import { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import auth from './middleware/auth'
import config from './config'

const middleware = (app: Application) => {
  const { JWT_SECRET } = process.env
  app.use(cors(config.cors))
  app.use(helmet())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(auth({ secret: JWT_SECRET, path: config.white?.path || [] }))
}

export default middleware
