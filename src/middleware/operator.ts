import { Request, Response, NextFunction } from 'express'

export function operator(req: Request, res: Response, next: NextFunction) {
  const user = req.user as IJWTPlayLoad
  const body = req.body
  if (req.method === 'POST') {
    body.created_by_name = user.name
    body.created_by = user.id
  }

  body.updated_by_name = user.name
  body.updated_by = user.id

  next()
}
