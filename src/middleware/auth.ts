import express from 'express'
import jwt from 'express-jwt'
interface AuthOptions {
  secret: string
  path: Array<string>
}

export default function auth(config: AuthOptions): express.RequestHandler {
  return jwt({ secret: config.secret, algorithms: ['HS256'] }).unless({
    path: config.path,
  })
}
