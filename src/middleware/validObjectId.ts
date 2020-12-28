import { Request, Response, NextFunction } from 'express'
import isValidObjectId from '../util/validObjectId'

export default function validObjectId(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  if (isValidObjectId(id)) {
    next()
  } else {
    next({ status: 422, message: '非法的ID' })
  }
}
