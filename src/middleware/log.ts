import { Request, Response, NextFunction } from 'express'

export default function log(req: Request, res: Response, next: NextFunction) {
  const user = req.user
  req.log = {
    user_id: user?.id,
    user_name: user?.name,
    request_url: req.originalUrl,
    request_ip: req.ip,
    request_methods: req.method,
    request_start_at: Date.now(),
  }

  next()
}
