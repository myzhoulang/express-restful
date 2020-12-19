import jwt from 'express-jwt'
import { Whitelist } from '../config'

interface AuthOptions extends Whitelist {
  secret: string
}

export default function auth(config: AuthOptions) {
  return jwt({ secret: config.secret, algorithms: ['HS256'] }).unless({
    path: config.path,
  })
}
