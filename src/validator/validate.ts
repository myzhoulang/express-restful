import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ContextRunner } from 'express-validator/src/chain'

const validate = (validations: Array<ContextRunner>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req).array({ onlyFirstError: true })
    console.log('e', errors)
    if (errors.length <= 0) {
      return next()
    }
    res.status(400).json({ errors: errors })
  }
}

export default validate
