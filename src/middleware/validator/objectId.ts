import { Request, Response, NextFunction } from 'express'
import { param } from 'express-validator'
import { validate } from '../../validator'

export default function objectId(req: Request, res: Response, next: NextFunction) {
  return validate([param('id').notEmpty().isMongoId().withMessage('非法的ID')])(req, res, next)
}
