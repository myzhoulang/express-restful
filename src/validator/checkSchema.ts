import { Schema } from 'express-validator'
import { checkSchemaValidator } from './index'

export const checkSchema = (createRules: (method: HttpMethods) => Schema, method: HttpMethods) => {
  const id: Schema = {
    id: {
      in: ['params'],
      notEmpty: {
        errorMessage: 'id 不能为空',
      },
      isMongoId: {
        errorMessage: '非法的ID',
      },
    },
  }
  let rules: Schema = {}

  switch (method) {
    case 'PUT':
    case 'PATCH':
      rules = { ...createRules(method as HttpMethods), ...id }
      break
    case 'POST':
      rules = createRules(method as HttpMethods)
      break
    case 'DELETE':
    case 'GET':
      rules = id
      break
  }
  return checkSchemaValidator(rules)
}
