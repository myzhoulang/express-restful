import { Request, Response, NextFunction } from 'express'
import { validationResult, Schema, checkSchema } from 'express-validator'
import { ContextRunner } from 'express-validator/src/chain'

const validate = (validations: Array<ContextRunner>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req).array({ onlyFirstError: true })
    if (errors.length <= 0) {
      return next()
    }
    res.status(400).json({ errors: errors })
  }
}
const checkSchemaValidator = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkSchema(schema).run(req)
      const errors = validationResult(req).array({ onlyFirstError: true })
      if (errors.length <= 0) {
        return next()
      }
      res.status(400).json({ errors })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}
export { validate, checkSchemaValidator }
