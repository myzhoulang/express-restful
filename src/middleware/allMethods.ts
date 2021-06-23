import { Request, Response, NextFunction } from 'express'

const allMethods =
  (methods: Array<HttpMethods> = ['GET']) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (methods.includes(req.method as HttpMethods)) return next()

    next({ status: 405, message: 'Method Not Allowed', header: { Allow: methods.join(', ') } })
  }
export default allMethods
