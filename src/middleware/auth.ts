import jwt from 'express-jwt'
import { List } from '../config'

interface AuthOptions {
  secret: string
  path: Array<string>
}

export default function auth(config: AuthOptions) {
  return jwt({ secret: config.secret, algorithms: ['HS256'] }).unless({
    path: config.path,
  })
}
