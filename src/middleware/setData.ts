import { Request, Response, NextFunction } from 'express'

export default function setSuccessData(req: Request, res: Response, next: NextFunction): void {
  req.setData = function (status, data) {
    req.data = {
      status,
      data,
    }
  }
  next()
}
