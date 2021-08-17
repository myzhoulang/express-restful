import { Request, Response, NextFunction } from 'express'
import { validationResult, Schema, checkSchema } from 'express-validator'
import { ContextRunner } from 'express-validator/src/chain'

const validate = (validations: Array<ContextRunner>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req).array({ onlyFirstError: true })
    if (errors.length <= 0) {
      next()
    } else {
      res.status(400).json({ errors: errors })
    }
  }
}

export type CheckSchemaValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>

const checkSchemaValidator = (schema: Schema): CheckSchemaValidator => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Promise.all(checkSchema(schema).map((validation) => validation.run(req)))
      const errors = validationResult(req).array({ onlyFirstError: true })
      if (errors.length <= 0) {
        next()
      } else {
        res.status(400).json({ errors })
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}
export { validate, checkSchemaValidator }
